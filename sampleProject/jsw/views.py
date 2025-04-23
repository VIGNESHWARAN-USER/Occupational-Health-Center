# -*- coding: utf-8 -*-
import bcrypt
import json
import logging
import traceback
import random
import base64
import uuid
import os
from datetime import datetime, date, timedelta

# Django Core Imports
from django.forms import BooleanField, CharField, DateField, DateTimeField, FloatField, IntegerField, JSONField
from django.http import JsonResponse, HttpResponse, Http404, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.utils import timezone
from django.utils.timezone import make_aware, now
from django.utils.dateparse import parse_date as django_parse_date
from django.db.models import Max, Count, Sum, Q
from django.db import transaction, IntegrityError
from django.db.models.fields.files import ImageFieldFile, FieldFile
from django.core.files.storage import default_storage

# Django Auth Imports
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from matplotlib.offsetbox import TextArea

# App specific models
from .models import (
    AutoimmuneTest, CTReport, CultureSensitivityTest, Member, Dashboard, FitnessAssessment, OccupationalProfile, OthersTest, Prescription, Appointment,
    DiscardedMedicine, InstrumentCalibration, PharmacyMedicine,
    PharmacyStockHistory, WardConsumables, WomensPack, XRay, user, mockdrills,
    ReviewCategory, Review, eventsandcamps, VaccinationRecord,
    PharmacyStock, ExpiryRegister, employee_details, MedicalHistory,
    vitals, heamatalogy, RoutineSugarTests, RenalFunctionTest, LipidProfile,
    LiverFunctionTest, ThyroidFunctionTest, CoagulationTest, EnzymesCardiacProfile,
    UrineRoutineTest, SerologyTest, MotionTest, MensPack, OphthalmicReport,
    USGReport, MRIReport, Consultation, SignificantNotes, Form17, Form38,
    Form39, Form40, Form27
)

# Configure logging (ensure this is set up in settings.py ideally)
logger = logging.getLogger(__name__)

# --- Helper Functions ---

def parse_date_internal(date_str):
    """ Safely parse YYYY-MM-DD date strings """
    if not date_str: return None
    try: return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError): return None

def parse_form_date(date_str): # Specific helper for forms if needed
    return parse_date_internal(date_str)

def parse_form_age(age_str):
    try: return int(age_str) if age_str and age_str.isdigit() else None
    except (ValueError, TypeError): return None

def get_media_url_prefix(request):
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    if media_url.startswith('http'): return media_url
    else: return f"{request.scheme}://{request.get_host()}{media_url}"

def serialize_model_instance(instance):
    """ Converts model instance to dict, handles files/dates. """
    if instance is None: return {}
    data = model_to_dict(instance)
    for field_name, value in list(data.items()):
        if isinstance(value, FieldFile):
            try: data[field_name] = value.url if value else None
            except Exception: data[field_name] = None
        elif isinstance(value, (datetime, date)):
            data[field_name] = value.isoformat()
        if field_name.startswith('_'): del data[field_name]
    return data

ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt', 'mp4', 'mov', 'avi']

# --- Authentication & Member Management ---

def send_otp_via_email(email, otp):
    subject = "🔐 Password Reset OTP - JSW Health Portal"
    from_email = settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@example.com'
    recipient_list = [email]
    context = {"otp": otp, "email": email}
    try:
        html_content = render_to_string("otp_email_template.html", context)
        text_content = f"Your OTP for JSW Health Portal password reset is {otp}. This code is valid for 5 minutes."
        msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"OTP {otp} sent successfully to {email}.")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}. Error: {str(e)}", exc_info=True)
        return False

@csrf_exempt
def forgot_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username") # Expects employee_number
            if not username: return JsonResponse({"message": "Username (Employee Number) is required"}, status=400)
            member = Member.objects.get(employee_number=username)
            if not member.email: return JsonResponse({"message": "No email address found for this user."}, status=400)
            otp = random.randint(100000, 999999); cache_key = f"otp_{username}"
            cache.set(cache_key, otp, timeout=300)
            if send_otp_via_email(member.email, otp):
                return JsonResponse({"message": "OTP sent successfully to your registered email."}, status=200)
            else:
                cache.delete(cache_key)
                return JsonResponse({"message": "Failed to send OTP."}, status=500)
        except Member.DoesNotExist: return JsonResponse({"message": "User not found"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e: logger.exception("Error in forgot_password."); return JsonResponse({"message": "Unexpected error."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body); username = data.get("username"); otp_entered = data.get("otp")
            if not username or not otp_entered: return JsonResponse({"message": "Username and OTP required"}, status=400)
            cache_key = f"otp_{username}"; stored_otp = cache.get(cache_key)
            if stored_otp and str(stored_otp) == str(otp_entered):
                cache.delete(cache_key)
                cache.set(f"otp_verified_{username}", True, timeout=600)
                return JsonResponse({"message": "OTP verified successfully"}, status=200)
            else: return JsonResponse({"message": "Invalid or expired OTP"}, status=400)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e: logger.exception("Error in verify_otp."); return JsonResponse({"message": "Unexpected error."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        username = None # Initialize for logging
        try:
            data = json.loads(request.body); username = data.get("username"); new_password = data.get("newPassword")
            if not username or not new_password: return JsonResponse({"message": "Username and new password required"}, status=400)
            if not cache.get(f"otp_verified_{username}"): return JsonResponse({"message": "OTP not verified or expired."}, status=403)
            member = Member.objects.get(employee_number=username)
            hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            member.password = hashed_pw; member.save(update_fields=['password'])
            cache.delete(f"otp_verified_{username}")
            return JsonResponse({"message": "Password reset successful"}, status=200)
        except Member.DoesNotExist: return JsonResponse({"message": "User not found"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e: logger.exception("Error in reset_password."); cache.delete(f"otp_verified_{username}"); return JsonResponse({"message": "Unexpected error."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body); username = data.get('username'); password = data.get('password')
            if not username or not password: return JsonResponse({"message": "Username and password required."}, status=400)
            member = Member.objects.get(employee_number=username)
            if bcrypt.checkpw(password.encode('utf-8'), member.password.encode('utf-8')):
                return JsonResponse({"username": member.name, "accessLevel": member.role, "empNo": member.employee_number, "message": "Login successful!" }, status=200)
            else: return JsonResponse({"message": "Invalid credentials"}, status=401)
        except Member.DoesNotExist: return JsonResponse({"message": "Invalid credentials"}, status=401)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format"}, status=400)
        except Exception as e: logger.exception("Login failed."); return JsonResponse({"message": "Unexpected error."}, status=500)
    return JsonResponse({"message": "Invalid request method"}, status=405)

@csrf_exempt
def find_member_by_email(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email: return JsonResponse({'found': False, 'message': 'Email required'}, status=400)
        try:
            member = Member.objects.filter(email__iexact=email).first()
            if member:
                member_type = 'ohc' if member.employee_number else 'external'
                member_data = model_to_dict(member, exclude=['password', 'entry_date']) # Exclude sensitive/internal
                member_data['role'] = member.role.split(',') if member.role else []
                member_data['doj'] = member.doj.isoformat() if member.doj else None
                member_data['date_exited'] = member.date_exited.isoformat() if member.date_exited else None
                member_data['memberTypeDetermined'] = member_type
                return JsonResponse({'found': True, 'member': member_data}, status=200)
            else: return JsonResponse({'found': False, 'message': 'Member not found'}, status=200)
        except Exception as e: logger.exception(f"Error finding member by email {email}."); return JsonResponse({'found': False, 'message': 'Search error'}, status=500)
    return JsonResponse({'message': 'Only GET allowed'}, status=405)

@csrf_exempt
def add_member(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body); member_type = data.get('memberType')
            required = ['name', 'designation', 'email', 'role', 'phone_number']
            if member_type == 'ohc': required.extend(['employee_number', 'doj'])
            elif member_type == 'external': required.extend(['hospital_name', 'aadhar'])
            else: return JsonResponse({'message': 'Invalid memberType'}, status=400)
            missing = [f for f in required if not data.get(f)]
            if missing: return JsonResponse({'message': f"Missing fields: {', '.join(missing)}"}, status=400)
            if Member.objects.filter(email__iexact=data['email']).exists(): return JsonResponse({'message': f"Email already exists."}, status=409)
            if member_type == 'ohc' and Member.objects.filter(employee_number=data['employee_number']).exists(): return JsonResponse({'message': f"Employee number already exists."}, status=409)

            raw_pw = data.get('password', data['role'][0] + "123" if data.get('role') else "DefaultPass123!")
            hashed_pw = bcrypt.hashpw(raw_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            member_data = {'name': data['name'], 'designation': data['designation'], 'email': data['email'], 'role': ','.join(data.get('role', [])), 'phone_number': data['phone_number'], 'job_nature': data.get('job_nature'), 'date_exited': django_parse_date(data.get('date_exited')), 'password': hashed_pw, 'entry_date': date.today() }
            if member_type == 'ohc': member_data.update({'employee_number': data['employee_number'], 'doj': django_parse_date(data.get('doj'))})
            elif member_type == 'external': member_data.update({'hospital_name': data['hospital_name'], 'aadhar': data['aadhar']}) # Add 'do_access': data.get('do_access', False) if needed

            member = Member.objects.create(**member_data)
            logger.info(f"Member added ID: {member.id}, Type: {member_type}")
            return JsonResponse({'message': 'Member added successfully', 'memberId': member.id}, status=201)
        except json.JSONDecodeError: return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'message': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: logger.exception("add_member failed."); return JsonResponse({'message': 'Internal error.'}, status=500)
    return JsonResponse({'message': 'Only POST allowed'}, status=405)

@csrf_exempt
def update_member(request, member_id):
    if request.method == 'PUT':
        try:
            member = get_object_or_404(Member, pk=member_id)
            data = json.loads(request.body); member_type = data.get('memberType')
            if not member_type or (member_type == 'ohc' and not member.employee_number) or (member_type == 'external' and member.employee_number):
                return JsonResponse({'message': 'Member type mismatch or change not allowed.'}, status=400)
            required = ['name', 'designation', 'role', 'phone_number'];
            if member_type == 'external' and not data.get('aadhar'): required.append('aadhar')
            missing = [f for f in required if not data.get(f)];
            if missing: return JsonResponse({'message': f"Missing fields: {', '.join(missing)}"}, status=400)

            member.name = data.get('name', member.name); member.designation = data.get('designation', member.designation)
            member.role = ','.join(data.get('role', [])) if data.get('role') is not None else member.role
            member.phone_number = data.get('phone_number', member.phone_number); member.job_nature = data.get('job_nature', member.job_nature)
            member.date_exited = django_parse_date(data.get('date_exited')) if data.get('date_exited') is not None else member.date_exited
            if member_type == 'ohc': member.doj = django_parse_date(data.get('doj')) if data.get('doj') else member.doj
            elif member_type == 'external': member.hospital_name = data.get('hospital_name', member.hospital_name); member.aadhar = data.get('aadhar', member.aadhar)

            member.full_clean(); member.save()
            logger.info(f"Member updated ID: {member_id}")
            return JsonResponse({'message': 'Member updated successfully'}, status=200)
        except Http404: return JsonResponse({'message': 'Member not found'}, status=404)
        except json.JSONDecodeError: return JsonResponse({'message': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'message': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: logger.exception(f"update_member failed ID: {member_id}."); return JsonResponse({'message': 'Internal error.'}, status=500)
    return JsonResponse({'message': 'Only PUT allowed'}, status=405)

@csrf_exempt
def delete_member(request, member_id):
    if request.method == 'POST': # Consider DELETE method
        try:
            member = get_object_or_404(Member, pk=member_id)
            member_name = member.name; member.delete()
            logger.info(f"Member deleted ID: {member_id}, Name: {member_name}")
            return JsonResponse({'success': True, 'message': 'Member deleted successfully.'})
        except Http404: return JsonResponse({'success': False, 'message': 'Member not found.'}, status=404)
        except Exception as e: logger.exception(f"delete_member failed ID: {member_id}."); return JsonResponse({'success': False, 'message': 'Deletion error.'}, status=500)
    return JsonResponse({'error': 'Invalid method.'}, status=405)

@csrf_exempt
def create_users(request):
    if request.method == 'POST':
        try:
            default_users = [ {'username': 'nurse_user', 'password': 'DefaultPasswordN1!', 'email': 'nurse@example.com', 'first_name': 'Default', 'last_name': 'Nurse'}, {'username': 'doctor_user', 'password': 'DefaultPasswordD1!', 'email': 'doctor@example.com', 'first_name': 'Default', 'last_name': 'Doctor'}, {'username': 'admin_user', 'password': 'DefaultPasswordA1!', 'email': 'admin@example.com', 'first_name': 'Default', 'last_name': 'Admin', 'is_staff': True, 'is_superuser': True}, {'username': 'pharmacy_user', 'password': 'DefaultPasswordP1!', 'email': 'pharmacy@example.com', 'first_name': 'Default', 'last_name': 'Pharmacy'} ]
            created, skipped = 0, 0
            for user_data in default_users:
                username = user_data['username']
                if not User.objects.filter(username=username).exists():
                    User.objects.create_user(username=username, password=user_data['password'], email=user_data.get('email', ''), first_name=user_data.get('first_name', ''), last_name=user_data.get('last_name', ''), is_staff=user_data.get('is_staff', False), is_superuser=user_data.get('is_superuser', False))
                    created += 1
                else: skipped += 1
            return JsonResponse({"message": f"{created} users created. {skipped} skipped."}, status=201 if created > 0 else 200)
        except Exception as e: logger.exception("create_users failed."); return JsonResponse({"error": "Error creating users.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use POST.'}, status=405)

# --- Core Data Fetching / Entry (Using Aadhar) ---
# Includes fetchdata, addEntries, add_basic_details, uploadImage, fetchVisitdata, fetchVisitDataWithDate, update_employee_status
# (These were already provided in the previous step as modified)


@csrf_exempt
def fetchdata(request):
    """Fetches employee data and related information from various models."""
    if request.method == "POST":
        try:
            # Fetch Latest Employee Records
            latest_employees = (
                employee_details.objects
                .values("aadhar")
                .annotate(latest_id=Max("id"))
            )

            latest_employee_ids = [emp["latest_id"] for emp in latest_employees]
            employees = list(employee_details.objects.filter(id__in=latest_employee_ids).values())

            media_url = settings.MEDIA_URL

            for emp in employees:
                if emp["profilepic"]:
                    emp["profilepic_url"] = f"{request.scheme}://{request.get_host()}{settings.MEDIA_URL}{emp['profilepic']}"
                else:
                    emp["profilepic_url"] = None

            def get_latest_records(model):
                try:
                    print(model._meta.db_table)
                    records = list(model.objects.filter(emp_no__in=[emp["aadhar"] for emp in employees]).values())
                    if records:
                        all_keys = records[0].keys()
                        default_structure = {key: "" for key in all_keys}
                        return {record["aadhar"]: record for record in records}, default_structure
                    else:
                        try:
                            # Instantiate a model instance (not saved to the DB)
                            instance = model()
                            fields = model._meta.get_fields()  # Get all fields from the model

                            default_structure = {}
                            for field in fields:
                                if field.concrete and not field.is_relation:
                                    if isinstance(field, (CharField, TextArea)):
                                        default_structure[field.name] = ""  # Empty string for text-based fields
                                    elif isinstance(field, (IntegerField, FloatField)):
                                        default_structure[field.name] = None  # Or 0, if that's more appropriate
                                    elif isinstance(field, BooleanField):
                                        default_structure[field.name] = False
                                    elif isinstance(field, (DateField, DateTimeField)):
                                        default_structure[field.name] = None  # Or some default date
                                    elif isinstance(field, JSONField):
                                        print(field.name)
                                        # Special handling for JSONField, especially nested structures
                                        if field.name == "normal_doses" or field.name == "booster_doses":
                                            default_structure[field.name] = {"dates": [], "dose_names": []}
                                        elif field.name == "surgical_history":
                                            default_structure[field.name] = {"comments":"" ,"children": []}
                                        elif field.name == "vaccination":
                                            default_structure[field.name] = {"vaccination": []}
                                        elif field.name == "job_nature":
                                            default_structure[field.name] = []
                                        elif field.name == "conditional_fit_feilds":
                                            default_structure[field.name] = []
                                        else:
                                            default_structure[field.name] = {}  # Default empty JSON object
                                    else:
                                        default_structure[field.name] = None  # Default to None for other types
                            return {}, default_structure  # Ensure two values are returned even if no data
                        except Exception as e:
                            print(e)
                            logger.error(f"Error creating default structure for model {model.__name__}: {str(e)}")
                            return {}, {}

                except Exception as e:
                    logger.error(f"Error fetching records for model {model.__name__}: {str(e)}")
                    return {}, {}

            
            dashboard_dict, dashboard_default = get_latest_records(Dashboard)
            vitals_dict, vitals_default = get_latest_records(vitals)
            msphistory_dict, msphistory_default = get_latest_records(MedicalHistory)
            haematology_dict, haematology_default = get_latest_records(heamatalogy)
            routinesugartests_dict, routinesugartests_default = get_latest_records(RoutineSugarTests)
            renalfunctiontests_dict, renalfunctiontests_default = get_latest_records(RenalFunctionTest)
            lipidprofile_dict, lipidprofile_default = get_latest_records(LipidProfile)
            liverfunctiontest_dict, liverfunctiontest_default = get_latest_records(LiverFunctionTest)
            thyroidfunctiontest_dict, thyroidfunctiontest_default = get_latest_records(ThyroidFunctionTest)
            autoimmunetest_dict,autoimmunetest_default=get_latest_records(AutoimmuneTest)
            coagulationtest_dict, coagulationtest_default = get_latest_records(CoagulationTest)
            enzymesandcardiacprofile_dict, enzymesandcardiacprofile_default = get_latest_records(EnzymesCardiacProfile)
            urineroutine_dict, urineroutine_default = get_latest_records(UrineRoutineTest)
            serology_dict, serology_default = get_latest_records(SerologyTest)
            motion_dict, motion_default = get_latest_records(MotionTest)
            routinecultureandsensitive_dict, routinecultureandsensitive_default=get_latest_records(CultureSensitivityTest)
            menspack_dict, menspack_default = get_latest_records(MensPack)
            womenpack_dict,womenpack_default=get_latest_records(WomensPack)
            occupationalprofile_dict,occupationalprofile_default=get_latest_records(OccupationalProfile)
            otherstest_dict,otherstest_default=get_latest_records(OthersTest)
            opthalamicreport_dict, opthalamicreport_default = get_latest_records(OphthalmicReport)
            xray_dict,xray_default=get_latest_records(XRay)
            usg_dict, usg_default = get_latest_records(USGReport)
            ct_dict,ct_default=get_latest_records(CTReport)
            mri_dict, mri_default = get_latest_records(MRIReport)
            fitnessassessment_dict, fitnessassessment_default = get_latest_records(FitnessAssessment)
            vaccination_dict, vaccination_default = get_latest_records(VaccinationRecord)
            consultation_dict, consultation_default = get_latest_records(Consultation)
            prescription_dict, prescription_default = get_latest_records(Prescription)
            significant_notes_dict, significant_notes_default = get_latest_records(SignificantNotes)
            form17_dict, form17_default = get_latest_records(Form17)
            form38_dict, form38_default = get_latest_records(Form38)
            form39_dict, form39_default = get_latest_records(Form39)
            form40_dict, form40_default = get_latest_records(Form40)
            form27_dict, form27_default = get_latest_records(Form27)
            if not employees:
                logger.info("No employee records found.")
                return JsonResponse({"data": []}, status=200)

            merged_data = []
            for emp in employees:
                emp_no = emp["aadhar"]
                emp["dashboard"] = dashboard_dict.get(emp_no, dashboard_default or {})
                emp["vitals"] = vitals_dict.get(emp_no, vitals_default or {})
                emp["haematology"] = haematology_dict.get(emp_no, haematology_default or {})
                emp["msphistory"] = msphistory_dict.get(emp_no, msphistory_default or {})
                emp["routinesugartests"] = routinesugartests_dict.get(emp_no, routinesugartests_default or {})
                emp["renalfunctiontests_and_electrolytes"] = renalfunctiontests_dict.get(emp_no, renalfunctiontests_default or {})
                emp["lipidprofile"] = lipidprofile_dict.get(emp_no, lipidprofile_default or {})
                emp["liverfunctiontest"] = liverfunctiontest_dict.get(emp_no, liverfunctiontest_default or {})
                emp["thyroidfunctiontest"] = thyroidfunctiontest_dict.get(emp_no, thyroidfunctiontest_default or {})
                emp["autoimmunetest"]=autoimmunetest_dict.get(emp_no,autoimmunetest_default or {})
                emp["coagulationtest"] = coagulationtest_dict.get(emp_no, coagulationtest_default or {})
                emp["enzymesandcardiacprofile"] = enzymesandcardiacprofile_dict.get(emp_no, enzymesandcardiacprofile_default or {})
                emp["urineroutine"] = urineroutine_dict.get(emp_no, urineroutine_default or {})
                emp["serology"] = serology_dict.get(emp_no, serology_default or {})
                emp["motion"] = motion_dict.get(emp_no, motion_default or {})
                emp["routinecultureandsensitive"] = routinecultureandsensitive_dict.get(emp_no, routinecultureandsensitive_default or {})
                emp["menspack"] = menspack_dict.get(emp_no, menspack_default or {})
                emp["womenpack"] = womenpack_dict.get(emp_no, womenpack_default or {})
                emp["occupationalprofile"] = occupationalprofile_dict.get(emp_no, occupationalprofile_default or {})
                emp["otherstest"] =otherstest_dict.get(emp_no, otherstest_default or {})
                
                
                
                emp["opthalamicreport"] = opthalamicreport_dict.get(emp_no, opthalamicreport_default or {})
                emp["xray"] = xray_dict.get(emp_no,xray_default or {})
                emp["usg"] = usg_dict.get(emp_no, usg_default or {})
                emp["ct"] = ct_dict.get(emp_no, ct_default or {})
                emp["mri"] = mri_dict.get(emp_no, mri_default or {})
                emp["fitnessassessment"] = fitnessassessment_dict.get(emp_no, fitnessassessment_default or {})
                emp["vaccination"] = vaccination_dict.get(emp_no, vaccination_default or {})
                emp["consultation"] = consultation_dict.get(emp_no, consultation_default or {})
                emp["prescription"] = prescription_dict.get(emp_no, prescription_default or {})
                emp["significant_notes"] = significant_notes_dict.get(emp_no, significant_notes_default or {})
                emp["form17"] = form17_dict.get(emp_no, form17_default or {})
                emp["form38"] = form38_dict.get(emp_no, form38_default or {})
                emp["form39"] = form39_dict.get(emp_no, form39_default or {})
                emp["form40"] = form40_dict.get(emp_no, form40_default or {})
                emp["form27"] = form27_dict.get(emp_no, form27_default or {})
                merged_data.append(emp)
          
            return JsonResponse({"data": merged_data}, status=200)

        except Exception as e:
            logger.exception("Error in fetchdata view: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("fetchdata failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)



@csrf_exempt
def addEntries(request):
    """
    Adds or updates an employee_details record based on AADHAR and today's date.
    Assigns MRD number logic remains (needs careful review if MRD should be Aadhar-based).
    Updates Dashboard record.
    """
    if request.method != "POST":
        logger.warning("addEntries failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    aadhar = None # Initialize for logging
    try:
        data = json.loads(request.body.decode('utf-8'))
        print(data['formData'])
        logger.debug(f"Received data for addEntries: {json.dumps(data)[:500]}...") # Log truncated data

        # *** KEY CHANGE: Expect 'aadhar' instead of 'emp_no' ***
        aadhar = data['formData'].get('aadhar')
        if not aadhar:
            logger.warning("addEntries failed: Aadhar number (aadhar) is required in the payload.")
            return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

        # Get other data buckets
        entry_date = date.today() # Use current date for the visit entry
        extra_data = data.get('extraData', {})
        dashboard_data = data.get('formDataDashboard', {})
        employee_data = data.get('formData', {}) # Basic details payload

        # --- MRD Number Logic (Keep as is for now, but consider if it should be Aadhar-based) ---
        determined_mrd_no = None
        # Find the latest entry *for this Aadhar* that has an MRD number
        existing_entry_with_mrd = employee_details.objects.filter(
            aadhar=aadhar,
            mrdNo__isnull=False
        ).exclude(
            mrdNo=''
        ).order_by('-entry_date', '-id').first() # Get latest entry by date, then ID

        if existing_entry_with_mrd:
            determined_mrd_no = existing_entry_with_mrd.mrdNo
            logger.info(f"Found existing MRD number {determined_mrd_no} for aadhar: {aadhar}")
        else:
            logger.info(f"No existing MRD found for aadhar: {aadhar}. Generating new MRD number.")
            # Count distinct Aadhars that *already have* a valid MRD
            # This might need adjustment depending on how unique MRDs should be
            count_with_mrd = employee_details.objects.filter(
                mrdNo__isnull=False
            ).exclude(
                mrdNo=''
            ).values('aadhar').distinct().count() # Count distinct Aadhars with MRD
            next_mrd_sequence = count_with_mrd + 1
            seq_part = f"{next_mrd_sequence:06d}" # Pad to 6 digits
            date_part = entry_date.strftime('%d%m%Y') # Use current entry date
            determined_mrd_no = f"{seq_part}{date_part}"
            logger.info(f"Generated new MRD number {determined_mrd_no} for aadhar: {aadhar}")
        # --- End MRD Number Logic ---

        # --- Prepare employee_details defaults ---
        # Includes fields from various parts of the payload
        employee_defaults = {
            # Basic Details (from employee_data) - Use .get() with defaults
            'name': employee_data.get('name', ''),
            'dob': parse_date_internal(employee_data.get('dob')),
            'sex': employee_data.get('sex', ''),
            'guardian': employee_data.get('guardian', ''),
            'bloodgrp': employee_data.get('bloodgrp', ''),
            'identification_marks1': employee_data.get('identification_marks1', ''),
            'identification_marks2': employee_data.get('identification_marks2', ''),
            'marital_status': employee_data.get('marital_status', ''),
            'emp_no': employee_data.get('emp_no', ''), # Keep emp_no if it's still relevant/sent
            'employer': employee_data.get('employer', ''),
            'designation': employee_data.get('designation', ''),
            'department': employee_data.get('department', ''),
            'job_nature': employee_data.get('job_nature', ''), # May need JSON parsing if array
            'doj': parse_date_internal(employee_data.get('doj')),
            'moj': employee_data.get('moj', ''), # Assuming moj is not a date string
            'phone_Personal': employee_data.get('phone_Personal', ''),
            'mail_id_Personal': employee_data.get('mail_id_Personal', ''),
            'emergency_contact_person': employee_data.get('emergency_contact_person', ''),
            'location': employee_data.get('location', ''),
            'phone_Office': employee_data.get('phone_Office', ''),
            'mail_id_Office': employee_data.get('mail_id_Office', ''),
            'emergency_contact_relation': employee_data.get('emergency_contact_relation', ''),
            'mail_id_Emergency_Contact_Person': employee_data.get('mail_id_Emergency_Contact_Person', ''),
            'emergency_contact_phone': employee_data.get('emergency_contact_phone', ''),
            'permanent_address': employee_data.get('permanent_address', ''),
            'permanent_area': employee_data.get('permanent_area', ''),
            'permanent_state': employee_data.get('permanent_state', ''),
            'permanent_nationality': employee_data.get('permanent_nationality', ''),
            'residential_address': employee_data.get('residential_address', ''),
            'residential_area': employee_data.get('residential_area', ''),
            'residential_state': employee_data.get('residential_state', ''),
            'residential_nationality': employee_data.get('residential_nationality', ''),
            'country_id': employee_data.get('country_id', ''),
            'role': employee_data.get('role', ''), # Employee role/category info
            'employee_status': employee_data.get('employee_status', ''), # Overall employee status
            'since_date': parse_date_internal(employee_data.get('since_date')),
            'transfer_details': employee_data.get('transfer_details', ''),
            'other_reason_details': employee_data.get('other_reason_details', ''),

            # Visitor Specific Details (from employee_data)
            'other_site_id': employee_data.get('other_site_id', ''),
            'organization': employee_data.get('organization', ''),
            'addressOrganization': employee_data.get('addressOrganization', ''),
            'visiting_department': employee_data.get('visiting_department', ''),
            'visiting_date_from': parse_date_internal(employee_data.get('visiting_date_from')),
            'stay_in_guest_house': employee_data.get('stay_in_guest_house', ''),
            'visiting_purpose': employee_data.get('visiting_purpose', ''), # Visitor form purpose

            # Visit Context Details (from dashboard_data)
            'type': dashboard_data.get('category', 'Employee'), # Maps to EMPLOYEE_TYPES
            'type_of_visit': dashboard_data.get('typeofVisit', ''),
            'register': dashboard_data.get('register', ''),
            'purpose': dashboard_data.get('purpose', ''), # The actual visit purpose

            # Extra Context Details (from extra_data)
            'year': extra_data.get('year', ''),
            'batch': extra_data.get('batch', ''),
            'hospitalName': extra_data.get('hospitalName', ''),
            'campName': extra_data.get('campName', ''),
            'contractName': extra_data.get('contractName', ''),
            'prevcontractName': extra_data.get('prevcontractName', ''),
            'old_emp_no': extra_data.get('old_emp_no', ''),
            'reason': extra_data.get('reason', extra_data.get('purpose', '')), # Prefer 'reason'
            'status': extra_data.get('status', ''),

            # Determined/System Fields
            'mrdNo': determined_mrd_no,
            # 'aadhar' is the key, not in defaults

            # Profile pic handled separately by add_basic_details or uploadImage
        }

        # Filter out None values to avoid overwriting with null unless intended
        employee_defaults_filtered = {k: v for k, v in employee_defaults.items() if v is not None}
        # If you need to clear fields with empty strings, remove "and v != ''" if added previously

        # --- Update or create the employee_details entry ---
        # Key is (aadhar, entry_date)
        employee_entry, created = employee_details.objects.update_or_create(
            aadhar=aadhar,
            entry_date=entry_date,
            defaults=employee_defaults_filtered
        )

        # --- Prepare and save Dashboard data ---
        dashboard_defaults = {
            'type': employee_entry.type,
            'type_of_visit': employee_entry.type_of_visit,
            'register': employee_entry.register,
            'purpose': employee_entry.purpose, # Visit purpose
            'year': employee_entry.year,
            'batch': employee_entry.batch,
            'hospitalName': employee_entry.hospitalName,
            'campName': employee_entry.campName,
            'contractName': employee_entry.contractName,
            'prevcontractName': employee_entry.prevcontractName,
            'old_emp_no': employee_entry.old_emp_no,
            'reason': employee_entry.reason,
            'status': employee_entry.status,
            'mrdNo': employee_entry.mrdNo,
            'emp_no': employee_entry.emp_no # Keep emp_no if dashboard needs it
        }

        # Key is (aadhar, date)
        dashboard_entry, dashboard_created = Dashboard.objects.update_or_create(
            aadhar=aadhar,
            date=entry_date, # Use date as part of the key
            defaults=dashboard_defaults
        )

        message = f"Visit Entry {'added' if created else 'updated'} (MRD: {employee_entry.mrdNo}) and Dashboard {'created' if dashboard_created else 'updated'} successfully"

        logger.info(f"addEntries successful for aadhar: {aadhar} on {entry_date}. VisitCreated: {created}, DashboardCreated: {dashboard_created}, MRD: {employee_entry.mrdNo}")
        return JsonResponse({"message": message, "mrdNo": employee_entry.mrdNo, "aadhar": aadhar}, status=200)

    except json.JSONDecodeError:
        logger.error("addEntries failed: Invalid JSON data.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"addEntries failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing the entry."}, status=500)


@csrf_exempt
def add_basic_details(request):
    """
    Adds or updates basic employee details based on AADHAR and today's date.
    Handles profile picture upload.
    """
    if request.method != "POST":
        logger.warning("add_basic_details failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    aadhar = None # Initialize for logging
    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_basic_details: {json.dumps(data)[:500]}...")

        # *** KEY CHANGE: Expect 'aadhar' ***
        aadhar = data.get('aadhar')
        if not aadhar:
            logger.warning("add_basic_details failed: Aadhar number is required")
            return JsonResponse({"error": "Aadhar number is required"}, status=400)

        entry_date = date.today() # Operates on today's record

        # Prepare defaults dictionary
        basic_defaults = {
            'name': data.get('name'),
            'dob': parse_date_internal(data.get('dob')),
            'sex': data.get('sex'),
            'guardian': data.get('guardian'),
            'bloodgrp': data.get('bloodgrp'),
            'identification_marks1': data.get('identification_marks1'),
            'identification_marks2': data.get('identification_marks2'),
            'marital_status': data.get('marital_status'),
            'emp_no': data.get('emp_no'), # Keep emp_no if needed
            'employer': data.get('employer'),
            'designation': data.get('designation'),
            'department': data.get('department'),
            'job_nature': data.get('job_nature'), # May need JSON handling
            'doj': parse_date_internal(data.get('doj')),
            'moj': data.get('moj'), # Assuming string
            'phone_Personal': data.get('phone_Personal'),
            'mail_id_Personal': data.get('mail_id_Personal'),
            'emergency_contact_person': data.get('emergency_contact_person'),
            'phone_Office': data.get('phone_Office'),
            'mail_id_Office': data.get('mail_id_Office'),
            'emergency_contact_relation': data.get('emergency_contact_relation'),
            'mail_id_Emergency_Contact_Person': data.get('mail_id_Emergency_Contact_Person'),
            'emergency_contact_phone': data.get('emergency_contact_phone'),
            'location': data.get('location'),
            'permanent_address': data.get('permanent_address'),
            'permanent_area': data.get('permanent_area'),
            'permanent_state': data.get('permanent_state'),
            'permanent_nationality': data.get('permanent_nationality'),
            'residential_address': data.get('residential_address'),
            'residential_area': data.get('residential_area'),
            'residential_state': data.get('residential_state'),
            'residential_nationality': data.get('residential_nationality'),
            'country_id': data.get('country_id'),
            'role': data.get('role'), # Employee/Contractor/Visitor role
            'employee_status': data.get('employee_status'),
            'since_date': parse_date_internal(data.get('since_date')),
            'transfer_details': data.get('transfer_details'),
            'other_reason_details': data.get('other_reason_details'),
            'mrdNo': data.get('mrdNo'), # Allow updating MRD if provided

            # Visitor Fields
            'other_site_id': data.get('other_site_id'),
            'organization': data.get('organization'),
            'addressOrganization': data.get('addressOrganization'),
            'visiting_department': data.get('visiting_department'),
            'visiting_date_from': parse_date_internal(data.get('visiting_date_from')),
            'stay_in_guest_house': data.get('stay_in_guest_house'),
            'visiting_purpose': data.get('visiting_purpose'),

            # Set 'type' based on role, default if needed
            'type': data.get('role', 'Employee'),
            # NOTE: profilepic handled separately below
        }

        # Filter out None values
        basic_defaults_filtered = {k: v for k, v in basic_defaults.items() if v is not None}

        # --- Get or Create based on AADHAR and DATE ---
        employee, created = employee_details.objects.get_or_create(
            aadhar=aadhar,
            entry_date=entry_date,
            defaults=basic_defaults_filtered # Set defaults only if created
        )

        # If updating an existing record for today
        update_fields_list = []
        if not created:
            for key, value in basic_defaults_filtered.items():
                if getattr(employee, key) != value:
                   setattr(employee, key, value)
                   update_fields_list.append(key)

        # --- Handle Profile Picture ---
        profile_image_b64 = data.get('profilepic') # Key from payload
        image_updated = False
        image_field_updated = False # Track if the profilepic field itself needs saving

        if profile_image_b64 and isinstance(profile_image_b64, str) and ';base64,' in profile_image_b64:
            try:
                header, encoded = profile_image_b64.split(';base64,', 1)
                # Extract extension robustly
                file_ext = header.split('/')[-1].split(';')[0].split('+')[0] if header.startswith('data:image/') else 'jpg'
                if not file_ext: file_ext = 'jpg' # Default extension

                image_data = base64.b64decode(encoded)
                # *** Use AADHAR in filename ***
                filename = f"profilepics/{aadhar}_{uuid.uuid4().hex[:8]}.{file_ext}"

                # Delete old file if it exists and is different
                if employee.profilepic and employee.profilepic.name:
                    # Basic check if name looks different (could be more robust)
                    if employee.profilepic.name != filename.split('/')[-1]:
                         try:
                             if default_storage.exists(employee.profilepic.path):
                                 default_storage.delete(employee.profilepic.path)
                                 logger.info(f"Deleted old profile pic for aadhar {aadhar}: {employee.profilepic.name}")
                         except Exception as del_err:
                             logger.error(f"Error deleting old profile pic for aadhar {aadhar}: {del_err}")

                # Save the new image file
                employee.profilepic.save(filename, ContentFile(image_data), save=False) # save=False initially
                image_updated = True
                image_field_updated = True # Mark field for saving
                logger.info(f"Profile picture prepared for aadhar: {aadhar}")

            except (TypeError, ValueError, base64.binascii.Error) as img_err:
                logger.error(f"Failed to decode or save profile picture for aadhar {aadhar}: {img_err}")
            except Exception as img_ex:
                logger.exception(f"Unexpected error processing profile picture for aadhar {aadhar}")

        elif 'profilepic' in data and data['profilepic'] is None:
             # Clear the image if 'profilepic' is sent as null
             if employee.profilepic:
                 try:
                     employee.profilepic.delete(save=False) # Delete the file, don't save model yet
                     image_updated = True # Indicates a change occurred
                     image_field_updated = True # Mark field for saving
                     logger.info(f"Profile picture cleared for aadhar: {aadhar}")
                 except Exception as del_err:
                      logger.error(f"Error clearing profile pic file for aadhar {aadhar}: {del_err}")


        # --- Final Save ---
        fields_to_save = update_fields_list
        if image_field_updated:
             # Ensure 'profilepic' is in the list if the image was changed or cleared
             if 'profilepic' not in fields_to_save:
                 fields_to_save.append('profilepic')
             # Also update profilepic_url if your model logic doesn't do it automatically on save
             if hasattr(employee, 'profilepic_url'):
                 # The model's save method *should* handle this if properly set up
                 # If not, manually set: employee.profilepic_url = employee.profilepic.url if employee.profilepic else ''
                 if 'profilepic_url' not in fields_to_save:
                      fields_to_save.append('profilepic_url')


        if created or fields_to_save:
             # The model's save() method should handle updating profilepic_url
             # If saving specific fields, ensure profilepic_url is included if it changed
             if not created and fields_to_save:
                 employee.save(update_fields=fields_to_save)
                 logger.info(f"Updated fields for aadhar {aadhar}: {fields_to_save}")
             else: # Created or saving all fields
                 employee.save()
                 logger.info(f"Saved basic details for aadhar {aadhar} (Created: {created})")
        else:
             logger.info(f"No changes detected for aadhar {aadhar} on {entry_date}. Skipping save.")


        message = "Basic Details added successfully" if created else "Basic Details updated successfully"
        return JsonResponse({
            "message": message,
            "aadhar": aadhar,
            "entry_date": entry_date.isoformat(),
            "profilepic_url": employee.profilepic.url if employee.profilepic else None # Return current URL
            }, status=201 if created else 200) # Use 201 for created

    except json.JSONDecodeError:
        logger.error("add_basic_details failed: Invalid JSON data.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"add_basic_details failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing basic details."}, status=500)


@csrf_exempt
def uploadImage(request, aadhar): # CHANGED: emp_no -> aadhar
    """Handles uploading/updating profile images based on AADHAR."""
    # This view seems redundant if add_basic_details handles image upload.
    # However, if it's meant as a standalone image update endpoint:
    if request.method == 'PUT':
        try:
            # Assuming image is sent as base64 in the body, similar to add_basic_details
            data = json.loads(request.body.decode('utf-8'))
            image_b64 = data.get('profileImage') # Or whatever key is used

            if not image_b64 or not isinstance(image_b64, str) or ';base64,' not in image_b64:
                logger.warning(f"Image upload failed for aadhar {aadhar}: Invalid or missing image data.")
                return JsonResponse({'status': 'error', 'message': 'Invalid or missing profileImage data (must be base64 string).'}, status=400)

            # --- Get the LATEST employee record for this aadhar ---
            # Or should it update a specific day's record? Using latest for profile pic makes more sense.
            employee = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()

            if not employee:
                # Option 1: Return error if no employee record exists
                logger.warning(f"Image upload failed: No employee record found for aadhar {aadhar}.")
                return JsonResponse({'status': 'error', 'message': 'Employee record not found for this Aadhar.'}, status=404)
                # Option 2: Create a new record (less likely for just an image update)
                # ... logic to create a minimal employee_details record ...

            # --- Process and Save Image ---
            try:
                header, encoded = image_b64.split(';base64,', 1)
                file_ext = header.split('/')[-1].split(';')[0].split('+')[0] if header.startswith('data:image/') else 'jpg'
                if not file_ext: file_ext = 'jpg'

                image_data = base64.b64decode(encoded)
                filename = f"profilepics/{aadhar}_{uuid.uuid4().hex[:8]}.{file_ext}"

                # Delete old file
                if employee.profilepic and employee.profilepic.name:
                     try:
                         if default_storage.exists(employee.profilepic.path):
                             default_storage.delete(employee.profilepic.path)
                             logger.info(f"Deleted old profile pic for aadhar {aadhar} during uploadImage: {employee.profilepic.name}")
                     except Exception as del_err:
                         logger.error(f"Error deleting old profile pic for aadhar {aadhar} during uploadImage: {del_err}")

                # Save new file
                employee.profilepic.save(filename, ContentFile(image_data), save=True) # save=True here updates the model instance
                # employee.save(update_fields=['profilepic', 'profilepic_url']) # Explicit save if needed

                logger.info(f"Successfully updated profile image for aadhar {aadhar}")
                return JsonResponse({
                    'status': 'success',
                    'message': 'Image updated successfully',
                    'profilepic_url': employee.profilepic.url if employee.profilepic else None
                })

            except (TypeError, ValueError, base64.binascii.Error) as img_err:
                logger.error(f"Image upload processing error for aadhar {aadhar}: {img_err}")
                return JsonResponse({'status': 'error', 'message': f'Image processing error: {img_err}'}, status=400)
            except Exception as save_err:
                 logger.exception(f"Error saving profile image for aadhar {aadhar}")
                 return JsonResponse({'status': 'error', 'message': f'Failed to save new image: {save_err}'}, status=500)

        except json.JSONDecodeError:
            logger.error(f"Image upload failed for aadhar {aadhar}: Invalid JSON.", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data in request body.'}, status=400)
        except Exception as e:
            logger.exception(f"Image upload failed for aadhar {aadhar}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': 'An unexpected server error occurred.'}, status=500)

    logger.warning(f"Image upload failed for aadhar {aadhar}: Invalid request method. Only PUT allowed.")
    return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use PUT.'}, status=405)


@csrf_exempt
def fetchVisitdata(request, aadhar): # CHANGED: emp_no -> aadhar
    """Fetches all Dashboard visit records for a specific employee Aadhar."""
    # Original code used POST, ideally should be GET
    if request.method == "POST" or request.method == "GET": # Allow GET as well
        try:
            # Fetch all dashboard entries for the given aadhar, ordered by date
            visit_data = list(Dashboard.objects.filter(aadhar=aadhar).order_by('-date').values())

            # Convert dates to ISO format string
            for visit in visit_data:
                 if isinstance(visit.get('date'), date):
                     visit['date'] = visit['date'].isoformat()
                 # Convert other date fields if necessary

            logger.info(f"Fetched {len(visit_data)} visit records for aadhar: {aadhar}")
            return JsonResponse({"message": "Visit data fetched successfully", "data": visit_data}, status=200)

        except Exception as e:
            logger.exception(f"fetchVisitdata failed for aadhar {aadhar}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning(f"fetchVisitdata failed for aadhar {aadhar}: Invalid request method.")
        return JsonResponse({"error": "Invalid request method (use GET or POST)"}, status=405)

# Helper function to serialize model instances, handling file/image fields and dates
def serialize_model_instance(instance):
    """
    Converts a model instance to a dictionary, replacing FileField/ImageField
    objects with their URLs and formatting dates/datetimes. Returns an empty dict if instance is None.
    """
    if instance is None:
        return {}

    data = model_to_dict(instance)
    for field_name, value in list(data.items()): # Use list to allow modification during iteration
        if isinstance(value, FieldFile): # Handles ImageField and FileField
            try:
                data[field_name] = value.url if value else None
            except Exception as e:
                 logger.error(f"Error getting URL for field {field_name} in instance {instance.pk}: {e}")
                 data[field_name] = None
        elif isinstance(value, (datetime, date)):
             data[field_name] = value.isoformat()
        # Remove internal fields like _state if model_to_dict includes them
        if field_name.startswith('_'):
             del data[field_name]

    return data

@csrf_exempt
def fetchVisitDataWithDate(request, aadhar, date_str): # CHANGED: emp_no -> aadhar, date -> date_str
    """Fetches the LATEST record ON OR BEFORE a specific date for an Aadhar across multiple models."""
    if request.method == "GET":
        try:
            try:
                # Parse the date string from the URL into a date object
                target_date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                logger.warning(f"fetchVisitDataWithDate failed for aadhar {aadhar}: Invalid date format '{date_str}'. Use YYYY-MM-DD.")
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            # List of models to query
            models_to_query = {
                "employee": employee_details, # Use the main employee details model
                "dashboard": Dashboard,
                "vitals": vitals,
                "msphistory": MedicalHistory,
                "haematology": heamatalogy,
                "routinesugartests": RoutineSugarTests,
                "renalfunctiontests": RenalFunctionTest, # Name mismatch with URL key? Using model name
                "lipidprofile": LipidProfile,
                "liverfunctiontest": LiverFunctionTest,
                "thyroidfunctiontest": ThyroidFunctionTest,
                "coagulationtest": CoagulationTest,
                "enzymesandcardiacprofile": EnzymesCardiacProfile,
                "urineroutine": UrineRoutineTest,
                "serology": SerologyTest,
                "motion": MotionTest,
                "menspack": MensPack,
                "opthalamicreport": OphthalmicReport,
                "usg": USGReport,
                "mri": MRIReport,
                "fitnessassessment": FitnessAssessment,
                "vaccination": VaccinationRecord,
                "significant_notes": SignificantNotes,
                "consultation": Consultation,
                "prescription": Prescription,
                "form17": Form17,
                "form38": Form38,
                "form39": Form39,
                "form40": Form40,
                "form27": Form27,
            }

            employee_data = {}

            # Fetch the latest record ON OR BEFORE the target date for each model
            for key, model_class in models_to_query.items():
                instance = model_class.objects.filter(
                    aadhar=aadhar,
                    entry_date__lte=target_date_obj # Filter by Aadhar and date <= target
                ).order_by('-entry_date', '-id').first() # Get the most recent one

                employee_data[key] = serialize_model_instance(instance)

            logger.info(f"Fetched latest data on/before {date_str} for aadhar: {aadhar}")
            return JsonResponse({"data": employee_data}, safe=False, status=200)

        except Exception as e:
            logger.exception(f"fetchVisitDataWithDate failed for aadhar {aadhar}, date {date_str}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning(f"fetchVisitDataWithDate failed for aadhar {aadhar}: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)


@csrf_exempt
def update_employee_status(request):
    """Updates the employee status fields based on AADHAR."""
    if request.method == 'POST':
        aadhar = None # Initialize for logging
        try:
            data = json.loads(request.body)
            logger.debug(f"Received data for update_employee_status: {data}")

            # *** KEY CHANGE: Expect 'aadhar' ***
            aadhar = data.get('aadhar')
            employee_status_val = data.get('employee_status')
            date_since_str = data.get('date_since')
            transfer_details_val = data.get('transfer_details', '') # Optional
            other_reason_details_val = data.get('other_reason_details', '') # Optional

            if not aadhar or not employee_status_val or not date_since_str:
                logger.warning("update_employee_status failed: Missing aadhar, employee_status, or date_since.")
                return JsonResponse({'success': False, 'message': 'Please provide aadhar, employee_status and date_since.'}, status=400)

            date_since_obj = parse_date_internal(date_since_str)
            if not date_since_obj:
                logger.warning(f"update_employee_status failed for aadhar {aadhar}: Invalid date_since format.")
                return JsonResponse({'success': False, 'message': 'Invalid date_since format. Use YYYY-MM-DD.'}, status=400)


            # Option 1: Update the LATEST record for the employee
            # latest_entry = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()
            # if latest_entry:
            #     latest_entry.employee_status = employee_status_val
            #     latest_entry.since_date = date_since_obj
            #     latest_entry.transfer_details = transfer_details_val
            #     latest_entry.other_reason_details = other_reason_details_val
            #     latest_entry.save(update_fields=['employee_status', 'since_date', 'transfer_details', 'other_reason_details'])
            #     logger.info(f"Updated status for latest entry of aadhar {aadhar}.")
            #     return JsonResponse({'success': True, 'message': 'Latest status entry updated successfully.'})
            # else:
            #     logger.warning(f"update_employee_status failed: No existing record found for aadhar {aadhar}.")
            #     return JsonResponse({'success': False, 'message': 'No matching employee found to update.'}, status=404)

            # Option 2: Create a NEW record for TODAY with the updated status (as per original logic)
            # This seems less intuitive for just updating status fields, but matches original code.
            last_entry = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()
            if last_entry:
                # Create a new entry based on the last one, but update status fields
                # Note: This duplicates most data from the last entry. Consider if this is desired.
                new_entry_data = model_to_dict(last_entry, exclude=['id', 'pk']) # Exclude primary key
                new_entry_data['entry_date'] = date.today() # Set to today
                new_entry_data['employee_status'] = employee_status_val
                new_entry_data['since_date'] = date_since_obj
                new_entry_data['transfer_details'] = transfer_details_val
                new_entry_data['other_reason_details'] = other_reason_details_val

                # Handle potential FileFields/ImageFields if they exist and need copying
                # (model_to_dict doesn't copy files) - profilepic might be relevant
                new_entry_data['profilepic'] = last_entry.profilepic # Reassign file field

                new_entry = employee_details.objects.create(**new_entry_data)
                logger.info(f"Created new status entry (ID: {new_entry.id}) for aadhar {aadhar} based on last entry (ID: {last_entry.id}).")
                return JsonResponse({'success': True, 'message': 'New status entry created successfully for today.'})
            else:
                logger.warning(f"update_employee_status failed: Cannot create new entry as no previous record found for aadhar {aadhar}.")
                return JsonResponse({'success': False, 'message': 'No previous employee record found to base the new status entry on.'}, status=404)


        except json.JSONDecodeError:
             logger.error("update_employee_status failed: Invalid JSON.", exc_info=True)
             return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            logger.exception(f"update_employee_status failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'success': False, 'message': 'An internal server error occurred.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)


# --- Vitals & Investigations (Using Aadhar from payload) ---
# Includes add_vital_details, add_haem_report, add_routine_sugar, add_renel_function, add_lipid_profile, add_liver_function, add_thyroid_function, add_enzymes_cardiac, add_urine_routine, add_serology, add_motion_test
# (These were already provided in the previous step as modified)




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date
import logging
# Import your model
from .models import vitals

logger = logging.getLogger(__name__)

@csrf_exempt
def add_vital_details(request):
    """Adds or updates vital details AND files based on AADHAR and today's date."""
    model_class = vitals
    log_prefix = "add_vital_details_multipart" # Updated log prefix
    success_noun = "Vital Details and Files"

    if request.method == "POST":
        aadhar = None
        try:
            # *** Read non-file data from request.POST ***
            post_data = request.POST
            print(f"{log_prefix}: Received POST data: {post_data}")
            print(f"{log_prefix}: Received FILES data: {request.FILES}")

            aadhar = post_data.get('aadhar')
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required in POST data")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            # Filter POST data for allowed model fields (excluding pk, aadhar, entry_date, and file fields)
            allowed_fields = {
                field.name for field in model_class._meta.get_fields()
                if field.concrete and not field.primary_key and not field.is_relation and field.editable
                   and field.name not in ['aadhar', 'entry_date', 'manual', 'fc', 'report', 'self_declared'] # Exclude files here
            }
            # Prepare defaults from POST data, handling empty strings if model allows null/blank
            filtered_data = {}
            for key in allowed_fields:
                value = post_data.get(key)
                # Handle potential empty strings -> None conversion if field allows null
                field_instance = model_class._meta.get_field(key)
                if value == '' and (field_instance.null or field_instance.blank):
                     filtered_data[key] = None # Or keep empty string if preferred/model allows
                elif value is not None:
                    filtered_data[key] = value
                # If value is None (key not present), it won't be added to filtered_data


            print(f"{log_prefix}: Filtered data for update_or_create defaults: {filtered_data}")

            # Perform update_or_create based on aadhar and date using filtered non-file data
            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date,
                defaults=filtered_data
            )

            # *** Handle File Uploads AFTER getting the instance ***
            files_updated = False
            file_fields = ['manual', 'fc', 'report', 'self_declared']
            for field_name in file_fields:
                if field_name in request.FILES:
                    setattr(instance, field_name, request.FILES[field_name])
                    files_updated = True
                    print(f"{log_prefix}: Updating file field '{field_name}' for aadhar {aadhar}")

            # Save the instance again if files were updated
            if files_updated:
                instance.save()
                print(f"{log_prefix}: Saved instance after file updates for aadhar {aadhar}")


            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. Files updated: {files_updated}.")
            return JsonResponse({"message": message, "created": created, "files_updated": files_updated}, status=201 if created else 200)

        # Remove JSONDecodeError handling as we are not decoding JSON body anymore
        # except json.JSONDecodeError:
        #     logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
        #     return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            # Provide more specific error details if possible
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)

    logger.warning(f"{log_prefix} failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method must be POST"}, status=405)
# --- Apply the above pattern to ALL these views ---

@csrf_exempt
def add_haem_report(request):
    model_class = heamatalogy
    log_prefix = "add_haem_report"
    success_noun = "Haematology details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_routine_sugar(request):
    model_class = RoutineSugarTests
    log_prefix = "add_routine_sugar"
    success_noun = "Routine Sugar Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_renel_function(request): # Typo in name: should be add_renal_function
    model_class = RenalFunctionTest
    log_prefix = "add_renal_function" # Corrected log prefix
    success_noun = "Renal Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_lipid_profile(request):
    model_class = LipidProfile
    log_prefix = "add_lipid_profile"
    success_noun = "Lipid Profile details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_liver_function(request):
    model_class = LiverFunctionTest
    log_prefix = "add_liver_function"
    success_noun = "Liver Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_thyroid_function(request):
    model_class = ThyroidFunctionTest
    log_prefix = "add_thyroid_function"
    success_noun = "Thyroid Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_autoimmune_function(request):
    model_class = AutoimmuneTest
    log_prefix = "add_autoimmune_function"
    success_noun = "Autoimmune Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_coagulation_function(request):
    model_class = CoagulationTest
    log_prefix = "add_coagulation_function"
    success_noun = "Coagulation Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_enzymes_cardiac(request):
    model_class = EnzymesCardiacProfile
    log_prefix = "add_enzymes_cardiac"
    success_noun = "Enzymes Cardiac Profile details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_urine_routine(request):
    model_class = UrineRoutineTest
    log_prefix = "add_urine_routine"
    success_noun = "Urine Routine Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_serology(request):
    model_class = SerologyTest
    log_prefix = "add_serology"
    success_noun = "Serology Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_motion_test(request):
    model_class = MotionTest
    log_prefix = "add_motion_test"
    success_noun = "Motion Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def add_culturalsensitivity_function(request):
    model_class = CultureSensitivityTest
    log_prefix = "add_culturalsensitivity_function"
    success_noun = "Routine cultural sensitivity Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def create_medical_history(request):
    model_class = MedicalHistory
    log_prefix = "create_medical_history"
    success_noun = "Medical history"
    # This view had slightly different logic, adapting the pattern
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            logger.debug(f"Received data for {log_prefix}: {json.dumps(data)[:500]}...")

            # *** KEY CHANGE: Expect 'aadhar' ***
            aadhar = data.get('aadhar')
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            # Map payload keys to model fields (ensure these match your model)
            # Handle JSON fields carefully - assume frontend sends correct JSON structure/string
            defaults = {
                'personal_history': data.get('personalHistory'),
                'medical_data': data.get('medicalData'),
                'female_worker': data.get('femaleWorker'),
                'surgical_history': data.get('surgicalHistory'),
                'family_history': data.get('familyHistory'),
                'health_conditions': data.get('healthConditions'),
                'allergy_fields': data.get('allergyFields'),
                'allergy_comments': data.get('allergyComments'),
                'children_data': data.get('children_data'),
                'spouse_data': data.get('spouse_data'),
                'conditions': data.get('conditions')
            }
            # Filter None values
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}


            # *** KEY CHANGE: Use aadhar in update_or_create ***
            medical_history, created = model_class.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date,
                defaults=filtered_defaults
            )

            message = f"{success_noun} {'created' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar: {aadhar}. Created: {created}")
            return JsonResponse({"message": message}, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except ValidationError as e: # Catch potential model validation errors
            logger.error(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: Validation error: {e.message_dict}", exc_info=True)
            return JsonResponse({"error": "Validation Error", 'details': e.message_dict}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
    else:
        logger.warning(f"{log_prefix} failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)


@csrf_exempt
def add_mens_pack(request):
    model_class = MensPack
    log_prefix = "add_mens_pack"
    success_noun = "Mens Pack details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_womens_function(request):
    model_class = WomensPack
    log_prefix = "add_womens_function"
    success_noun = "Women's pack Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_occupationalprofile_function(request):
    model_class = OccupationalProfile
    log_prefix = "add_occupationalprofile_function"
    success_noun = "Occupational Profile Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_otherstest_function(request):
    model_class = OthersTest
    log_prefix = "add_otherstest_function"
    success_noun = "Others test Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)




@csrf_exempt
def add_opthalmic_report(request): # Typo: Ophthalmic
    model_class = OphthalmicReport
    log_prefix = "add_opthalmic_report" # Typo
    success_noun = "Ophthalmic Report details" # Typo
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_usg_report(request):
    model_class = USGReport
    log_prefix = "add_usg_report"
    success_noun = "USG Report details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_mri_report(request):
    model_class = MRIReport
    log_prefix = "add_mri_report"
    success_noun = "MRI Report details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_xray_function(request):
    model_class = XRay
    log_prefix = "add_xray_function"
    success_noun = "XRay Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_ct_function(request):
    model_class = CTReport
    log_prefix = "add_ct_function"
    success_noun = "CT Function Test details"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in ['aadhar', 'entry_date']}
            filtered_data = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)

@csrf_exempt
def insert_vaccination(request):
    """Inserts or updates vaccination record based on AADHAR and today's date."""
    # Note: Original code had duplicate insert_vaccination functions. Keeping one.
    model_class = VaccinationRecord
    log_prefix = "insert_vaccination"
    success_noun = "Vaccination record"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar') # Expect aadhar
            vaccination_data = data.get("vaccination") # Expect the JSON/dict data here
            entry_date = date.today()

            if not aadhar or not vaccination_data:
                logger.warning(f"{log_prefix} failed: aadhar and vaccination fields are required")
                return JsonResponse({"error": "Aadhar (aadhar) and vaccination data are required"}, status=400)

            # Assuming 'vaccination' field in model is JSONField or TextField storing JSON
            filtered_data = {'vaccination': vaccination_data}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'saved' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            # Return the created/updated object data for confirmation
            response_data = model_to_dict(instance)
            response_data['entry_date'] = instance.entry_date.isoformat() # Format date
            return JsonResponse({
                "message": message,
                "created": created,
                "record": response_data
            }, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


def fetch_vaccinations(request):
    """Fetches vaccination records, optionally filtered by AADHAR."""
    # Should be GET method
    if request.method == "GET":
        aadhar_filter = request.GET.get("aadhar") # Optional filter by aadhar

        try:
            queryset = VaccinationRecord.objects.all()
            if aadhar_filter:
                queryset = queryset.filter(aadhar=aadhar_filter)

            # Order by date descending?
            records = list(queryset.order_by('-entry_date', '-id').values())

            # Format dates
            for record in records:
                if isinstance(record.get('entry_date'), date):
                    record['entry_date'] = record['entry_date'].isoformat()

            logger.info(f"Fetched {len(records)} vaccination records." + (f" Filtered by aadhar: {aadhar_filter}" if aadhar_filter else ""))
            return JsonResponse({"vaccinations": records}, safe=False)

        except Exception as e:
            logger.exception("fetch_vaccinations failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning("fetch_vaccinations failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)


@csrf_exempt
def fitness_test(request): # Removed pk argument, assumes aadhar in payload
    """Adds or updates fitness assessment data based on AADHAR and today's date."""
    model_class = FitnessAssessment
    log_prefix = "fitness_test"
    success_noun = "Fitness test details"
    # ... copy & adapt the logic from add_vital_details, including JSON field handling ...
    
    if request.method == "POST":
        # print("Aadhar :", data['formData'].get('aadhar')) # Expect aadhar
        aadhar = None # Expect aadhar
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            print("Data : ",data,"Aathar1 : ",aadhar) # Expect aadhar
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            # --- Safely parse JSON fields ---
            def parse_json_field(field_data):
                if isinstance(field_data, list): return field_data # Already a list
                if isinstance(field_data, str):
                    try: return json.loads(field_data)
                    except json.JSONDecodeError: return [] # Default to empty list on parse error
                return [] # Default for other types

            job_nature_list = parse_json_field(data.get("job_nature"))
            conditional_fit_fields_list = parse_json_field(data.get("conditional_fit_feilds")) # Match frontend key 'feilds'

            # Prepare defaults, mapping payload keys to model fields
            defaults = {
                'tremors': data.get("tremors"),
                'romberg_test': data.get("romberg_test"),
                'acrophobia': data.get("acrophobia"),
                'trendelenberg_test': data.get("trendelenberg_test"),
                #special cases
                'special_cases': data.get('special_cases'), # Get value from payload
                'job_nature': job_nature_list, # Use parsed list
                'overall_fitness': data.get("overall_fitness"),
                'conditional_fit_feilds': conditional_fit_fields_list, # Use parsed list
                'general_examination': data.get("general_examination"),
                'systematic_examination': data.get("systematic_examination"),
                'eye_exam_result': data.get("eye_exam_result"),
                'eye_exam_fit_status': data.get("eye_exam_fit_status"),
                'validity': parse_date_internal(data.get("validity")), # Parse date
                'comments': data.get("comments"),
                'employer': data.get("employer"),
                # Assuming 'emp_no' field still exists in FitnessAssessment, populate it if sent
                'emp_no': data.get("emp_no")
            }
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            # --- Update Dashboard visitOutcome (Side effect) ---
            overall_fitness_status = data.get("overall_fitness")
            if overall_fitness_status:
                try:
                    dashboard_entry = Dashboard.objects.filter(aadhar=aadhar, date=entry_date).first()
                    if dashboard_entry:
                        dashboard_entry.visitOutcome = overall_fitness_status
                        dashboard_entry.save(update_fields=['visitOutcome'])
                        logger.info(f"Dashboard visitOutcome updated for aadhar: {aadhar} on {entry_date}")
                    else:
                         logger.info(f"No Dashboard entry for aadhar: {aadhar} on {entry_date} to update outcome.")
                except Exception as db_e:
                     logger.error(f"Error updating Dashboard outcome for aadhar {aadhar}: {db_e}", exc_info=True)

            # --- Update or Create Fitness Assessment ---
            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_defaults
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({"message": message}, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Request method must be POST"}, status=405)


@csrf_exempt
def add_consultation(request):
    """Adds or updates consultation data based on AADHAR and today's date."""
    model_class = Consultation
    log_prefix = "add_consultation"
    success_noun = "Consultation"
    # ... copy & adapt the logic from add_vital_details, parsing date fields ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({'status': 'error', 'message': 'Aadhar number (aadhar) is required'}, status=400)

            # Prepare defaults, mapping payload keys to model fields
            defaults = {
                'complaints': data.get('complaints'),
                'examination': data.get('examination'),
                'systematic': data.get('systematic'),
                'lexamination': data.get('lexamination'),
                'diagnosis': data.get('diagnosis'),
                'procedure_notes': data.get('procedure_notes'),
                'obsnotes': data.get('obsnotes'),
                'investigation_details': data.get('investigation_details'),
                'advice': data.get('advice'),
                'follow_up_date': parse_date_internal(data.get('follow_up_date')), # Parse date
                'case_type': data.get('case_type'),
                'illness_or_injury': data.get('illness_or_injury'),
                'other_case_details': data.get('other_case_details'),
                'notifiable_remarks': data.get('notifiable_remarks'),
                'referral': data.get('referral'),
                'hospital_name': data.get('hospital_name') if data.get('referral') == 'yes' else '',
                'speciality': data.get('speciality') if data.get('referral') == 'yes' else '', # Corrected spelling
                'doctor_name': data.get('doctor_name') if data.get('referral') == 'yes' else '',
                'submitted_by_doctor': data.get('submitted_by_doctor'),
                'submitted_by_nurse': data.get('submitted_by_nurse'),
                # Special cases
            'special_cases': data.get('special_cases'), # Get 'special_cases' value from payload
                 # Assuming 'emp_no' field still exists in Consultation model
                'emp_no': data.get('emp_no')
            }
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_defaults
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({
                'status': 'success',
                'message': message,
                'consultation_id': instance.id,
                'created': created
            }, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use POST.'}, status=405)


@csrf_exempt
def add_significant_notes(request):
    """Adds or updates significant notes based on AADHAR and today's date."""
    model_class = SignificantNotes
    log_prefix = "add_significant_notes"
    success_noun = "Significant Notes"
    # ... copy & adapt the logic from add_vital_details ...
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({'status': 'error', 'message': 'Aadhar number (aadhar) is required'}, status=400)

            # Map payload keys to model fields
            defaults = {
                'healthsummary': data.get('healthsummary'),
                'remarks': data.get('remarks'),
                'communicable_disease': data.get('communicable_disease'),
                'incident_type': data.get('incident_type'),
                'incident': data.get('incident'),
                'illness_type': data.get('illness_type'),
                # Assuming 'emp_no' field still exists
                'emp_no': data.get('emp_no')
                # Add submitted_by if needed: 'submitted_by': data.get('submitted_by'),
            }
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            # --- Update Dashboard visitOutcome (Side effect) ---
            healthsummary_val = data.get('healthsummary')
            if healthsummary_val:
                 try:
                     outcome_entry = Dashboard.objects.filter(aadhar=aadhar, date=entry_date).first()
                     if outcome_entry:
                         outcome_entry.visitOutcome = healthsummary_val
                         outcome_entry.save(update_fields=['visitOutcome'])
                         logger.info(f"Dashboard visitOutcome updated via Significant Notes for aadhar: {aadhar} on {entry_date}")
                 except Exception as db_e:
                      logger.error(f"Error updating Dashboard outcome from Sig. Notes for aadhar {aadhar}: {db_e}", exc_info=True)


            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_defaults
                # If healthsummary should be part of the unique key:
                # aadhar=aadhar, entry_date=entry_date, healthsummary=healthsummary_val, defaults=filtered_defaults
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}.")
            return JsonResponse({
                'status': 'success',
                'message': message,
                'significant_note_id': instance.id
            }, status=201 if created else 200)
        except json.JSONDecodeError: # ... error handling ...
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)
        except Exception as e: # ... error handling ...
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use POST.'}, status=405)


@csrf_exempt
def get_notes(request, aadhar): # CHANGED: emp_no -> aadhar
    """Fetches significant notes and employee status based on AADHAR."""
    # Original used POST, should be GET
    if request.method == 'POST' or request.method == 'GET': # Allow GET
        try:
            # Fetch notes for the specific aadhar
            notes = list(SignificantNotes.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').values())

            # Fetch the *latest* status details for that aadhar
            latest_employee_entry = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()

            emp_status_data = {}
            if latest_employee_entry:
                 emp_status_data = {
                     'employee_status': latest_employee_entry.employee_status,
                     'since_date': latest_employee_entry.since_date.isoformat() if latest_employee_entry.since_date else None,
                     'transfer_details': latest_employee_entry.transfer_details,
                     'other_reason_details': latest_employee_entry.other_reason_details
                 }

            # Format dates in notes
            for note in notes:
                if isinstance(note.get('entry_date'), date):
                    note['entry_date'] = note['entry_date'].isoformat()

            logger.info(f"Fetched {len(notes)} notes and status for aadhar {aadhar}.")
            # Return notes list and single status object
            return JsonResponse({'notes': notes, 'status': emp_status_data})
        except Exception as e:
            logger.exception(f"get_notes failed for aadhar {aadhar}: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", "detail": str(e)}, status=500)

    else:
        logger.warning(f"get_notes failed for aadhar {aadhar}: Invalid request method.")
        return JsonResponse({'error': 'Invalid request method. Use GET or POST.'}, status=405)


@csrf_exempt
def get_notes_all(request):
    """Fetches ALL significant notes and consultations."""
    # Original used POST, should be GET
    if request.method == 'POST' or request.method == 'GET': # Allow GET
        try:
            # Fetch all notes and consultations, order by date descending
            notes = list(SignificantNotes.objects.all().order_by('-entry_date', '-id').values())
            consultations = list(Consultation.objects.all().order_by('-entry_date', '-id').values())

            # Format dates
            for record in notes + consultations:
                 if isinstance(record.get('entry_date'), date):
                    record['entry_date'] = record['entry_date'].isoformat()
                 # Format other date fields like follow_up_date if needed
                 if isinstance(record.get('follow_up_date'), date):
                     record['follow_up_date'] = record['follow_up_date'].isoformat()


            logger.info(f"Fetched all notes ({len(notes)}) and consultations ({len(consultations)}).")
            return JsonResponse({'notes': notes, 'consultation': consultations})
        except Exception as e:
            logger.exception("get_notes_all failed: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning("get_notes_all failed: Invalid request method.")
        return JsonResponse({'error': 'Invalid request method. Use GET or POST.'}, status=405)


# --- Forms (Using Aadhar from payload) ---
# Includes create_form17, create_form38, create_form39, create_form40, create_form27
# (These were already provided in the previous step as modified)


def parse_form_date(date_str):
    if not date_str: return None
    try: return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError): return None

# Utility function for form age parsing
def parse_form_age(age_str):
    try: return int(age_str) if age_str else None
    except (ValueError, TypeError): return None

@csrf_exempt
def create_form17(request):
    model_class = Form17
    log_prefix = "create_form17"
    form_name = "Form 17"

    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            logger.debug(f"Received {form_name} Data: {json.dumps(data)[:500]}...")

            # *** KEY CHANGE: Expect 'aadhar' ***
            aadhar = data.get('aadhar')
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required.")
                return JsonResponse({'error': 'Aadhar number (aadhar) is required'}, status=400)

            # Prepare form data, parsing dates/ages
            form_data = {
                'aadhar': aadhar, # Add aadhar
                'entry_date': entry_date,
                'dept': data.get('dept', ''),
                'worksNumber': data.get('worksNumber', ''), # This might be emp_no? Clarify if needed.
                'workerName': data.get('workerName', ''),
                'sex': data.get('sex', 'male'),
                'dob': parse_form_date(data.get('dob')),
                'age': parse_form_age(data.get('age')),
                'employmentDate': parse_form_date(data.get('employmentDate')),
                'leavingDate': parse_form_date(data.get('leavingDate')),
                'reason': data.get('reason', ''),
                'transferredTo': data.get('transferredTo', ''),
                'jobNature': data.get('jobNature', ''),
                'rawMaterial': data.get('rawMaterial', ''),
                'medicalExamDate': parse_form_date(data.get('medicalExamDate')),
                'medicalExamResult': data.get('medicalExamResult', ''),
                'suspensionDetails': data.get('suspensionDetails', ''),
                'recertifiedDate': parse_form_date(data.get('recertifiedDate')),
                'unfitnessCertificate': data.get('unfitnessCertificate', ''),
                'surgeonSignature': data.get('surgeonSignature', ''),
                'fmoSignature': data.get('fmoSignature', ''),
                # Assuming 'emp_no' field still exists in Form17 model
                'emp_no': data.get('emp_no')
            }

            # Create a new form instance - Forms are usually not updated this way, create new.
            form = model_class(**form_data)
            form.full_clean() # Validate model fields
            form.save()

            logger.info(f"{form_name} created successfully for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully'}, status=201)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: Validation Error: {e.message_dict}", exc_info=True)
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", 'detail': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


# --- Apply the create_form17 pattern to create_form38, create_form39, create_form40, create_form27 ---
# Remember to change model_class, log_prefix, form_name, and the specific fields being extracted and saved.

@csrf_exempt
def create_form38(request):
    model_class = Form38
    log_prefix = "create_form38"
    form_name = "Form 38"
    # ... copy & adapt logic from create_form17 ...
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar: return JsonResponse({'error': 'Aadhar required'}, status=400)

            form_data = {
                'aadhar': aadhar, 'entry_date': entry_date,
                'serialNumber': data.get('serialNumber', ''),
                'department': data.get('department', ''),
                'workerName': data.get('workerName', ''),
                'sex': data.get('sex', 'male'),
                'age': parse_form_age(data.get('age')),
                'jobNature': data.get('jobNature', ''),
                'employmentDate': parse_form_date(data.get('employmentDate')),
                'eyeExamDate': parse_form_date(data.get('eyeExamDate')),
                'result': data.get('result', ''),
                'opthamologistSignature': data.get('opthamologistSignature', ''), # Typo: Ophthalmologist
                'fmoSignature': data.get('fmoSignature', ''),
                'remarks': data.get('remarks', ''),
                'emp_no': data.get('emp_no') # Assuming exists
            }
            form = model_class(**form_data)
            form.full_clean()
            form.save()
            logger.info(f"{form_name} created for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully'}, status=201)
        # ... error handling ...
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


@csrf_exempt
def create_form39(request):
    model_class = Form39
    log_prefix = "create_form39"
    form_name = "Form 39"
    # ... copy & adapt logic from create_form17 ...
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar: return JsonResponse({'error': 'Aadhar required'}, status=400)

            form_data = {
                'aadhar': aadhar, 'entry_date': entry_date,
                'serialNumber': data.get('serialNumber', ''),
                'workerName': data.get('workerName', ''),
                'sex': data.get('sex', 'male'),
                'age': parse_form_age(data.get('age')),
                'proposedEmploymentDate': parse_form_date(data.get('proposedEmploymentDate')),
                'jobOccupation': data.get('jobOccupation', ''),
                'rawMaterialHandled': data.get('rawMaterialHandled', ''),
                'medicalExamDate': parse_form_date(data.get('medicalExamDate')),
                'medicalExamResult': data.get('medicalExamResult', ''),
                'certifiedFit': data.get('certifiedFit', ''),
                'certifyingSurgeonSignature': data.get('certifyingSurgeonSignature', ''),
                'departmentSection': data.get('departmentSection', ''),
                'emp_no': data.get('emp_no') # Assuming exists
            }
            form = model_class(**form_data)
            form.full_clean()
            form.save()
            logger.info(f"{form_name} created for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully'}, status=201)
        # ... error handling ...
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)

@csrf_exempt
def create_form40(request):
    model_class = Form40
    log_prefix = "create_form40"
    form_name = "Form 40"
    # ... copy & adapt logic from create_form17 ...
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar: return JsonResponse({'error': 'Aadhar required'}, status=400)

            form_data = {
                'aadhar': aadhar, 'entry_date': entry_date,
                'serialNumber': data.get('serialNumber', ''),
                'dateOfEmployment': parse_form_date(data.get('dateOfEmployment')),
                'workerName': data.get('workerName', ''),
                'sex': data.get('sex', 'male'),
                'age': parse_form_age(data.get('age')),
                'sonWifeDaughterOf': data.get('sonWifeDaughterOf', ''),
                'natureOfJob': data.get('natureOfJob', ''),
                'urineResult': data.get('urineResult', ''),
                'bloodResult': data.get('bloodResult', ''),
                'fecesResult': data.get('fecesResult', ''),
                'xrayResult': data.get('xrayResult', ''),
                'otherExamResult': data.get('otherExamResult', ''),
                'deworming': data.get('deworming', ''),
                'typhoidVaccinationDate': parse_form_date(data.get('typhoidVaccinationDate')),
                'signatureOfFMO': data.get('signatureOfFMO', ''),
                'remarks': data.get('remarks', ''),
                'emp_no': data.get('emp_no') # Assuming exists
            }
            form = model_class(**form_data)
            form.full_clean()
            form.save()
            logger.info(f"{form_name} created for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully'}, status=201)
        # ... error handling ...
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)

@csrf_exempt
def create_form27(request):
    model_class = Form27
    log_prefix = "create_form27"
    form_name = "Form 27"
    # ... copy & adapt logic from create_form17 ...
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body)
            aadhar = data.get('aadhar')
            entry_date = date.today() # Use today as entry date for the record
            form_date = parse_form_date(data.get('date')) # The date field on the form itself

            if not aadhar: return JsonResponse({'error': 'Aadhar required'}, status=400)

            form_data = {
                'aadhar': aadhar, 'entry_date': entry_date,
                'serialNumber': data.get('serialNumber', ''),
                'date': form_date, # Use parsed form date
                'department': data.get('department', ''),
                'nameOfWorks': data.get('nameOfWorks', ''),
                'sex': data.get('sex', 'male'),
                'dateOfBirth': parse_form_date(data.get('dateOfBirth')),
                'age': parse_form_age(data.get('age')),
                'nameOfTheFather': data.get('nameOfTheFather', ''),
                'natureOfJobOrOccupation': data.get('natureOfJobOrOccupation', ''),
                'signatureOfFMO': data.get('signatureOfFMO', ''),
                'descriptiveMarks': data.get('descriptiveMarks', ''),
                'signatureOfCertifyingSurgeon': data.get('signatureOfCertifyingSurgeon', ''),
                'emp_no': data.get('emp_no') # Assuming exists
            }
            form = model_class(**form_data)
            form.full_clean()
            form.save()
            logger.info(f"{form_name} created for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully'}, status=201)
        # ... error handling ...
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


# --- Appointments (Using AadharNo / ID) ---
# Includes BookAppointment, uploadAppointment, get_appointments, update_appointment_status
# (These were already provided in the previous step as modified)


@csrf_exempt
def BookAppointment(request): # Renamed in urls.py from bookAppointment
    """Books a new appointment, linking via AADHAR."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # *** KEY CHANGE: Prioritize aadharNo from payload ***
            aadhar_no = data.get("aadharNo") # Expect Aadhar from frontend
            employee_id = data.get("employeeId") # Still accept emp_no if sent

            # Basic validation
            if not aadhar_no:
                 logger.warning("BookAppointment failed: Aadhar Number (aadharNo) is required.")
                 return JsonResponse({"error": "Aadhar Number (aadharNo) is required"}, status=400)

            appointment_date_str = data.get("appointmentDate")
            if not appointment_date_str:
                logger.warning("BookAppointment failed: Appointment date is required.")
                return JsonResponse({"error": "Appointment date is required"}, status=400)

            try:
                appointment_date_obj = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
            except ValueError:
                logger.error(f"BookAppointment failed: Invalid appointment date format: {appointment_date_str}. Use YYYY-MM-DD.")
                return JsonResponse({"error": "Invalid appointment date format. Use YYYY-MM-DD."}, status=400)

            # Generate Appointment Number (logic seems okay)
            existing_appointments = Appointment.objects.filter(date=appointment_date_obj).count()
            next_appointment_number = existing_appointments + 1
            appointment_no_gen = f"{next_appointment_number:04d}{appointment_date_obj.strftime('%d%m%Y')}"

            # Create Appointment instance
            appointment_data = {
                'appointment_no': appointment_no_gen,
                'booked_date': date.today(), # Use today's date for booking
                'role': data.get("role", "Unknown"),
                'aadhar_no': aadhar_no, # *** Use aadhar_no ***
                'emp_no': employee_id, # Store emp_no if provided
                'name': data.get("name", "Unknown"),
                'organization_name': data.get("organization", ""), # Use empty string default
                'contractor_name': data.get("contractorName", ""), # Use empty string default
                'purpose': data.get("purpose", "Unknown"),
                'date': appointment_date_obj,
                'time': data.get("time", ""), # Use empty string default
                'booked_by': data.get("bookedBy", "System"), # Default booked_by
                'submitted_by_nurse': data.get("submitted_by_nurse", ""),
                'submitted_Dr': data.get("submitted_Dr", ""), # Typo in original? Dr
                'consultated_Dr': data.get("consultedDoctor", ""), # Changed key to match payload?
                'employer': data.get("employer", ""), # Capture employer explicitly
                # Add other fields like 'status' if needed with a default
                'status': Appointment.StatusChoices.INITIATE # Default status
            }

            appointment = Appointment.objects.create(**appointment_data)

            logger.info(f"Appointment {appointment.appointment_no} booked successfully for Aadhar {appointment.aadhar_no} on {appointment.date}.")
            return JsonResponse({
                "message": f"Appointment booked successfully for {appointment.name} on {appointment.date}.",
                "appointment_no": appointment.appointment_no,
                "id": appointment.id
            }, status=201)

        except json.JSONDecodeError:
            logger.error("BookAppointment failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("BookAppointment failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning("BookAppointment failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request. Use POST."}, status=405)


@csrf_exempt # Should be GET
def get_appointments(request):
    """Retrieves appointments based on optional filters (date range, aadharNo)."""
    if request.method == "GET":
        try:
            from_date_str = request.GET.get('fromDate')
            to_date_str = request.GET.get('toDate')
            aadhar_filter = request.GET.get('aadharNo') # Filter by Aadhar
            status_filter = request.GET.get('status') # Filter by status

            queryset = Appointment.objects.all()

            # Apply date filters
            if from_date_str:
                from_date = parse_date_internal(from_date_str)
                if from_date:
                    queryset = queryset.filter(date__gte=from_date)
                else: return JsonResponse({"error": "Invalid fromDate format. Use YYYY-MM-DD."}, status=400)
            if to_date_str:
                to_date_obj = parse_date_internal(to_date_str)
                if to_date_obj:
                    queryset = queryset.filter(date__lte=to_date_obj)
                else: return JsonResponse({"error": "Invalid toDate format. Use YYYY-MM-DD."}, status=400)

            # Apply Aadhar filter
            if aadhar_filter:
                queryset = queryset.filter(aadhar_no=aadhar_filter)

            # Apply Status filter
            if status_filter:
                 # Validate status_filter against choices if possible
                 valid_statuses = [choice[0] for choice in Appointment.StatusChoices.choices]
                 if status_filter in valid_statuses:
                      queryset = queryset.filter(status=status_filter)
                 else:
                      logger.warning(f"Invalid status filter received: {status_filter}")
                      # Optionally return error or ignore invalid filter

            # Order results
            appointments = queryset.order_by('date', 'time')

            # Serialize data
            appointment_list = []
            for app in appointments:
                 app_data = model_to_dict(app)
                 # Format dates
                 app_data['date'] = app.date.isoformat() if app.date else None
                 app_data['booked_date'] = app.booked_date.isoformat() if app.booked_date else None
                 appointment_list.append(app_data)

            logger.info(f"Fetched {len(appointment_list)} appointments.")
            return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."}, safe=False)

        except Exception as e:
             logger.exception("get_appointments failed: An unexpected error occurred.")
             return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning("get_appointments failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request. Use GET."}, status=405)

@csrf_exempt
def update_appointment_status(request):
    """Updates the status of an appointment based on its ID."""
    # Operates on appointment ID, no aadhar change needed.
    if request.method == "POST": # Should ideally be PUT or PATCH
        try:
            data = json.loads(request.body)
            appointment_id = data.get("id")
            new_status = data.get("status") # Optionally allow setting specific status

            if not appointment_id:
                 return JsonResponse({"success": False, "message": "Appointment ID is required."}, status=400)

            appointment = get_object_or_404(Appointment, id=appointment_id)

            current_status = appointment.status

            # Option 1: Cycle through statuses (as per original logic)
            if new_status is None:
                if current_status == Appointment.StatusChoices.INITIATE:
                    next_status = Appointment.StatusChoices.IN_PROGRESS
                elif current_status == Appointment.StatusChoices.IN_PROGRESS:
                    next_status = Appointment.StatusChoices.COMPLETED
                else: # Already completed or other status
                    logger.warning(f"Cannot cycle status further for appointment ID {appointment_id}. Current status: {current_status}")
                    return JsonResponse({"success": False, "message": "Cannot update status further from current state."}, status=400)
                appointment.status = next_status
            # Option 2: Set specific status from payload
            else:
                 valid_statuses = [choice[0] for choice in Appointment.StatusChoices.choices]
                 if new_status in valid_statuses:
                      # Add logic here to prevent invalid transitions if needed
                      # e.g., if current_status == 'COMPLETED' and new_status == 'INITIATE': return error
                      appointment.status = new_status
                 else:
                      logger.warning(f"Invalid status value '{new_status}' provided for appointment ID {appointment_id}.")
                      return JsonResponse({"success": False, "message": "Invalid status value provided."}, status=400)


            appointment.save(update_fields=['status'])
            logger.info(f"Appointment status updated successfully for ID {appointment_id}. New status: {appointment.status}")
            return JsonResponse({"success": True, "message": "Status updated", "status": appointment.status})

        except Http404:
            logger.warning(f"update_appointment_status failed: Appointment with ID {appointment_id} not found.")
            return JsonResponse({"success": False, "message": "Appointment not found"}, status=404)
        except json.JSONDecodeError:
            logger.error("update_appointment_status failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"success": False, "message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"update_appointment_status failed for ID {appointment_id or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"success": False, "message": "An unexpected server error occurred.", "detail": str(e)}, status=500)

    logger.warning("update_appointment_status failed: Invalid request method.")
    return JsonResponse({"error": "Invalid request method (use POST/PUT/PATCH)."}, status=405)


@csrf_exempt
def uploadAppointment(request):
    """Uploads appointments from a JSON payload, using AADHAR."""
    if request.method != "POST":
        logger.warning("uploadAppointment failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=400) # 405 recommended

    try:
        data = json.loads(request.body)
        appointments_data = data.get("appointments", []) # Expecting a list of lists/rows

        if not appointments_data or len(appointments_data) <= 1: # Check for header row
            logger.warning("uploadAppointment failed: No appointment data provided or only header row found.")
            return JsonResponse({"error": "No valid appointment data provided."}, status=400)

        successful_uploads = 0
        failed_uploads = []
        processed_count = 0

        # Helper to safely get data from row, handling index errors
        def get_cell(row, index, default=''):
            try: return str(row[index]).strip() if row[index] is not None else default
            except IndexError: return default

        # --- Excel date parsing ---
        def parse_excel_date(value):
            if isinstance(value, (int, float)): # Excel serial date
                try: return (datetime(1899, 12, 30) + timedelta(days=value)).date()
                except OverflowError: return None # Handle very large numbers
            if isinstance(value, str):
                value = value.strip()
                for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%d/%m/%Y"): # Add more formats if needed
                    try: return datetime.strptime(value, fmt).date()
                    except ValueError: continue
            if isinstance(value, datetime): return value.date()
            if isinstance(value, date): return value
            return None # Cannot parse

        # Process rows (skip header - index 0)
        for i, row_data in enumerate(appointments_data):
            if i == 0: continue # Skip header
            processed_count += 1

            try:
                # Extract data using safe helper
                role = get_cell(row_data, 1).lower()
                name = get_cell(row_data, 2)
                emp_no_val = get_cell(row_data, 3)
                organization = get_cell(row_data, 4)
                # *** KEY CHANGE: Get Aadhar from expected column (index 5) ***
                aadhar_no_val = get_cell(row_data, 5)
                contractor_name_val = get_cell(row_data, 6)
                purpose_val = get_cell(row_data, 7)
                date_val = parse_excel_date(row_data[8] if len(row_data) > 8 else None)
                time_val = get_cell(row_data, 9)
                booked_by_val = get_cell(row_data, 10)
                submitted_by_nurse_val = get_cell(row_data, 11) # Indices seem off in original, adjusting
                submitted_dr_val = get_cell(row_data, 12)
                consulted_dr_val = get_cell(row_data, 13)

                # --- Validation ---
                if not aadhar_no_val:
                    raise ValueError(f"Row {i+1}: Missing Aadhar Number (Column F/Index 5)")
                if not date_val:
                    raise ValueError(f"Row {i+1}: Invalid or missing Appointment Date (Column I/Index 8)")
                if role not in ["contractor", "employee", "visitor"]:
                     raise ValueError(f"Row {i+1}: Invalid Role '{role}' (Column B/Index 1). Must be contractor, employee, or visitor.")

                # Determine employer/org based on role
                employer_val = organization if role == "employee" else contractor_name_val if role == "contractor" else organization

                # Generate appointment number
                formatted_date = date_val.strftime("%d%m%Y")
                # This count needs to be accurate for the *specific date* being processed
                # Consider locking or more robust sequence generation if high concurrency expected
                with transaction.atomic(): # Basic concurrency protection
                    appointment_count_today = Appointment.objects.filter(date=date_val).count()
                    appointment_no_gen = f"{(appointment_count_today + 1):04d}{formatted_date}"

                # Create Appointment
                Appointment.objects.create(
                    appointment_no=appointment_no_gen,
                    booked_date=date.today(),
                    role=role,
                    emp_no=emp_no_val,
                    aadhar_no=aadhar_no_val, # Use Aadhar
                    name=name,
                    organization_name=organization,
                    contractor_name=contractor_name_val,
                    purpose=purpose_val,
                    date=date_val,
                    time=time_val,
                    booked_by=booked_by_val or "Bulk Upload",
                    submitted_by_nurse=submitted_by_nurse_val,
                    submitted_Dr=submitted_dr_val,
                    consultated_Dr=consulted_dr_val,
                    employer=employer_val,
                    status = Appointment.StatusChoices.INITIATE # Default status
                )
                successful_uploads += 1

            except (IndexError, ValueError, ValidationError, TypeError) as e:
                error_msg = f"Row {i+1}: Error processing - {str(e)}. Data: {row_data}"
                logger.error(f"uploadAppointment error: {error_msg}")
                failed_uploads.append(error_msg)
            except Exception as e:
                 error_msg = f"Row {i+1}: Unexpected error - {str(e)}. Data: {row_data}"
                 logger.exception(f"uploadAppointment unexpected error: {error_msg}")
                 failed_uploads.append(error_msg)


        # --- Report Results ---
        total_rows = processed_count
        message = f"Processed {total_rows} rows. {successful_uploads} appointments uploaded successfully."
        status_code = 200 # OK, even if some failed

        response_data = {"message": message, "successful_uploads": successful_uploads}
        if failed_uploads:
            response_data["failed_uploads"] = len(failed_uploads)
            response_data["errors"] = failed_uploads[:10] # Return details for first few errors
            message += f" {len(failed_uploads)} rows failed to upload."
            response_data["message"] = message # Update message
            if successful_uploads == 0:
                 status_code = 400 # Bad request if nothing succeeded

        logger.info(f"uploadAppointment result: {message}")
        return JsonResponse(response_data, status=status_code)

    except json.JSONDecodeError:
        logger.error("uploadAppointment failed: Invalid JSON format.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    except Exception as e:
        logger.exception("uploadAppointment failed: An unexpected error occurred during bulk upload.")
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

# --- Prescriptions (Using Aadhar / ID) ---
# Includes add_prescription, view_prescriptions, view_prescriptions_emp, view_prescription_by_id
# Note: update_prescription was removed as redundant
# (These were already provided in the previous step as modified)


@csrf_exempt
def add_prescription(request):
    """Adds or updates prescription data based on AADHAR and current date."""
    if request.method == "POST":
        data = None
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            logger.debug(f"Received data for add_prescription: {json.dumps(data)[:500]}...")

            # *** KEY CHANGE: Expect 'aadhar' ***
            aadhar = data.get('aadhar')
            name = data.get('name') # Employee name

            # Validations
            if not aadhar:
                logger.warning("add_prescription failed: aadhar is required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)
            if not name:
                logger.warning("add_prescription failed: name is required")
                return JsonResponse({"error": "Employee name (name) is required"}, status=400)
            submitted_by = data.get('submitted_by')
            issued_by = data.get('issued_by') # Might be empty initially
            if not submitted_by: # Issued_by might only be set when status changes
                logger.warning("add_prescription failed: submitted_by is required")
                return JsonResponse({"error": "submitted_by is required"}, status=400)

            # Extract prescription details (JSON fields)
            prescription_details = {
                'tablets': data.get('tablets', []),
                'syrups': data.get('syrups', []),
                'injections': data.get('injections', []),
                'creams': data.get('creams', []),
                'drops': data.get('drops', []),
                'fluids': data.get('fluids', []),
                'lotions': data.get('lotions', []),
                'respules': data.get('respules', []),
                'suture_procedure': data.get('suture_procedure', []),
                'dressing': data.get('dressing', []),
                'powder': data.get('powder', []),
                'others': data.get('others', []),
            }

            # Get other fields
            nurse_notes = data.get('nurse_notes')
            # Default status to PENDING (0) if not provided
            issued_status = data.get('issued_status', 0)

            # Use today's date for the entry
            current_entry_date = date.today()

            # Prepare defaults for update_or_create
            defaults = {
                'name': name,
                'submitted_by': submitted_by,
                'issued_by': issued_by or '', # Store empty string if not provided yet
                'nurse_notes': nurse_notes or '', # Store empty string if None
                'issued_status': issued_status,
                # Assuming 'emp_no' field still exists in Prescription model
                'emp_no': data.get('emp_no'),
                **prescription_details # Unpack the details dictionary
            }

            # *** KEY CHANGE: Use aadhar in update_or_create ***
            prescription, created = Prescription.objects.update_or_create(
                aadhar=aadhar,
                entry_date=current_entry_date,  # Use DATE object for matching today's prescription
                defaults=defaults
            )

            message = "Prescription details added successfully" if created else "Prescription details updated successfully"
            logger.info(f"{message} for aadhar {aadhar} on {current_entry_date}. ID: {prescription.id}, Status: {prescription.issued_status}")
            return JsonResponse({
                "message": message,
                "prescription_id": prescription.id,
                "id": prescription.id, # Keep 'id' for potential frontend use
                "created": created,
                "issued_status": prescription.issued_status # Return current status
            }, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error("add_prescription failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data in request body"}, status=400)
        except Exception as e:
            aadhar_for_log = aadhar or (data.get('aadhar') if data else 'N/A')
            logger.exception(f"add_prescription failed for aadhar '{aadhar_for_log}': An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    else:
        logger.warning("add_prescription failed: Invalid request method. Only POST allowed.")
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response

@csrf_exempt # Should be GET
def view_prescriptions(request):
    """Views all prescriptions."""
    if request.method == 'GET':
        try:
            # Fetch all prescriptions, maybe order by date
            prescriptions = Prescription.objects.all().order_by('-entry_date', '-id')
            data = []
            for p in prescriptions:
                # Serialize the data more cleanly
                p_data = model_to_dict(p)
                p_data['entry_date'] = p.entry_date.isoformat() if p.entry_date else None
                # Include concatenated name if needed by frontend, but better handled there
                # p_data['submitted_issued_by'] = f"{p.submitted_by} / {p.issued_by}"
                data.append(p_data)

            logger.info(f"Fetched {len(data)} prescriptions.")
            return JsonResponse({'prescriptions': data})
        except Exception as e:
            logger.exception("view_prescriptions failed: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", 'detail': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)


@csrf_exempt
def view_prescriptions_emp(request, aadhar): # CHANGED: emp_no -> aadhar
    """Handles GET (view) and PUT (update/issue) for prescriptions by AADHAR."""

    if request.method == 'GET':
        # --- View prescriptions for a specific Aadhar ---
        try:
            prescriptions = Prescription.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id')
            data = []
            for p in prescriptions:
                 p_data = model_to_dict(p)
                 p_data['entry_date'] = p.entry_date.isoformat() if p.entry_date else None
                 data.append(p_data)

            logger.info(f"Fetched {len(data)} prescriptions for aadhar {aadhar}.")
            return JsonResponse({'prescriptions': data})
        except Exception as e:
            logger.exception(f"Error viewing prescriptions for aadhar {aadhar} (GET): {e}")
            return JsonResponse({'error': 'An unexpected error occurred.', 'detail': str(e)}, status=500)

    elif request.method == 'PUT':
        # --- Update/Issue a specific prescription for this Aadhar ---
        prescription_id = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            prescription_id = data.get('id') or data.get('prescription_id') # Get ID from payload

            if not prescription_id:
                 logger.warning(f"Update prescription failed for aadhar {aadhar}: Missing prescription ID in PUT request data")
                 return JsonResponse({'error': 'Missing prescription ID in PUT request data'}, status=400)

            # Fetch the specific prescription, ensuring it belongs to the correct Aadhar
            prescription = get_object_or_404(Prescription, pk=prescription_id, aadhar=aadhar)

            # --- Update fields from payload ---
            # Only update fields relevant to issuing/pharmacist update
            prescription.issued_by = data.get('issued_by', prescription.issued_by)
            prescription.nurse_notes = data.get('nurse_notes', prescription.nurse_notes) # Allow updating notes

            # Update prescription items if they are sent (e.g., quantity dispensed adjustments?)
            # Be careful here - only update what's necessary for the issuing process
            prescription.tablets = data.get('tablets', prescription.tablets)
            prescription.syrups = data.get('syrups', prescription.syrups)
            # ... update other item types if needed ...

            # Mark as issued (status = 1)
            new_status = data.get('issued_status', 1) # Default to issuing (1)
            if new_status not in [0, 1]: # Basic validation
                 logger.warning(f"Invalid issued_status '{new_status}' received for prescription {prescription_id}.")
                 return JsonResponse({'error': 'Invalid issued_status value (must be 0 or 1).'}, status=400)
            prescription.issued_status = new_status

            # Prepare list of fields to update
            update_fields = ['issued_by', 'nurse_notes', 'issued_status', 'tablets', 'syrups'] # Add other item types if updated

            prescription.save(update_fields=update_fields)
            logger.info(f"Successfully updated Prescription ID: {prescription.id} for aadhar {aadhar}. Status set to {prescription.issued_status}")

            return JsonResponse({
                'message': f'Prescription {prescription.id} updated successfully.',
                'issued_status': prescription.issued_status
            })

        except Http404:
             logger.warning(f"Prescription not found for ID: {prescription_id} and Aadhar: {aadhar}")
             return JsonResponse({'error': 'Prescription not found for this ID and Aadhar.'}, status=404)
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received updating prescription for aadhar {aadhar}", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.exception(f"Error updating prescription for aadhar {aadhar} (PUT, ID: {prescription_id}): {e}")
            return JsonResponse({'error': 'An unexpected error occurred.', 'detail': str(e)}, status=500)
    else:
        # Method not allowed
        response = JsonResponse({'error': 'Invalid request method. Only GET or PUT allowed.'}, status=405)
        response['Allow'] = 'GET, PUT'
        return response

@csrf_exempt
def view_prescription_by_id(request, prescription_id):
    """Retrieves a single prescription by its ID."""
    # Operates on ID, no aadhar change needed.
    if request.method == 'GET':
        try:
            prescription = get_object_or_404(Prescription, pk=prescription_id)

            # Serialize the single object
            p_data = model_to_dict(prescription)
            p_data['entry_date'] = prescription.entry_date.isoformat() if prescription.entry_date else None

            logger.info(f"Fetched prescription by ID: {prescription_id}")
            return JsonResponse(p_data)

        except Http404:
            logger.warning(f"view_prescription_by_id failed: Prescription with ID {prescription_id} not found.")
            return JsonResponse({'error': 'Prescription not found'}, status=404)
        except Exception as e:
            logger.exception(f"view_prescription_by_id failed for ID {prescription_id}: An unexpected error occurred.")
            return JsonResponse({'error': 'Internal Server Error', 'detail': str(e)}, status=500)
    else:
        logger.warning(f"view_prescription_by_id failed for ID {prescription_id}: Invalid request method.")
        response = JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)
        response['Allow'] = 'GET'
        return response


# --- Mock Drills / Camps / Reviews (Unaffected or uses Aadhar as needed) ---
# Includes save_mockdrills, get_mockdrills, add_camp, get_camps, upload_files, download_file, delete_file, get_categories, get_reviews, add_review
# (Already provided in the previous step)


# --- Mock Drills ---
@csrf_exempt
def save_mockdrills(request):
    """Saves mock drill data, potentially linking to AADHAR."""
    if request.method == "POST":
        aadhar = None # Initialize
        try:
            data = json.loads(request.body)
            logger.debug(f"Received data for save_mockdrills: {json.dumps(data)[:500]}...")

            # *** KEY CHANGE: Expect 'aadhar' if victim is employee/contractor ***
            # 'emp_no' might still be relevant if it's a separate identifier
            aadhar = data.get('aadhar') # Get Aadhar if provided
            emp_no_val = data.get('emp_no') # Get emp_no if provided

            # Parse dates
            drill_date = parse_date_internal(data.get("date"))
            # Parse time if needed (e.g., using datetime.strptime(data.get("time"), "%H:%M:%S").time())

            mock_drill_data = {
                'date': drill_date,
                'time': data.get("time"), # Assuming time is stored as string or TimeField
                'department': data.get("department"),
                'location': data.get("location"),
                'scenario': data.get("scenario"),
                'ambulance_timing': data.get("ambulance_timing"),
                'departure_from_OHC': data.get("departure_from_OHC"),
                'return_to_OHC': data.get("return_to_OHC"),
                'aadhar': aadhar, # *** Store aadhar ***
                'emp_no': emp_no_val, # Store emp_no if model has it
                'victim_department': data.get("victim_department"),
                'victim_name': data.get("victim_name"),
                'nature_of_job': data.get("nature_of_job"),
                'age': parse_form_age(data.get("age")), # Use safe age parsing
                'mobile_no': data.get("mobile_no"),
                'gender': data.get("gender"),
                'vitals': data.get("vitals"), # Assuming text/json field
                'complaints': data.get("complaints"),
                'treatment': data.get("treatment"),
                'referal': data.get("referal"), # Typo: referral
                'ambulance_driver': data.get("ambulance_driver"),
                'staff_name': data.get("staff_name"),
                'OHC_doctor': data.get("OHC_doctor"),
                'staff_nurse': data.get("staff_nurse"),
                # Field names need to match model exactly:
                'Action_Completion': data.get("Action_Completion"), # Check model field name
                'Responsible': data.get("Responsible"),             # Check model field name
            }
            # Remove None values if model fields don't allow null
            # filtered_data = {k: v for k, v in mock_drill_data.items() if v is not None}

            mock_drill = mockdrills.objects.create(**mock_drill_data)

            logger.info(f"Mock drill saved successfully with ID: {mock_drill.id}" + (f" for Aadhar: {aadhar}" if aadhar else ""))
            return JsonResponse({"message": f"Mock drill saved successfully with ID: {mock_drill.id}"}, status=201)

        except json.JSONDecodeError:
            logger.error("save_mockdrills failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"save_mockdrills failed (Aadhar: {aadhar or 'N/A'}): An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning("save_mockdrills failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

def get_mockdrills(request):
    # No change needed
    if request.method == "GET":
        try:
            mock_drills_qs = mockdrills.objects.all().order_by('-date', '-time') # Order by date/time
            mock_drills_list = []
            for drill in mock_drills_qs:
                 drill_data = model_to_dict(drill)
                 # Format dates/times if needed
                 drill_data['date'] = drill.date.isoformat() if drill.date else None
                 # Format time if it's a TimeField: drill_data['time'] = drill.time.strftime('%H:%M:%S') if drill.time else None
                 mock_drills_list.append(drill_data)

            return JsonResponse(mock_drills_list, safe=False)
        except Exception as e:
            logger.exception("get_mockdrills failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning("get_mockdrills failed: Invalid request method. Only GET allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_camp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            start_date_obj = parse_date_internal(data.get("start_date"))
            end_date_obj = parse_date_internal(data.get("end_date"))
            if not start_date_obj or not end_date_obj: return JsonResponse({"error": "Invalid date format."}, status=400)
            if start_date_obj > end_date_obj: return JsonResponse({"error": "Start date after end date."}, status=400)
            camp_name = data.get("camp_name")
            if not camp_name: return JsonResponse({"error": "Camp name required."}, status=400)

            camp = eventsandcamps.objects.create(
                camp_name=camp_name, hospital_name=data.get("hospital_name"),
                start_date=start_date_obj, end_date=end_date_obj,
                camp_details=data.get("camp_details"), camp_type=data.get("camp_type", "Camp"),
            )
            logger.info(f"Camp '{camp.camp_name}' saved ID: {camp.id}")
            return JsonResponse({"message": "Camp added.", "id": camp.id}, status=201)
        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            logger.exception("add_camp failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)

def get_camps(request):
    if request.method == "GET":
        try:
            search_term = request.GET.get("searchTerm", "")
            filter_status = request.GET.get("filterStatus", "")
            date_from_str = request.GET.get("dateFrom")
            date_to_str = request.GET.get("dateTo")
            today = date.today()

            camps_qs = eventsandcamps.objects.all()
            if search_term: camps_qs = camps_qs.filter(Q(camp_name__icontains=search_term) | Q(camp_details__icontains=search_term))
            if filter_status == "Live": camps_qs = camps_qs.filter(start_date__lte=today, end_date__gte=today)
            elif filter_status: camps_qs = camps_qs.filter(camp_type=filter_status)

            date_from = parse_date_internal(date_from_str); date_to = parse_date_internal(date_to_str)
            if date_from: camps_qs = camps_qs.filter(start_date__gte=date_from)
            if date_to: camps_qs = camps_qs.filter(end_date__lte=date_to)

            camps_qs = camps_qs.order_by('-start_date', 'camp_name')
            data = []
            media_prefix = get_media_url_prefix(request)
            for camp in camps_qs:
                 data.append({
                     'id': camp.id, 'camp_name': camp.camp_name, 'hospital_name': camp.hospital_name,
                     'start_date': camp.start_date.isoformat() if camp.start_date else None,
                     'end_date': camp.end_date.isoformat() if camp.end_date else None,
                     'camp_details': camp.camp_details, 'camp_type': camp.camp_type,
                     'report1_url': f"{media_prefix}{camp.report1.name}" if camp.report1 else None,
                     'report2_url': f"{media_prefix}{camp.report2.name}" if camp.report2 else None,
                     'photos_url': f"{media_prefix}{camp.photos.name}" if camp.photos else None,
                     'ppt_url': f"{media_prefix}{camp.ppt.name}" if camp.ppt else None,
                 })
            return JsonResponse(data, safe=False)
        except Exception as e:
            logger.exception("get_camps failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method. Use GET."}, status=405)

@csrf_exempt
def upload_files(request):
    if request.method == 'POST':
        camp_id_str = request.POST.get('campId'); file_type = request.POST.get('fileType')
        if not camp_id_str or not file_type: return JsonResponse({'error': 'campId and fileType required.'}, status=400)
        try: camp_id = int(camp_id_str)
        except ValueError: return JsonResponse({'error': 'Invalid campId.'}, status=400)

        valid_file_types = ['report1', 'report2', 'photos', 'ppt']
        if file_type not in valid_file_types: return JsonResponse({'error': f"Invalid file type."}, status=400)

        camp = get_object_or_404(eventsandcamps, pk=camp_id)
        uploaded_file = request.FILES.get('file') or request.FILES.get(file_type)
        if not uploaded_file: return JsonResponse({'error': 'No file uploaded.'}, status=400)

        file_extension = os.path.splitext(uploaded_file.name)[1].lower().strip('.')
        if file_extension not in ALLOWED_FILE_TYPES: return JsonResponse({'error': f"Invalid file type '{file_extension}'."}, status=400)

        old_file_field = getattr(camp, file_type, None)
        if old_file_field and old_file_field.name:
            try:
                if default_storage.exists(old_file_field.path): default_storage.delete(old_file_field.path)
            except Exception as e: logger.error(f"Error deleting old {file_type} for camp {camp_id}: {e}")

        setattr(camp, file_type, uploaded_file)
        camp.save(update_fields=[file_type])
        new_file_field = getattr(camp, file_type)
        file_url = f"{get_media_url_prefix(request)}{new_file_field.name}" if new_file_field else None
        logger.info(f"File uploaded for camp {camp_id}, type {file_type}: {uploaded_file.name}")
        return JsonResponse({'message': 'File uploaded.', 'file_url': file_url}, status=200)
    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)

def download_file(request):
    try:
        camp_id = request.GET.get('campId'); file_type = request.GET.get('fileType')
        if not camp_id or not file_type: raise Http404("Missing params.")
        try: camp_id = int(camp_id)
        except ValueError: raise Http404("Invalid campId.")
        valid_types = ['report1', 'report2', 'photos', 'ppt']
        if file_type not in valid_types: raise Http404("Invalid file type.")

        camp = get_object_or_404(eventsandcamps, pk=camp_id)
        file_field = getattr(camp, file_type, None)
        if not file_field or not file_field.name: raise Http404(f"{file_type} not found.")
        if not default_storage.exists(file_field.path): raise Http404("File not found on server.")

        from django.http import FileResponse # Local import
        response = FileResponse(default_storage.open(file_field.path, 'rb'), as_attachment=True)
        return response
    except Http404 as e:
        logger.warning(f"download_file failed: {e}")
        return HttpResponse(str(e), status=404)
    except Exception as e:
        logger.exception("download_file failed.")
        return HttpResponse("Server error.", status=500)

@csrf_exempt # Should be POST or DELETE
def delete_file(request):
    if request.method == 'POST':
        camp_id_str = None # Initialize
        try:
            data = json.loads(request.body); camp_id_str = data.get('campId'); file_type = data.get('fileType')
            if not camp_id_str or not file_type: return JsonResponse({'error': 'campId/fileType required.'}, status=400)
            try: camp_id = int(camp_id_str)
            except ValueError: return JsonResponse({'error': 'Invalid campId.'}, status=400)
            valid_types = ['report1', 'report2', 'photos', 'ppt']
            if file_type not in valid_types: return JsonResponse({'error': f"Invalid file type."}, status=400)

            camp = get_object_or_404(eventsandcamps, pk=camp_id)
            file_field = getattr(camp, file_type, None)

            if file_field and file_field.name:
                 file_path = file_field.path; file_name = file_field.name
                 setattr(camp, file_type, None)
                 camp.save(update_fields=[file_type])
                 try:
                     if default_storage.exists(file_path): default_storage.delete(file_path)
                     logger.info(f"File '{file_name}' deleted for camp {camp_id}, type {file_type}")
                     return JsonResponse({'message': 'File deleted.'}, status=200)
                 except Exception as e:
                     logger.error(f"Error deleting file from storage camp {camp_id}, type {file_type}: {e}")
                     return JsonResponse({'message': 'File reference removed, error deleting storage.', 'error_detail': str(e)}, status=500)
            else:
                 return JsonResponse({'message': 'No file to delete.'}, status=200)
        except Http404: return JsonResponse({'error': 'Camp not found'}, status=404)
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.exception(f"delete_file failed for camp {camp_id_str or 'Unknown'}.")
            return JsonResponse({'error': "Server error.", 'detail': str(e)}, status=500)
    return JsonResponse({"error": "Invalid method."}, status=405)

def get_categories(request):
    # No change needed
    if request.method == 'GET':
        try:
            categories = list(ReviewCategory.objects.values("id", "name"))
            return JsonResponse({"categories": categories}, safe=False)
        except Exception as e:
            logger.exception("get_categories failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)

def get_reviews(request, status):
    # No change needed (uses status and Review model fields)
    if request.method == 'GET':
        try:
            # Assuming Review model has fields id, pid, name, gender, appointment_date, category (FK)
            # Validate status if needed
            reviews = list(Review.objects.filter(status=status).select_related('category')
                           .values("id", "pid", "name", "gender", "appointment_date", "category__name"))

            # Format dates
            for review in reviews:
                if isinstance(review.get('appointment_date'), date):
                    review['appointment_date'] = review['appointment_date'].isoformat()

            return JsonResponse({"reviews": reviews}, safe=False)
        except Exception as e:
            logger.exception(f"get_reviews failed for status '{status}': An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)

@csrf_exempt
def add_review(request):
    # No change needed (uses Review model fields)
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validation (ensure required fields are present)
            required = ['category', 'pid', 'name', 'gender', 'appointment_date', 'status']
            if not all(field in data for field in required):
                return JsonResponse({"error": "Missing required fields for review."}, status=400)

            # Get or create category
            category, _ = ReviewCategory.objects.get_or_create(name=data["category"])

            appointment_date_obj = parse_date_internal(data["appointment_date"])
            if not appointment_date_obj:
                 return JsonResponse({"error": "Invalid appointment_date format. Use YYYY-MM-DD."}, status=400)

            review = Review.objects.create(
                category=category,
                pid=data["pid"],
                name=data["name"],
                gender=data["gender"],
                appointment_date=appointment_date_obj,
                status=data["status"]
            )
            logger.info(f"Review saved successfully with ID: {review.id}")
            return JsonResponse({"message": "Review added successfully", "id": review.id}, status=201)
        except json.JSONDecodeError:
            logger.error("add_review failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_review failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    logger.warning("add_review failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)


# --- Dashboard Stats / General Fetch (Unaffected by primary key change) ---
# dashboard_stats, fetchVisitdataAll, fetchFitnessData seem unaffected as they
# fetch aggregate or all data, not based on a single emp_no/aadhar key.

@csrf_exempt
def dashboard_stats(request):
    # No change needed based on aadhar requirement
    if request.method == 'GET': # Should be GET
        try:
            from_date_str = request.GET.get("fromDate")
            to_date_str = request.GET.get("toDate")
            visit_type_filter = request.GET.get("visitType") # e.g., Preventive, Curative
            entity_filter = request.GET.get("entityType") # e.g., Employee, Contractor, Visitor, Total Footfalls

            today = date.today()
            # Use helper for safe date parsing
            from_date_obj = parse_date_internal(from_date_str) if from_date_str else today
            to_date_obj = parse_date_internal(to_date_str) if to_date_str else today

            if not from_date_obj or not to_date_obj:
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            # Ensure from_date is not after to_date
            if from_date_obj > to_date_obj:
                 from_date_obj, to_date_obj = to_date_obj, from_date_obj # Swap if needed

            # Base queryset for the date range
            queryset = Dashboard.objects.filter(date__range=[from_date_obj, to_date_obj])

            # Apply visit type filter
            if visit_type_filter in ["Preventive", "Curative"]:
                queryset = queryset.filter(type_of_visit=visit_type_filter)

            # Apply entity type filter
            entity_mapping = { # Map filter value to model 'type' field value
                "Employee": "Employee",
                "Contractor": "Contractor",
                "Visitor": "Visitor",
            }
            if entity_filter in entity_mapping:
                 queryset = queryset.filter(type=entity_mapping[entity_filter])
            # If entity_filter is "Total Footfalls" or invalid, we don't filter by type

            # Calculate counts
            type_counts = queryset.values("type").annotate(count=Count("id")).order_by("-count")
            type_of_visit_counts = queryset.values("type_of_visit").annotate(count=Count("id")).order_by("-count")
            register_counts = queryset.values("register").annotate(count=Count("id")).order_by("-count")
            purpose_counts = queryset.values("purpose").annotate(count=Count("id")).order_by("-count")

            # Prepare response data
            data = {
                "type_counts": list(type_counts),
                "type_of_visit_counts": list(type_of_visit_counts),
                "register_counts": list(register_counts),
                "purpose_counts": list(purpose_counts),
                # Add total count if needed
                "total_count": queryset.count()
            }

            return JsonResponse(data, safe=False)

        except Exception as e:
            logger.exception("Error in dashboard_stats view: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)

@csrf_exempt # Should be GET
def fetchVisitdataAll(request):
    """Fetches all visit data (Dashboard records)."""
    if request.method == "POST" or request.method == "GET": # Allow GET
        try:
            # Fetch all dashboard entries, order by date descending
            all_visits = list(Dashboard.objects.all().order_by('-date', '-id').values())

            # Format dates
            for visit in all_visits:
                 if isinstance(visit.get('date'), date):
                     visit['date'] = visit['date'].isoformat()

            logger.info(f"Fetched all {len(all_visits)} visit records.")
            return JsonResponse({"message": "All visit data fetched successfully", "data": all_visits}, status=200)
        except Exception as e:
            logger.exception("fetchVisitdataAll failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning("fetchVisitdataAll failed: Invalid request method.")
        return JsonResponse({"error": "Invalid request method (use GET or POST)."}, status=405)

@csrf_exempt # Should be GET
def fetchFitnessData(request):
    """Fetches all fitness assessment data."""
    if request.method == "POST" or request.method == "GET": # Allow GET
        try:
            # Fetch all fitness records, order by date descending
            all_fitness = list(FitnessAssessment.objects.all().order_by('-entry_date', '-id').values())

             # Format dates and JSON fields
            for record in all_fitness:
                if isinstance(record.get('entry_date'), date):
                    record['entry_date'] = record['entry_date'].isoformat()
                if isinstance(record.get('validity'), date):
                     record['validity'] = record['validity'].isoformat()
                # JSON fields are likely already handled correctly by Django ORM -> JSON conversion

            logger.info(f"Fetched all {len(all_fitness)} fitness records.")
            return JsonResponse({"message": "All fitness data fetched successfully", "data": all_fitness}, status=200)
        except Exception as e:
            logger.exception("fetchFitnessData failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning("fetchFitnessData failed: Invalid request method.")
        return JsonResponse({"error": "Invalid request method (use GET or POST)."}, status=405)


def get_media_url_prefix(request):
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    if media_url.startswith('http'): return media_url
    else: return f"{request.scheme}://{request.get_host()}{media_url}"

ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt', 'mp4', 'mov', 'avi']


# --- Pharmacy / Inventory / Calibration ---

@csrf_exempt
def add_stock(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.debug(f"Received Stock Data: {data}")

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            quantity_str = data.get("quantity")
            expiry_date_str = data.get("expiry_date") # Expect YYYY-MM format

            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity_str, expiry_date_str]):
                return JsonResponse({"error": "All fields (medicine_form, brand_name, chemical_name, dose_volume, quantity, expiry_date) are required"}, status=400)

            try:
                quantity = int(quantity_str)
                if quantity <= 0:
                    return JsonResponse({"error": "Quantity must be a positive number."}, status=400)
            except ValueError:
                return JsonResponse({"error": "Invalid quantity format. Must be a number."}, status=400)

            try:
                # Parse YYYY-MM, default to the 1st of the month for storage
                expiry_date_obj = datetime.strptime(expiry_date_str, "%Y-%m").date().replace(day=1)
            except ValueError:
                return JsonResponse({"error": "Invalid expiry date format. Use YYYY-MM."}, status=400)

            entry_date = date.today()

            with transaction.atomic():
                # Ensure the medicine definition exists in PharmacyMedicine
                medicine_entry, created = PharmacyMedicine.objects.get_or_create(
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    medicine_form=medicine_form,
                    dose_volume=dose_volume,
                    defaults={'entry_date': entry_date} # Set entry_date only if created
                )
                if created:
                    logger.info(f"New definition added to PharmacyMedicine: {brand_name} - {chemical_name} - {dose_volume}")

                # Add or update PharmacyStock
                # Find existing stock for this specific batch (same medicine, same expiry)
                stock_entry, stock_created = PharmacyStock.objects.get_or_create(
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    expiry_date=expiry_date_obj,
                    defaults={
                        'entry_date': entry_date,
                        'quantity': quantity,
                        'total_quantity': quantity, # Initial total quantity
                    }
                )

                # If the stock entry already existed, update the quantity
                if not stock_created:
                    stock_entry.quantity += quantity
                    stock_entry.total_quantity += quantity # Increment total added quantity as well
                    stock_entry.entry_date = entry_date # Update entry date to reflect last addition
                    stock_entry.save()
                    logger.info(f"Updated stock for {brand_name} (Expiry: {expiry_date_obj}): Added {quantity}, New Qty: {stock_entry.quantity}")
                else:
                     logger.info(f"New stock entry added for {brand_name} (Expiry: {expiry_date_obj}): Qty: {quantity}")


            return JsonResponse({"message": "Stock added successfully"}, status=201)

        except json.JSONDecodeError:
            logger.error("add_stock failed: Invalid JSON.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.exception("add_stock failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

@csrf_exempt # Should be GET
def get_brand_names(request):
    if request.method == 'GET':
        try:
            chemical_name = request.GET.get("chemical_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip()

            if not chemical_name or not medicine_form:
                return JsonResponse({"suggestions": []})

            suggestions = (
                PharmacyMedicine.objects.filter(
                    chemical_name__iexact=chemical_name,
                    medicine_form__iexact=medicine_form
                )
                .values_list("brand_name", flat=True)
                .distinct()
                .order_by("brand_name")
            )

            logger.debug(f"Brand suggestions for {chemical_name}, {medicine_form}: {list(suggestions)}")
            return JsonResponse({"suggestions": list(suggestions)})

        except Exception as e:
            logger.exception("get_brand_names failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt # Should be GET
def get_dose_volume(request):
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            chemical_name = request.GET.get("chemical_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip()

            if not brand_name or not chemical_name or not medicine_form:
                return JsonResponse({"suggestions": []})

            dose_suggestions = list(
                PharmacyMedicine.objects.filter(
                    brand_name__iexact=brand_name,
                    chemical_name__iexact=chemical_name,
                    medicine_form__iexact=medicine_form
                )
                .values_list("dose_volume", flat=True)
                .distinct()
                .order_by("dose_volume")
            )

            logger.debug(f"Dose Volumes for {brand_name}, {chemical_name}, {medicine_form}: {dose_suggestions}")
            return JsonResponse({"suggestions": dose_suggestions})

        except Exception as e:
            logger.exception("get_dose_volume failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt # Should be GET
def get_chemical_name_by_brand(request):
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip()

            if not brand_name or not medicine_form:
                return JsonResponse({"suggestions": []})

            suggestions = (
                PharmacyMedicine.objects.filter(
                    brand_name__iexact=brand_name,
                    medicine_form__iexact=medicine_form
                )
                .values_list("chemical_name", flat=True)
                .distinct()
                .order_by("chemical_name")
            )

            logger.debug(f"Chemical names for {brand_name}, {medicine_form}: {list(suggestions)}")
            return JsonResponse({"suggestions": list(suggestions)})

        except Exception as e:
            logger.exception("get_chemical_name_by_brand failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt # Should be GET
def get_chemical_name(request):
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            if not brand_name:
                return JsonResponse({"chemical_name": None})

            # WARNING: This might return an incorrect chemical name if multiple forms/doses exist
            chemical_name = (
                PharmacyMedicine.objects.filter(brand_name__iexact=brand_name)
                .values_list("chemical_name", flat=True)
                .first()
            )

            logger.debug(f"Chemical name found for brand {brand_name}: {chemical_name}")
            return JsonResponse({"chemical_name": chemical_name if chemical_name else None})

        except Exception as e:
            logger.exception("get_chemical_name failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

#currentstock views code this will be already present in views


@csrf_exempt
def get_current_stock(request):
    """
    Fetch current stock grouped by Medicine Form, Brand Name, Chemical Name, Dose/Volume, and Expiry Date.
    Combine quantities for duplicate entries.
    """
    try:
        stock_data = (
            PharmacyStock.objects
            .values("entry_date", "medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
            .annotate(
                total_quantity_sum=Sum("total_quantity"),
                quantity_sum=Sum("quantity")
            )
            .order_by("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
        )

        data = [
            {
                "entry_date" : entry["entry_date"],
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "total_quantity": entry["total_quantity_sum"],
                "quantity_expiry": entry["quantity_sum"],
                "expiry_date": entry["expiry_date"].strftime("%b-%y"),  # e.g., 'Jul-25'
            }
            for entry in stock_data
        ]

        return JsonResponse({"stock": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt # Should be GET
def get_current_expiry(request):
    """
    Identifies near-expiry/expired stock, moves it to ExpiryRegister if not already moved,
    and returns items currently in ExpiryRegister that haven't been marked as removed.
    """
    if request.method == 'GET':
        try:
            today = date.today()
            # Define the threshold for "near expiry" (e.g., end of next month)
            current_year = today.year
            next_month = today.month + 1
            next_year = current_year
            if next_month > 12:
                next_month = 1
                next_year += 1
            first_day_month_after_next = date(next_year, next_month, 1) + timedelta(days=32)
            expiry_threshold_date = first_day_month_after_next.replace(day=1) - timedelta(days=1)

            logger.info(f"Checking for stock expiring on or before: {expiry_threshold_date}")

            with transaction.atomic():
                expiring_soon_stock = PharmacyStock.objects.filter(
                    expiry_date__lte=expiry_threshold_date
                )

                items_moved = 0
                for item in expiring_soon_stock:
                    expiry_reg_entry, created = ExpiryRegister.objects.get_or_create(
                        medicine_form=item.medicine_form,
                        brand_name=item.brand_name,
                        chemical_name=item.chemical_name,
                        dose_volume=item.dose_volume,
                        expiry_date=item.expiry_date,
                        defaults={'quantity': item.quantity}
                    )
                    if created:
                         logger.info(f"Moved to ExpiryRegister: {item.brand_name} (Expiry: {item.expiry_date}), Qty: {item.quantity}")
                         items_moved += 1
                    item.delete()

            pending_removal_expiry = ExpiryRegister.objects.filter(
                removed_date__isnull=True
            ).order_by("expiry_date", "brand_name")

            data = []
            for entry in pending_removal_expiry:
                 data.append({
                     "id": entry.id,
                     "medicine_form": entry.medicine_form,
                     "brand_name": entry.brand_name,
                     "chemical_name": entry.chemical_name,
                     "dose_volume": entry.dose_volume,
                     "quantity": entry.quantity,
                     "expiry_date": entry.expiry_date.strftime("%b-%y") if entry.expiry_date else None,
                     "expiry_date_iso": entry.expiry_date.isoformat() if entry.expiry_date else None,
                 })

            return JsonResponse({"expiry_stock": data, "items_moved_count": items_moved}, safe=False)

        except Exception as e:
            logger.exception("get_current_expiry failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt # Should be POST or PUT/PATCH
def remove_expired_medicine(request):
    """ Marks an item in the ExpiryRegister as removed by setting the removed_date. """
    if request.method == "POST":
        medicine_id = None # Initialize for logging
        try:
            data = json.loads(request.body)
            medicine_id = data.get("id")

            if not medicine_id:
                return JsonResponse({"error": "Medicine ID (id) is required.", "success": False}, status=400)

            try: medicine_id = int(medicine_id)
            except ValueError: return JsonResponse({"error": "Invalid Medicine ID format.", "success": False}, status=400)

            medicine_to_remove = get_object_or_404(ExpiryRegister, id=medicine_id)

            if medicine_to_remove.removed_date is not None:
                logger.warning(f"Attempted to remove already removed medicine (ExpiryRegister ID: {medicine_id})")
                return JsonResponse({"error": "Medicine already marked as removed", "success": False}, status=400)

            medicine_to_remove.removed_date = timezone.now()
            medicine_to_remove.save(update_fields=['removed_date'])

            logger.info(f"Marked expired medicine as removed (ExpiryRegister ID: {medicine_id})")
            return JsonResponse({"message": "Medicine marked as removed successfully", "success": True})

        except Http404:
            return JsonResponse({"error": "Expired medicine entry not found", "success": False}, status=404)
        except json.JSONDecodeError:
            logger.error("remove_expired_medicine failed: Invalid JSON.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON format", "success": False}, status=400)
        except Exception as e:
            logger.exception(f"remove_expired_medicine failed for ID {medicine_id or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

 # Should be GET
@csrf_exempt
def get_expiry_register(request):
    try:
        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")

        queryset = ExpiryRegister.objects.filter(removed_date__isnull=False)

        if from_date:
            queryset = queryset.filter(removed_date__gte=from_date)
        if to_date:
            queryset = queryset.filter(removed_date__lte=to_date)

        expired_medicines = queryset.values(
            "id", "medicine_form", "brand_name", "chemical_name", "dose_volume", "quantity", "expiry_date", "removed_date"
        )

        data = [
            {
                "id": entry["id"],
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": entry["expiry_date"].strftime("%m-%Y") if entry["expiry_date"] else "",
                "removed_date": entry["removed_date"].strftime("%m-%Y") if entry["removed_date"] else "",
            }
            for entry in expired_medicines
        ]

        return JsonResponse({"expiry_register": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def get_discarded_medicines(request):
    """
    Fetch discarded/damaged medicines with optional date filtering.
    """
    try:
        discarded_medicines = DiscardedMedicine.objects.all()

        # Get 'from_date' and 'to_date' from query parameters
        from_date_str = request.GET.get('from_date')
        to_date_str = request.GET.get('to_date')

        # Parse dates if provided
        if from_date_str:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
            discarded_medicines = discarded_medicines.filter(entry_date__gte=from_date)

        if to_date_str:
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
            discarded_medicines = discarded_medicines.filter(entry_date__lte=to_date)

        # Serialize data
        data = [
            {
                "id": entry.id,
                "medicine_form": entry.medicine_form,
                "brand_name": entry.brand_name,
                "chemical_name": entry.chemical_name,
                "dose_volume": entry.dose_volume,
                "quantity": entry.quantity,
                "expiry_date": entry.expiry_date.strftime("%b-%y"),
                "reason": entry.reason,
                "entry_date": entry.entry_date.strftime("%d-%b-%Y"),
            }
            for entry in discarded_medicines
        ]

        return JsonResponse({"discarded_medicines": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_discarded_medicine(request):
    """ Records a discarded/damaged medicine entry and updates (decrements) PharmacyStock. """
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date")
            quantity_str = data.get("quantity")
            reason = data.get("reason")

            required = [medicine_form, brand_name, chemical_name, dose_volume, expiry_date_str, quantity_str, reason]
            if not all(required):
                return JsonResponse({"error": "Missing required fields.", "success": False}, status=400)

            try: quantity_to_discard = int(quantity_str); assert quantity_to_discard > 0
            except (ValueError, AssertionError): return JsonResponse({"error": "Invalid quantity.", "success": False}, status=400)

            expiry_date_obj = parse_date_internal(expiry_date_str) # Assumes YYYY-MM-DD
            if not expiry_date_obj: return JsonResponse({"error": "Invalid expiry date format. Use YYYY-MM-DD.", "success": False}, status=400)


            with transaction.atomic():
                stock_item = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, expiry_date=expiry_date_obj
                ).first()

                if not stock_item: return JsonResponse({"error": "Matching stock not found.", "success": False}, status=404)
                if stock_item.quantity < quantity_to_discard:
                    return JsonResponse({"error": f"Not enough stock. Available: {stock_item.quantity}.", "success": False}, status=400)

                stock_item.quantity -= quantity_to_discard
                if stock_item.quantity <= 0: stock_item.delete()
                else: stock_item.save()

                DiscardedMedicine.objects.create(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, quantity=quantity_to_discard, expiry_date=expiry_date_obj,
                    reason=reason, discarded_date=timezone.now()
                )

            logger.info(f"Discarded {quantity_to_discard} of {brand_name} (Expiry: {expiry_date_obj}). Reason: {reason}")
            return JsonResponse({"message": "Discarded medicine recorded successfully", "success": True})

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON.", "success": False}, status=400)
        except Exception as e:
            logger.exception("add_discarded_medicine failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)

@csrf_exempt
def get_ward_consumables(request):
    try:
        ward_consumables_qs = WardConsumables.objects.all()

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")

        if from_date:
            ward_consumables_qs = ward_consumables_qs.filter(consumed_date__gte=from_date)
        if to_date:
            ward_consumables_qs = ward_consumables_qs.filter(consumed_date__lte=to_date)

        ward_consumables_qs = ward_consumables_qs.order_by("-entry_date").values(
            "id", "entry_date", "medicine_form", "brand_name", "chemical_name",
            "dose_volume", "quantity", "expiry_date", "consumed_date"
        )

        data = []
        for entry in ward_consumables_qs:
            expiry_date_str = entry["expiry_date"].strftime("%b-%y") if entry.get("expiry_date") else None
            consumed_date_str = entry["consumed_date"].strftime("%Y-%m-%d") if entry.get("consumed_date") else None
            entry_date_str = entry["entry_date"].strftime("%Y-%m-%d %H:%M:%S") if entry.get("entry_date") else None

            data.append({
                "id": entry["id"],
                "entry_date": entry_date_str,
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": expiry_date_str,
                "consumed_date": consumed_date_str,
            })

        return JsonResponse({"ward_consumables": data}, safe=False)

    except Exception as e:
        print(f"Error in get_ward_consumables: {e}")
        return JsonResponse({
            "error": "An internal server error occurred while fetching consumables.",
            "detail": str(e)
        }, status=500)
@csrf_exempt
def add_ward_consumable(request):
    """ Records a ward consumable usage and updates (decrements) PharmacyStock. """
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date")
            consumed_date_str = data.get("consumed_date")
            quantity_str = data.get("quantity")

            required = [medicine_form, brand_name, chemical_name, dose_volume, expiry_date_str, consumed_date_str, quantity_str]
            if not all(required): return JsonResponse({"error": "Missing required fields.", "success": False}, status=400)

            try: quantity_to_consume = int(quantity_str); assert quantity_to_consume > 0
            except (ValueError, AssertionError): return JsonResponse({"error": "Invalid quantity.", "success": False}, status=400)

            expiry_date_obj = parse_date_internal(expiry_date_str)
            if not expiry_date_obj: return JsonResponse({"error": "Invalid expiry date format. Use YYYY-MM-DD.", "success": False}, status=400)

            consumed_date_obj = parse_date_internal(consumed_date_str)
            if not consumed_date_obj: return JsonResponse({"error": "Invalid consumed date format. Use YYYY-MM-DD.", "success": False}, status=400)


            with transaction.atomic():
                stock_item = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, expiry_date=expiry_date_obj
                ).first()

                if not stock_item: return JsonResponse({"error": "Matching stock not found.", "success": False}, status=404)
                if stock_item.quantity < quantity_to_consume:
                    return JsonResponse({"error": f"Not enough stock. Available: {stock_item.quantity}.", "success": False}, status=400)

                stock_item.quantity -= quantity_to_consume
                if stock_item.quantity <= 0: stock_item.delete()
                else: stock_item.save()

                WardConsumables.objects.create(
                    entry_date=timezone.now(), medicine_form=medicine_form, brand_name=brand_name,
                    chemical_name=chemical_name, dose_volume=dose_volume, quantity=quantity_to_consume,
                    expiry_date=expiry_date_obj, consumed_date=consumed_date_obj,
                )

            logger.info(f"Consumed {quantity_to_consume} of {brand_name} (Expiry: {expiry_date_obj}) on {consumed_date_obj}.")
            return JsonResponse({"message": "Ward consumable recorded successfully", "success": True})

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON.", "success": False}, status=400)
        except Exception as e:
            logger.exception("add_ward_consumable failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)

#other views functions altered they may be already present check for presence and replace them


from dateutil.relativedelta import relativedelta

def get_next_due_date(calibration_date_str, freq):
    calibration_date = datetime.strptime(calibration_date_str, "%Y-%m-%d")
    freq = freq.lower()

    if freq == "yearly":
        return calibration_date + relativedelta(years=1)
    elif freq == "halfyearly":
        return calibration_date + relativedelta(months=6)
    elif freq == "quartearly":
        return calibration_date + relativedelta(months=3)
    elif freq == "monthly":
        return calibration_date + relativedelta(months=1)
    return None



from dateutil.relativedelta import relativedelta

def get_next_due_date(calibration_date_str, freq):
    calibration_date = datetime.strptime(calibration_date_str, "%Y-%m-%d")
    freq = freq.lower()

    if freq == "yearly":
        return calibration_date + relativedelta(years=1)
    elif freq == "halfyearly":
        return calibration_date + relativedelta(months=6)
    elif freq == "quartearly":
        return calibration_date + relativedelta(months=3)
    elif freq == "monthly":
        return calibration_date + relativedelta(months=1)
    return None



@csrf_exempt
def get_pending_calibrations(request):
    try:
        # Get only instruments that are pending
        pending = InstrumentCalibration.objects.filter(calibration_status=False).order_by("-next_due_date")

        # Map to response
        data = [
            {
                "id": i.id,
                "equipment_sl_no": i.equipment_sl_no,
                "instrument_name": i.instrument_name,
                "numbers": i.numbers,
                "certificate_number": i.certificate_number,
                "make": i.make,
                "model_number": i.model_number,
                "freq": i.freq,
                "calibration_date": i.calibration_date.strftime("%d-%m-%Y") if i.calibration_date else None,
                "next_due_date": i.next_due_date.strftime("%d-%m-%Y") if i.next_due_date else None,
                "calibration_status": i.calibration_status,
            }
            for i in pending
        ]
        
        return JsonResponse({"pending_calibrations": data})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    



@csrf_exempt
def get_calibration_history(request):
    try:
        from_date_str = request.GET.get("from")
        to_date_str = request.GET.get("to")

        calibrated_instruments = InstrumentCalibration.objects.filter(calibration_status=True)

        if from_date_str:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
        else:
            from_date = None

        if to_date_str:
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
        else:
            to_date = None

        if from_date and to_date:
            calibrated_instruments = calibrated_instruments.filter(calibration_date__range=(from_date, to_date))
        elif from_date:
            calibrated_instruments = calibrated_instruments.filter(calibration_date__gte=from_date)
        elif to_date:
            calibrated_instruments = calibrated_instruments.filter(calibration_date__lte=to_date)

        calibrated_instruments = calibrated_instruments.order_by("-calibration_date")

        data = [
            {
                "equipment_sl_no": entry.equipment_sl_no,
                "instrument_name": entry.instrument_name,
                "numbers": entry.numbers,
                "certificate_number": entry.certificate_number,
                "make": entry.make,
                "model_number": entry.model_number,
                "freq": entry.freq,
                "calibration_date": entry.calibration_date.strftime("%Y-%m-%d") if entry.calibration_date else "",
                "next_due_date": entry.next_due_date.strftime("%Y-%m-%d") if entry.next_due_date else "",
                "calibration_status": entry.calibration_status,
            }
            for entry in calibrated_instruments
        ]

        return JsonResponse({"calibration_history": data})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def complete_calibration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            instrument_id = data.get("id")
            freq = data.get("freq")
            next_due = get_next_due_date(str(today), freq)
            next_due_date=next_due

            if not (instrument_id and freq and next_due_date):
                return JsonResponse({"error": "Missing fields"}, status=400)

            today = datetime.today().date()
            next_due_date = datetime.strptime(next_due_date, "%Y-%m-%d").date()

            # Get the instrument's base record
            old_record = InstrumentCalibration.objects.get(id=instrument_id)

            # ✅ Update all old pending records for this instrument to completed
            InstrumentCalibration.objects.filter(
                equipment_sl_no=old_record.equipment_sl_no,
                calibration_status=False
            ).update(calibration_status=True)

            # ✅ Create a new pending record
            InstrumentCalibration.objects.create(
                equipment_sl_no=old_record.equipment_sl_no,
                instrument_name=old_record.instrument_name,
                numbers=old_record.numbers,
                certificate_number=old_record.certificate_number,
                make=old_record.make,
                model_number=old_record.model_number,
                freq=freq,
                calibration_date=today,
                next_due_date=next_due_date,
                calibration_status=False,
            )

            return JsonResponse({"message": "Calibration recorded successfully"})

        except InstrumentCalibration.DoesNotExist:
            return JsonResponse({"error": "Instrument not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    


@csrf_exempt
def add_instrument(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "Invalid method"}, status=405)

        if not request.body:
            return JsonResponse({"error": "Empty request body"}, status=400)

        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        # Ensure all required fields are present
        required_fields = [
            "equipment_sl_no", 
            "instrument_name", 
            "numbers", 
            "calibration_date", 
            "next_due_date", 
            "calibration_status"
        ]
        if any(field not in data or not data[field] for field in required_fields):
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        next_due_date = get_next_due_date(data["calibration_date"], data["freq"])

        # Create the new instrument record
        InstrumentCalibration.objects.create(
            equipment_sl_no=data["equipment_sl_no"],
            instrument_name=data["instrument_name"],
            numbers=data["numbers"],
            certificate_number=data.get("certificate_number"),
            make=data.get("make"),
            model_number=data.get("model_number"),
            freq=data.get("freq"),
            calibration_date=data["calibration_date"],
            next_due_date=next_due_date.strftime("%Y-%m-%d"),
            calibration_status=bool(int(data["calibration_status"]))
        )

        return JsonResponse({"message": "Instrument added successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)  
    

# For instrument calibration next month count
@csrf_exempt
def get_pending_next_month_count(request):
    try:
        today = datetime.today().date()
        one_month_later = today + relativedelta(months=1)

        # Count instruments that are either overdue or due within the next month
        count = InstrumentCalibration.objects.filter(
            calibration_status=False
        ).filter(
            Q(next_due_date__lte=one_month_later)  # Includes past and upcoming due dates
        ).count()

        return JsonResponse({"count": count})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def archive_zero_quantity_stock(request):
    """
    Move zero-quantity PharmacyStock entries to PharmacyStockHistory safely.
    Preserves entry date and adds archive date.
    """
    if request.method == "POST":
        try:
            with transaction.atomic():
                zero_stocks = (
                    PharmacyStock.objects
                    .select_for_update(skip_locked=True)
                    .filter(quantity=0)
                )

                if not zero_stocks.exists():
                    return JsonResponse({"message": "No zero quantity stock found.", "success": True})

                for item in zero_stocks:
                    PharmacyStockHistory.objects.create(
                        entry_date=item.entry_date,  # Keep original entry date
                        medicine_form=item.medicine_form,
                        brand_name=item.brand_name,
                        chemical_name=item.chemical_name,
                        dose_volume=item.dose_volume,
                        total_quantity=item.total_quantity,
                        expiry_date=item.expiry_date,
                        # archive_date will auto-set on creation
                    )
                    item.delete()

            return JsonResponse({"message": "Zero quantity stock archived successfully.", "success": True})

        except Exception as e:
            return JsonResponse({"error": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Only POST method is allowed.", "success": False}, status=405)
    """ Moves zero-quantity PharmacyStock entries to PharmacyStockHistory. """
    if request.method == "POST":
        archived_count = 0
        try:
            with transaction.atomic():
                zero_stocks = ( PharmacyStock.objects.select_for_update().filter(quantity__lte=0) )
                if not zero_stocks.exists():
                    return JsonResponse({"message": "No zero quantity stock found.", "success": True})

                for item in zero_stocks:
                    # Simple check to avoid duplicates in history based on key fields
                    # Adjust fields if needed for uniqueness
                    if not PharmacyStockHistory.objects.filter(
                         medicine_form=item.medicine_form, brand_name=item.brand_name,
                         chemical_name=item.chemical_name, dose_volume=item.dose_volume,
                         expiry_date=item.expiry_date, total_quantity=item.total_quantity
                    ).exists():
                        PharmacyStockHistory.objects.create(
                            entry_date=item.entry_date, medicine_form=item.medicine_form,
                            brand_name=item.brand_name, chemical_name=item.chemical_name,
                            dose_volume=item.dose_volume, total_quantity=item.total_quantity,
                            expiry_date=item.expiry_date, archived_date=timezone.now()
                        )
                        archived_count += 1
                    item.delete() # Delete from active stock

            logger.info(f"{archived_count} zero quantity stock items archived.")
            return JsonResponse({"message": f"{archived_count} items archived.", "success": True})

        except Exception as e:
            logger.exception("archive_zero_quantity_stock failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)

# --- Reviews / Camps / File Handling ---

def get_categories(request):
    if request.method == 'GET':
        try:
            categories = list(ReviewCategory.objects.values("id", "name").order_by("name"))
            return JsonResponse({"categories": categories}, safe=False)
        except Exception as e:
            logger.exception("get_categories failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)

def get_reviews(request, status):
    if request.method == 'GET':
        try:
            reviews = list(Review.objects.filter(status=status).select_related('category')
                           .order_by('-appointment_date')
                           .values("id", "pid", "name", "gender", "appointment_date", "category__name"))
            for review in reviews:
                if isinstance(review.get('appointment_date'), date):
                    review['appointment_date'] = review['appointment_date'].isoformat()
            return JsonResponse({"reviews": reviews}, safe=False)
        except Exception as e:
            logger.exception(f"get_reviews failed for status '{status}'.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)

@csrf_exempt
def add_review(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            required = ['category', 'pid', 'name', 'gender', 'appointment_date', 'status']
            missing = [f for f in required if not data.get(f)]
            if missing: return JsonResponse({"error": f"Missing fields: {', '.join(missing)}"}, status=400)

            category, _ = ReviewCategory.objects.get_or_create(name=data["category"])
            appointment_date_obj = parse_date_internal(data["appointment_date"])
            if not appointment_date_obj: return JsonResponse({"error": "Invalid date format."}, status=400)

            review = Review.objects.create(
                category=category, pid=data["pid"], name=data["name"], gender=data["gender"],
                appointment_date=appointment_date_obj, status=data["status"]
            )
            logger.info(f"Review saved ID: {review.id}")
            return JsonResponse({"message": "Review added.", "id": review.id}, status=201)
        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            logger.exception("add_review failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method. Use POST."}, status=405)



# --- Aggregate/All Data Fetching ---
@csrf_exempt # Should be GET
def dashboard_stats(request):
    if request.method == 'GET':
        try:
            from_date_str = request.GET.get("fromDate"); to_date_str = request.GET.get("toDate")
            visit_type = request.GET.get("visitType"); entity_type = request.GET.get("entityType")
            today = date.today()
            from_dt = parse_date_internal(from_date_str) or today
            to_dt = parse_date_internal(to_date_str) or today
            if from_dt > to_dt: from_dt, to_dt = to_dt, from_dt

            qs = Dashboard.objects.filter(date__range=[from_dt, to_dt])
            if visit_type in ["Preventive", "Curative"]: qs = qs.filter(type_of_visit=visit_type)
            entity_map = {"Employee": "Employee", "Contractor": "Contractor", "Visitor": "Visitor"}
            if entity_type in entity_map: qs = qs.filter(type=entity_map[entity_type])

            data = {
                "type_counts": list(qs.values("type").annotate(count=Count("id")).order_by("-count")),
                "type_of_visit_counts": list(qs.values("type_of_visit").annotate(count=Count("id")).order_by("-count")),
                "register_counts": list(qs.values("register").annotate(count=Count("id")).order_by("-count")),
                "purpose_counts": list(qs.values("purpose").annotate(count=Count("id")).order_by("-count")),
                "total_count": qs.count()
            }
            return JsonResponse(data, safe=False)
        except Exception as e:
            logger.exception("dashboard_stats failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)

@csrf_exempt # Should be GET
def fetchVisitdataAll(request):
    if request.method == "POST" or request.method == "GET":
        try:
            from django.forms.models import model_to_dict
            visits_qs = Dashboard.objects.all().order_by('-date', '-id')
            visits = []
            for v in visits_qs:
                 v_data = model_to_dict(v); v_data['date'] = v.date.isoformat() if v.date else None
                 visits.append(v_data)
            return JsonResponse({"message": "All visits fetched.", "data": visits}, status=200)
        except Exception as e:
            logger.exception("fetchVisitdataAll failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method."}, status=405)

@csrf_exempt # Should be GET
def fetchFitnessData(request):
    if request.method == "POST" or request.method == "GET":
        try:
            from django.forms.models import model_to_dict
            fitness_qs = FitnessAssessment.objects.all().order_by('-entry_date', '-id')
            fitness_data = []
            for r in fitness_qs:
                 r_data = model_to_dict(r)
                 r_data['entry_date'] = r.entry_date.isoformat() if r.entry_date else None
                 r_data['validity'] = r.validity.isoformat() if r.validity else None
                 fitness_data.append(r_data)
            return JsonResponse({"message": "All fitness data fetched.", "data": fitness_data}, status=200)
        except Exception as e:
            logger.exception("fetchFitnessData failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method."}, status=405)

@csrf_exempt # Should be GET
def get_notes_all(request):
    if request.method == 'POST' or request.method == 'GET':
        try:
            from django.forms.models import model_to_dict
            notes_qs = SignificantNotes.objects.all().order_by('-entry_date', '-id')
            consultations_qs = Consultation.objects.all().order_by('-entry_date', '-id')

            notes = []
            for n in notes_qs:
                 n_data = model_to_dict(n); n_data['entry_date'] = n.entry_date.isoformat() if n.entry_date else None
                 notes.append(n_data)
            consultations = []
            for c in consultations_qs:
                 c_data = model_to_dict(c); c_data['entry_date'] = c.entry_date.isoformat() if c.entry_date else None
                 c_data['follow_up_date'] = c.follow_up_date.isoformat() if c.follow_up_date else None
                 consultations.append(c_data)

            return JsonResponse({'notes': notes, 'consultation': consultations})
        except Exception as e:
            logger.exception("get_notes_all failed.")
            return JsonResponse({'error': "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method.'}, status=405)

@csrf_exempt # Should be GET
def view_prescriptions(request):
    if request.method == 'GET':
        try:
            from django.forms.models import model_to_dict
            prescriptions_qs = Prescription.objects.all().order_by('-entry_date', '-id')
            data = []
            for p in prescriptions_qs:
                p_data = model_to_dict(p)
                p_data['entry_date'] = p.entry_date.isoformat() if p.entry_date else None
                data.append(p_data)
            return JsonResponse({'prescriptions': data})
        except Exception as e:
            logger.exception("view_prescriptions failed.")
            return JsonResponse({'error': "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)

# --- ID-Based Lookups ---
@csrf_exempt # Should be GET
def view_prescription_by_id(request, prescription_id):
    if request.method == 'GET':
        try:
            from django.forms.models import model_to_dict
            prescription = get_object_or_404(Prescription, pk=prescription_id)
            p_data = model_to_dict(prescription)
            p_data['entry_date'] = prescription.entry_date.isoformat() if prescription.entry_date else None
            return JsonResponse(p_data)
        except Http404: return JsonResponse({'error': 'Prescription not found'}, status=404)
        except Exception as e:
            logger.exception(f"view_prescription_by_id failed for ID {prescription_id}.")
            return JsonResponse({'error': 'Server Error', 'detail': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)

@csrf_exempt # Should be POST or PUT/PATCH
def update_appointment_status(request):
    if request.method == "POST":
        appointment_id = None
        try:
            data = json.loads(request.body); appointment_id = data.get("id"); new_status = data.get("status")
            if not appointment_id: return JsonResponse({"success": False, "message": "ID required."}, status=400)

            appointment = get_object_or_404(Appointment, id=appointment_id)
            current_status = appointment.status

            if new_status is None: # Cycle logic
                if current_status == Appointment.StatusChoices.INITIATE: next_status = Appointment.StatusChoices.IN_PROGRESS
                elif current_status == Appointment.StatusChoices.IN_PROGRESS: next_status = Appointment.StatusChoices.COMPLETED
                else: return JsonResponse({"success": False, "message": "Cannot update further."}, status=400)
                appointment.status = next_status
            else: # Set specific status
                 valid = [c[0] for c in Appointment.StatusChoices.choices]
                 if new_status in valid: appointment.status = new_status
                 else: return JsonResponse({"success": False, "message": "Invalid status."}, status=400)

            appointment.save(update_fields=['status'])
            logger.info(f"Appointment {appointment_id} status updated to {appointment.status}")
            return JsonResponse({"success": True, "message": "Status updated", "status": appointment.status})
        except Http404: return JsonResponse({"success": False, "message": "Appointment not found"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"success": False, "message": "Invalid JSON."}, status=400)
        except Exception as e:
            logger.exception(f"update_appointment_status failed for ID {appointment_id or 'Unknown'}.")
            return JsonResponse({"success": False, "message": "Server error.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method."}, status=405)


def get_current_expiry_count(request):
    """
    Returns the count of medicines in ExpiryRegister where removed_date is NULL.
    """
    try:
        count = ExpiryRegister.objects.filter(removed_date__isnull=True).count()
        return JsonResponse({"count": count})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def normalize_frequency(freq):
    freq = freq.lower().strip()
    mapping = {
        "half-yearly": 6,
        "quarterly": 3,
        "monthly": 1,
        "once in 2 months": 2,
        "once in 2 years": 24,
        "yearly": 12
    }
    return mapping.get(freq, 12)  # default to 12 if unknown


@csrf_exempt
def get_red_status_count(request):
    try:
        today = datetime.today().date()
        red_count = 0
        instruments = InstrumentCalibration.objects.filter(calibration_status=False)
        for instrument in instruments:
            if not instrument.next_due_date or not instrument.freq:
                continue

            due_date = instrument.next_due_date
            total_months = normalize_frequency(instrument.freq)
            diff_in_days = (due_date - today).days
            months_diff = diff_in_days / 30.44
            fraction = months_diff / total_months
            if fraction < 0.33:
                red_count += 1

        print(f"Final RED count: {red_count}")
        return JsonResponse({"count": red_count})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)