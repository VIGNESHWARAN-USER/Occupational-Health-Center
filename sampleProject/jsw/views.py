import bcrypt
import json
import logging
import traceback
import random
import base64
import uuid
import os
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta # Added: For date calculations


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
from django.core.exceptions import ValidationError, ObjectDoesNotExist, FieldError # Added: FieldError
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
# Removed: from matplotlib.offsetbox import TextArea # Unused and out of place

# App specific models
from .models import (
    AmbulanceConsumables, AutoimmuneTest, CTReport, CultureSensitivityTest, Member, Dashboard, FitnessAssessment, OccupationalProfile, OthersTest, Prescription, Appointment,
    DiscardedMedicine, InstrumentCalibration, PharmacyMedicine,
    PharmacyStockHistory, WardConsumables, WomensPack, XRay, mockdrills, # Removed: user (unused)
    ReviewCategory, Review, eventsandcamps, VaccinationRecord,
    PharmacyStock, ExpiryRegister, employee_details, MedicalHistory,
    vitals, heamatalogy, RoutineSugarTests, RenalFunctionTest, LipidProfile,
    LiverFunctionTest, ThyroidFunctionTest, CoagulationTest, EnzymesCardiacProfile,
    UrineRoutineTest, SerologyTest, MotionTest, MensPack, OphthalmicReport,
    USGReport, MRIReport, Consultation, SignificantNotes, Form17, Form38,
    Form39, Form40, Form27, DailyQuantity
)

# Configure logging (ensure this is set up in settings.py ideally)
logger = logging.getLogger(__name__)

# --- Helper Functions ---

def parse_date_internal(date_str):
    """ Safely parse YYYY-MM-DD date strings """
    if not date_str: return None
    try: return datetime.strptime(str(date_str).strip(), "%Y-%m-%d").date() # Added strip and str conversion
    except (ValueError, TypeError): return None

def parse_form_date(date_str): # Specific helper for forms if needed
    return parse_date_internal(date_str)

def parse_form_age(age_str):
    try: return int(age_str) if age_str and str(age_str).isdigit() else None # Added str conversion
    except (ValueError, TypeError): return None

def get_media_url_prefix(request):
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    if media_url.startswith('http'): return media_url
    else: return f"{request.scheme}://{request.get_host()}{media_url}"

def serialize_model_instance(instance):
    """ Converts model instance to dict, handles files/dates. """
    if instance is None: return {}
    try:
        data = model_to_dict(instance)
        for field_name, value in list(data.items()):
            if isinstance(value, FieldFile):
                try: data[field_name] = value.url if value and hasattr(value, 'url') else None
                except Exception: data[field_name] = None
            elif isinstance(value, (datetime, date)):
                data[field_name] = value.isoformat()
            # Removed internal field check, model_to_dict usually handles this
        return data
    except Exception as e:
        logger.error(f"Error serializing instance {getattr(instance, 'pk', 'N/A')}: {e}")
        return {} # Return empty dict on error


ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt', 'mp4', 'mov', 'avi']

# --- Authentication & Member Management ---

def send_otp_via_email(email, otp):
    subject = "🔐 Password Reset OTP - JSW Health Portal"
    from_email = settings.DEFAULT_FROM_EMAIL # Use settings directly
    recipient_list = [email]
    context = {"otp": otp, "email": email}
    try:
        # Ensure template exists or provide fallback text content
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
            otp = random.randint(100000, 999999)
            cache_key = f"otp_{username}"
            cache.set(cache_key, otp, timeout=300) # 5 minutes timeout
            if send_otp_via_email(member.email, otp):
                return JsonResponse({"message": "OTP sent successfully to your registered email."}, status=200)
            else:
                cache.delete(cache_key) # Clean up cache if email failed
                return JsonResponse({"message": "Failed to send OTP."}, status=500)
        except Member.DoesNotExist: return JsonResponse({"message": "User not found"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e: logger.exception("Error in forgot_password."); return JsonResponse({"message": "Unexpected error occurred."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            otp_entered = data.get("otp")
            if not username or not otp_entered: return JsonResponse({"message": "Username and OTP required"}, status=400)
            cache_key = f"otp_{username}"
            stored_otp = cache.get(cache_key)
            if stored_otp and str(stored_otp) == str(otp_entered):
                cache.delete(cache_key) # Consume OTP
                cache.set(f"otp_verified_{username}", True, timeout=600) # 10 min validity for reset
                return JsonResponse({"message": "OTP verified successfully"}, status=200)
            else: return JsonResponse({"message": "Invalid or expired OTP"}, status=400)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e: logger.exception("Error in verify_otp."); return JsonResponse({"message": "Unexpected error occurred."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        username = None # Initialize for logging in case of error before assignment
        try:
            data = json.loads(request.body)
            username = data.get("username")
            new_password = data.get("newPassword")
            if not username or not new_password: return JsonResponse({"message": "Username and new password required"}, status=400)

            # Check verification status first
            verified_key = f"otp_verified_{username}"
            if not cache.get(verified_key): return JsonResponse({"message": "OTP not verified or verification expired."}, status=403)

            member = Member.objects.get(employee_number=username)
            # Hash the new password
            hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            member.password = hashed_pw
            member.save(update_fields=['password'])
            cache.delete(verified_key) # Consume verification status
            return JsonResponse({"message": "Password reset successful"}, status=200)
        except Member.DoesNotExist: return JsonResponse({"message": "User not found"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format."}, status=400)
        except Exception as e:
            logger.exception("Error in reset_password.")
            if username: cache.delete(f"otp_verified_{username}") # Clean up cache on error
            return JsonResponse({"message": "Unexpected error occurred."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username') # Expects employee_number
            password = data.get('password')
            if not username or not password: return JsonResponse({"message": "Username and password required."}, status=400)
            # Use Django's authenticate or custom logic
            try:
                member = Member.objects.get(employee_number=username)
                if bcrypt.checkpw(password.encode('utf-8'), member.password.encode('utf-8')):
                     # Login successful
                    return JsonResponse({
                        "username": member.name,
                        "accessLevel": member.role, # Consider splitting roles if needed: member.role.split(',')
                        "empNo": member.employee_number,
                        "message": "Login successful!"
                    }, status=200)
                else:
                    # Invalid password
                    return JsonResponse({"message": "Invalid credentials"}, status=401)
            except Member.DoesNotExist:
                 # Invalid username
                 return JsonResponse({"message": "Invalid credentials"}, status=401) # Keep message generic
        except json.JSONDecodeError: return JsonResponse({"message": "Invalid request format"}, status=400)
        except Exception as e: logger.exception("Login failed."); return JsonResponse({"message": "Unexpected error occurred."}, status=500)
    return JsonResponse({"message": "Invalid request method. Use POST."}, status=405)

@csrf_exempt
def find_member_by_aadhar(request):
    if request.method == 'GET':
        aadhar_param = request.GET.get('aadhar')
        if not aadhar_param:
            return JsonResponse({'error': True, 'message': 'Aadhar number is required'}, status=400)

        try:
            # Check OHC (employee_details model)
            try:
                employee_record = employee_details.objects.filter(aadhar=aadhar_param).first()
                if employee_record:
                    roles_list = [r.strip().lower() for r in employee_record.role.split(',')] if employee_record.role else []
                    member_data = {
                        'id': employee_record.id, # <<<<<<<<<<<<---- ADD THIS LINE (or ensure it's .pk)
                        'name': employee_record.name,
                        'designation': employee_record.designation,
                        'email': employee_record.mail_id_Office or employee_record.mail_id_Personal,
                        'phone_number': employee_record.phone_Office or employee_record.phone_Personal,
                        'role': roles_list,
                        'job_nature': employee_record.job_nature,
                        'doj': employee_record.doj.strftime('%Y-%m-%d') if employee_record.doj else None,
                        'employee_number': employee_record.emp_no,
                        'aadhar': employee_record.aadhar,
                        'memberTypeDetermined': 'ohc',
                        'date_exited': None,
                        'hospital_name': None,
                    }
                    return JsonResponse({
                        'found': True,
                        'member': member_data,
                        'message': 'OHC Staff member found.'
                    })
            except employee_details.DoesNotExist: # This won't be hit if using filter().first()
                pass
            except Exception as e_emp:
                print(f"Error querying employee_details for Aadhar {aadhar_param}: {str(e_emp)}")
                # Potentially return an error or log more carefully

            # Check General Member table
            try:
                member_instance = Member.objects.filter(aadhar=aadhar_param).first() # Use your actual model name
                if member_instance:
                    roles_list = [r.strip().lower() for r in member_instance.role.split(',')] if member_instance.role else []
                    member_data = {
                        'id': member_instance.id, # <<<<<<<<<<<<---- ADD THIS LINE (or ensure it's .pk)
                        'name': member_instance.name,
                        'designation': member_instance.designation,
                        'email': member_instance.email,
                        'phone_number': member_instance.phone_number,
                        'role': roles_list,
                        'job_nature': member_instance.job_nature,
                        'doj': member_instance.doj.strftime('%Y-%m-%d') if member_instance.doj else None,
                        'date_exited': member_instance.date_exited.strftime('%Y-%m-%d') if member_instance.date_exited else None,
                        'employee_number': member_instance.employee_number,
                        'hospital_name': member_instance.hospital_name,
                        'aadhar': member_instance.aadhar,
                        'memberTypeDetermined': member_instance.type
                    }
                    return JsonResponse({
                        'found': True,
                        'member': member_data,
                        'message': 'Member found.'
                    })
            except Member.DoesNotExist: # This won't be hit if using filter().first()
                pass
            except Exception as e_mem:
                 print(f"Error querying Member for Aadhar {aadhar_param}: {str(e_mem)}")
                 # Potentially return an error here


            # If no record found in either table after checks
            return JsonResponse({'found': False, 'message': 'Member not found in any records.'}, status=200)

        except Exception as e:
            print(f"Outer error finding member by Aadhar {aadhar_param}: {str(e)}")
            return JsonResponse({'error': True, 'message': 'An internal server error occurred.'}, status=500)

    return JsonResponse({'error': True, 'message': 'Only GET method is allowed'}, status=405)
@csrf_exempt
def add_member(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        member_type = data.get('memberType')
        print("member_type", member_type)

        # Validate memberType
        if member_type not in ['ohc', 'external']:
            return JsonResponse({'message': 'Invalid memberType'}, status=400)

        # Required fields
        required = ['name', 'designation', 'email', 'role', 'phone_number', 'aadhar']
        if member_type == 'ohc':
            required += ['employee_number', 'doj']
        elif member_type == 'external':
            required += ['hospital_name']

        # Check missing fields
        missing = [f for f in required if not data.get(f)]
        if missing:
            return JsonResponse({'message': f"Missing fields: {', '.join(missing)}"}, status=400)

        # Uniqueness checks
        if Member.objects.filter(email__iexact=data['email']).exists():
            return JsonResponse({'message': 'Email already exists.'}, status=409)
        if member_type == 'ohc' and Member.objects.filter(employee_number=data['employee_number']).exists():
            return JsonResponse({'message': 'Employee number already exists.'}, status=409)
        if Member.objects.filter(aadhar=data['aadhar']).exists():
            return JsonResponse({'message': 'Aadhar number already exists.'}, status=409)

        # Handle password
        raw_pw = data.get('password', f"{data['role'][0]}123" if data.get('role') else "DefaultPass123!")
        hashed_pw = bcrypt.hashpw(raw_pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Build member data
        member_data = {
            'name': data['name'],
            'designation': data['designation'],
            'email': data['email'],
            'role': ','.join(data.get('role', [])),
            'phone_number': data['phone_number'],
            'job_nature': data.get('job_nature'),
            'date_exited': django_parse_date(data.get('date_exited')),
            'password': hashed_pw,
            'entry_date': date.today(),
            'aadhar': data['aadhar'],
            'type': member_type  # Ensure the type is saved properly
        }

        # Add type-specific fields
        if member_type == 'ohc':
            member_data.update({
                'employee_number': data['employee_number'],
                'doj': django_parse_date(data.get('doj'))   
            })
        elif member_type == 'external':
            member_data.update({
                'hospital_name': data['hospital_name']
            })

        # Create member
        member = Member.objects.create(**member_data)
        logger.info(f"Member added ID: {member.id}, Type: {member_type}")
        return JsonResponse({'message': 'Member added successfully', 'memberId': member.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON'}, status=400)
    except ValidationError as e:
        return JsonResponse({'message': 'Validation Error', 'details': e.message_dict}, status=400)
    except Exception as e:
        logger.exception("add_member failed.")
        return JsonResponse({'message': 'Internal error.'}, status=500)

@csrf_exempt
def update_member(request, member_id):
    if request.method == 'PUT':
        try:
            member = get_object_or_404(Member, pk=member_id)
            data = json.loads(request.body)
            member_type = data.get('memberType')

            # Validate member type consistency
            is_ohc = bool(member.employee_number)
            if not member_type or (member_type == 'ohc' and not is_ohc) or (member_type == 'external' and is_ohc):
                 # Allow specifying type if it matches, otherwise error on mismatch/change attempt
                return JsonResponse({'message': 'Member type mismatch or change not allowed.'}, status=400)

            # Basic required fields for update (email is usually not updated, roles might be)
            required = ['name', 'designation', 'role', 'phone_number']
            if member_type == 'external' and not data.get('aadhar'):
                 # Aadhar becomes required for external if not already set (unlikely scenario)
                 if not member.aadhar: required.append('aadhar')

            missing = [f for f in required if data.get(f) is None or data.get(f) == ''] # Check for missing or empty
            if missing: return JsonResponse({'message': f"Missing required fields for update: {', '.join(missing)}"}, status=400)

            # Update fields from payload, using existing value as default if key not present
            member.name = data.get('name', member.name)
            member.designation = data.get('designation', member.designation)
            member.role = ','.join(data.get('role', [])) if data.get('role') is not None else member.role
            member.phone_number = data.get('phone_number', member.phone_number)
            member.job_nature = data.get('job_nature', member.job_nature) # Optional update
            member.date_exited = parse_date_internal(data.get('date_exited')) if data.get('date_exited') is not None else member.date_exited # Allow clearing

            if member_type == 'ohc':
                # employee_number is usually immutable, DOJ might be updatable
                member.doj = parse_date_internal(data.get('doj')) if data.get('doj') else member.doj
            elif member_type == 'external':
                member.hospital_name = data.get('hospital_name', member.hospital_name)
                member.aadhar = data.get('aadhar', member.aadhar) # Allow updating Aadhar if needed

            member.full_clean() # Validate before saving
            member.save()
            logger.info(f"Member updated ID: {member_id}, Name: {member.name}")
            return JsonResponse({'message': 'Member updated successfully'}, status=200)
        except Http404: return JsonResponse({'message': 'Member not found'}, status=404)
        except json.JSONDecodeError: return JsonResponse({'message': 'Invalid JSON format'}, status=400)
        except ValidationError as e: return JsonResponse({'message': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e: logger.exception(f"update_member failed ID: {member_id}."); return JsonResponse({'message': 'An internal server error occurred.'}, status=500)
    return JsonResponse({'message': 'Invalid request method. Use PUT.'}, status=405)

@csrf_exempt
def delete_member(request, member_id):
    # Should ideally use DELETE method, but POST is common
    if request.method == 'POST':
        try:
            member = get_object_or_404(Member, pk=member_id)
            member_name = member.name # Get name for logging before delete
            member.delete()
            logger.info(f"Member deleted ID: {member_id}, Name: {member_name}")
            return JsonResponse({'success': True, 'message': 'Member deleted successfully.'})
        except Http404: return JsonResponse({'success': False, 'message': 'Member not found.'}, status=404)
        except Exception as e: logger.exception(f"delete_member failed ID: {member_id}."); return JsonResponse({'success': False, 'message': 'An error occurred during deletion.'}, status=500)
    return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405) # Changed error message

@csrf_exempt
def create_users(request):
    # This creates Django admin users, separate from the Member model used for portal login
    if request.method == 'POST':
        try:
            # Consider making passwords more secure or configurable
            default_users = [
                {'username': 'nurse_user', 'password': 'DefaultPasswordN1!', 'email': 'nurse@example.com', 'first_name': 'Default', 'last_name': 'Nurse'},
                {'username': 'doctor_user', 'password': 'DefaultPasswordD1!', 'email': 'doctor@example.com', 'first_name': 'Default', 'last_name': 'Doctor'},
                {'username': 'admin_user', 'password': 'DefaultPasswordA1!', 'email': 'admin@example.com', 'first_name': 'Default', 'last_name': 'Admin', 'is_staff': True, 'is_superuser': True},
                {'username': 'pharmacy_user', 'password': 'DefaultPasswordP1!', 'email': 'pharmacy@example.com', 'first_name': 'Default', 'last_name': 'Pharmacy'}
            ]
            created_count, skipped_count = 0, 0
            for user_data in default_users:
                username = user_data['username']
                if not User.objects.filter(username=username).exists():
                    User.objects.create_user(
                        username=username,
                        password=user_data['password'],
                        email=user_data.get('email', ''),
                        first_name=user_data.get('first_name', ''),
                        last_name=user_data.get('last_name', ''),
                        is_staff=user_data.get('is_staff', False),
                        is_superuser=user_data.get('is_superuser', False)
                    )
                    created_count += 1
                else:
                    skipped_count += 1
            message = f"{created_count} Django users created. {skipped_count} skipped (already existed)."
            logger.info(message)
            return JsonResponse({"message": message}, status=201 if created_count > 0 else 200)
        except Exception as e:
            logger.exception("create_users (Django User) failed.")
            return JsonResponse({"error": "Error creating default Django users.", "detail": str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405)


# --- Core Data Fetching / Entry (Using Aadhar) ---

@csrf_exempt
def fetchdata(request):
    """Fetches latest employee_details and related data based on AADHAR."""
    # This view seems complex but correctly uses aadhar as the key after fetching latest IDs.
    if request.method == "POST":
        try:
            # Fetch Latest Employee Records based on Aadhar and Max ID
            latest_employees = (
                employee_details.objects
                .values("aadhar")
                .annotate(latest_id=Max("id"))
            )
            latest_employee_ids = [emp["latest_id"] for emp in latest_employees]
            # Get the full employee details for the latest IDs
            employees = list(employee_details.objects.filter(id__in=latest_employee_ids).values())

            media_url_prefix = get_media_url_prefix(request) # Use helper function

            # Add profile picture URL
            for emp in employees:
                if emp.get("profilepic"):
                    emp["profilepic_url"] = f"{media_url_prefix}{emp['profilepic']}"
                else:
                    emp["profilepic_url"] = None

            def get_latest_records(model, key_field='aadhar'): # Allow specifying key field if not aadhar
                """ Helper to get latest records for a list of employees/aadhars """
                employee_keys = [emp[key_field] for emp in employees if emp.get(key_field)]
                if not employee_keys:
                     return {}, {} # No keys to query

                # Identify the date field (usually 'entry_date' or 'date')
                date_field = 'entry_date' if hasattr(model, 'entry_date') else 'date' if hasattr(model, 'date') else None
                if not date_field:
                     logger.warning(f"Model {model.__name__} has no recognized date field for ordering.")
                     # Fallback: just filter by aadhar without date ordering (might not be latest)
                     records = list(model.objects.filter(aadhar__in=employee_keys).values())

                else:
                     # Get the latest ID for each aadhar based on the date field and ID
                     latest_ids_subquery = model.objects.filter(aadhar__in=employee_keys)\
                         .values('aadhar')\
                         .annotate(latest_id=Max('id')) # Assuming higher ID is later if dates are same

                     latest_ids = [item['latest_id'] for item in latest_ids_subquery]
                     records = list(model.objects.filter(id__in=latest_ids).values())


                # Create a default structure based on model fields
                default_structure = {}
                if model and hasattr(model, '_meta'):
                     try:
                         for field in model._meta.get_fields():
                            if field.concrete and not field.is_relation and not field.primary_key:
                                default_val = None # Default
                                if isinstance(field, (CharField,)): default_val = ""
                                elif isinstance(field, BooleanField): default_val = False
                                elif isinstance(field, JSONField):
                                    # Basic defaults for common JSON structures
                                    if field.name in ["normal_doses", "booster_doses"]: default_val = {"dates": [], "dose_names": []}
                                    elif field.name == "surgical_history": default_val = {"comments":"", "children": []}
                                    elif field.name == "vaccination": default_val = {"vaccination": []}
                                    elif field.name in ["job_nature", "conditional_fit_feilds"]: default_val = []
                                    else: default_val = {}
                                default_structure[field.name] = default_val
                     except Exception as e:
                          logger.error(f"Error creating default structure for {model.__name__}: {e}")


                # Return dictionary keyed by aadhar and the default structure
                return {record["aadhar"]: record for record in records if "aadhar" in record}, default_structure


            # Fetch data for all related models
            models_to_fetch = [
                 Dashboard, vitals, MedicalHistory, heamatalogy, RoutineSugarTests,
                 RenalFunctionTest, LipidProfile, LiverFunctionTest, ThyroidFunctionTest,
                 AutoimmuneTest, CoagulationTest, EnzymesCardiacProfile, UrineRoutineTest,
                 SerologyTest, MotionTest, CultureSensitivityTest, MensPack, WomensPack,
                 OccupationalProfile, OthersTest, OphthalmicReport, XRay, USGReport,
                 CTReport, MRIReport, FitnessAssessment, VaccinationRecord, Consultation,
                 Prescription, SignificantNotes, Form17, Form38, Form39, Form40, Form27
            ]

            fetched_data = {}
            default_structures = {}
            for model_cls in models_to_fetch:
                 model_name_lower = model_cls.__name__.lower()
                 # Adjust key names if needed (e.g., renalfunctiontest -> renalfunctiontests_and_electrolytes)
                 if model_cls == RenalFunctionTest: key_name = "renalfunctiontests_and_electrolytes"
                 else: key_name = model_name_lower

                 fetched_data[key_name], default_structures[key_name] = get_latest_records(model_cls)


            if not employees:
                logger.info("No employee records found.")
                return JsonResponse({"data": []}, status=200)

            # Merge data
            merged_data = []
            for emp in employees:
                emp_aadhar = emp.get("aadhar")
                if not emp_aadhar: continue # Skip if employee record missing aadhar

                merged_emp = emp.copy() # Start with employee details

                # Add data from related models
                for key_name in fetched_data:
                    # Use get with fallback to the default structure for that model type
                    merged_emp[key_name] = fetched_data[key_name].get(emp_aadhar, default_structures.get(key_name, {}))
                    # Ensure dates within fetched data are serialized
                    if isinstance(merged_emp[key_name], dict):
                        for sub_key, sub_value in merged_emp[key_name].items():
                            if isinstance(sub_value, (datetime, date)):
                                merged_emp[key_name][sub_key] = sub_value.isoformat()

                merged_data.append(merged_emp)

            return JsonResponse({"data": merged_data}, status=200)

        except Exception as e:
            logger.exception("Error in fetchdata view: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning("fetchdata failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)


# Corrected addEntries view

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction, IntegrityError
from django.db.models import Max
from .models import employee_details, Dashboard
#from .views_helpers import parse_date_internal # Assuming views_helpers.py or adjust import
import json
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def addEntries(request):
    """
    Adds a new employee_details record and Dashboard record for a visit today.
    Handles MRD number generation and correctly maps dynamic frontend data to specific model fields.
    """
    if request.method != "POST":
        logger.warning("addEntries failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    aadhar = None 
    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for addEntries: {json.dumps(data)[:500]}...")

        employee_data = data.get('formData', {})
        dashboard_data = data.get('formDataDashboard', {})
        extra_data = data.get('extraData', {})

        aadhar = employee_data.get('aadhar')
        if not aadhar:
            logger.warning("addEntries failed: Aadhar number (aadhar) is required in formData.")
            return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

        entry_date = date.today()

        # --- MRD Number Logic (Unchanged) ---
        determined_mrd_no = None 
        with transaction.atomic():
            today_entries = employee_details.objects.filter(
                entry_date=entry_date
            ).select_for_update().order_by('-mrdNo')

            highest_mrd_today = today_entries.first()
            if highest_mrd_today and highest_mrd_today.mrdNo and len(highest_mrd_today.mrdNo) >= 6:
                 try:
                      current_sequence = int(highest_mrd_today.mrdNo[:6])
                      next_sequence = current_sequence + 1
                 except (ValueError, TypeError):
                      logger.warning(f"Could not parse sequence from MRD '{highest_mrd_today.mrdNo}'. Starting sequence at 1.")
                      next_sequence = 1
            else:
                next_sequence = 1
            
            seq_part = f"{next_sequence:06d}"
            date_part = entry_date.strftime('%d%m%Y')
            determined_mrd_no = f"{seq_part}{date_part}"
        logger.info(f"Generated new MRD number {determined_mrd_no} for aadhar: {aadhar}")
        # --- End MRD Number Logic ---
        
        # --- Prepare combined data for employee_details ---
        # <<< MODIFIED: All data preparation logic is updated below >>>
        employee_defaults = {
            'name': employee_data.get('name', ''),
            'dob': parse_date_internal(employee_data.get('dob')),
            'sex': employee_data.get('sex', ''),
            'guardian': employee_data.get('guardian', ''),
            'bloodgrp': employee_data.get('bloodgrp', ''),
            'identification_marks1': employee_data.get('identification_marks1', ''),
            'identification_marks2': employee_data.get('identification_marks2', ''),
            'marital_status': employee_data.get('marital_status', ''),
            'emp_no': employee_data.get('emp_no', ''),
            'employer': employee_data.get('employer', ''),
            'designation': employee_data.get('designation', ''),
            'department': employee_data.get('department', ''),
            'job_nature': employee_data.get('job_nature', ''),
            'doj': parse_date_internal(employee_data.get('doj')),
            'moj': employee_data.get('moj', ''),
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
            'nationality': employee_data.get('nationality', ''),
            'docName': employee_data.get('docName', ''),
            'permanent_country': employee_data.get('permanent_country', ''),
            'residential_address': employee_data.get('residential_address', ''),
            'residential_area': employee_data.get('residential_area', ''),
            'residential_state': employee_data.get('residential_state', ''),
            'residential_country': employee_data.get('residential_country', ''),
            'country_id': employee_data.get('country_id', ''),
            'role': employee_data.get('role', ''),
            'other_site_id': employee_data.get('other_site_id', ''),
            'organization': employee_data.get('organization', ''),
            'addressOrganization': employee_data.get('addressOrganization', ''),
            'visiting_department': employee_data.get('visiting_department', ''),
            'visiting_date_from': parse_date_internal(employee_data.get('visiting_date_from')),
            'visiting_date_to': parse_date_internal(employee_data.get('visiting_date_to')),
            'stay_in_guest_house': employee_data.get('stay_in_guest_house', ''),
            'visiting_purpose': employee_data.get('visiting_purpose', ''),
            'type': dashboard_data.get('category', 'Employee'),
            'type_of_visit': dashboard_data.get('typeofVisit', ''),
            'register': dashboard_data.get('register', ''),
            'purpose': dashboard_data.get('purpose', ''),
            'year': extra_data.get('year', ''),
            'batch': extra_data.get('batch', ''),
            'hospitalName': extra_data.get('hospitalName', ''),
            'campName': extra_data.get('campName', ''),
            'contractName': extra_data.get('contractName', ''),
            'prevcontractName': extra_data.get('prevcontractName', ''),
            'old_emp_no': extra_data.get('old_emp_no', ''),
            'otherRegister': extra_data.get('otherRegister', ''),
            'mrdNo': determined_mrd_no,
        }
        
        # <<< ADDED: Conditional logic to handle dynamic data from 'extraData' >>>
        register_type = dashboard_data.get('register', '')
        if "BP Sugar Check" in register_type:
            employee_defaults['status'] = extra_data.get('status', '')
        elif "BP Sugar Chart" in register_type:
            employee_defaults['bp_sugar_chart_reason'] = extra_data.get('reason', '')
        elif "Follow Up Visits" in register_type:
            employee_defaults['followup_reason'] = extra_data.get('purpose', '')
            # The frontend sends the "other" text in 'purpose_others'
            if extra_data.get('purpose', '').endswith("Others"):
                employee_defaults['followup_other_reason'] = extra_data.get('purpose_others', '')
        
        employee_defaults_filtered = {k: v for k, v in employee_defaults.items() if v is not None}

        # --- Create new employee_details entry ---
        with transaction.atomic():
            employee_entry = employee_details.objects.create(
                aadhar=aadhar,
                entry_date=entry_date,
                **employee_defaults_filtered
            )

            # --- Prepare and save Dashboard data ---
            # <<< MODIFIED: This now pulls data from the created employee_entry for consistency >>>
            dashboard_defaults = {
                'type': employee_entry.type,
                'type_of_visit': employee_entry.type_of_visit,
                'register': employee_entry.register,
                'purpose': employee_entry.purpose,
                'otherRegister': employee_entry.otherRegister,
                'year': employee_entry.year,
                'batch': employee_entry.batch,
                'hospitalName': employee_entry.hospitalName,
                'campName': employee_entry.campName,
                'contractName': employee_entry.contractName,
                'prevcontractName': employee_entry.prevcontractName,
                'old_emp_no': employee_entry.old_emp_no,
                'mrdNo': employee_entry.mrdNo,
                'emp_no': employee_entry.emp_no,
                # <<< ADDED: Map specific fields to the dashboard model >>>
                'status': employee_entry.status,
                'bp_sugar_chart_reason': employee_entry.bp_sugar_chart_reason,
                'followup_reason': employee_entry.followup_reason,
                'followup_other_reason': employee_entry.followup_other_reason,
            }
            dashboard_defaults_filtered = {k: v for k, v in dashboard_defaults.items() if v is not None}

            dashboard_entry = Dashboard.objects.create(
                aadhar=aadhar,
                date=entry_date,
                **dashboard_defaults_filtered
            )

        message = f"Visit Entry added (MRD: {employee_entry.mrdNo}) and Dashboard created successfully"
        logger.info(f"addEntries successful for aadhar: {aadhar} on {entry_date}. MRD: {employee_entry.mrdNo}, EmployeeEntryID: {employee_entry.id}, DashboardID: {dashboard_entry.id}")
        return JsonResponse({"message": message, "mrdNo": employee_entry.mrdNo, "aadhar": aadhar}, status=200)

    except json.JSONDecodeError:
        logger.error("addEntries failed: Invalid JSON data.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"addEntries failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing the entry.", "detail": str(e)}, status=500)


@csrf_exempt
def add_basic_details(request):
    """Adds or updates basic employee details based on AADHAR and today's date, including profile pic."""
    if request.method != "POST":
        logger.warning("add_basic_details failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    aadhar = None # Initialize for logging
    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_basic_details: {json.dumps(data)[:500]}...")

        aadhar = data.get('aadhar')
        mrdNo = data.get('mrdNo') 
        if not aadhar:
            logger.warning("add_basic_details failed: Aadhar number is required")
            return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

        entry_date = date.today() # Operates on today's record

        # Prepare defaults dictionary mapping payload keys to model fields
        basic_defaults = {
            'name': data.get('name'), 'dob': parse_date_internal(data.get('dob')), 'sex': data.get('sex'),
            'guardian': data.get('guardian'), 'bloodgrp': data.get('bloodgrp'),
            'identification_marks1': data.get('identification_marks1'), 'identification_marks2': data.get('identification_marks2'),
            'marital_status': data.get('marital_status'), 'emp_no': data.get('emp_no'),
            'employer': data.get('employer'), 'designation': data.get('designation'), 'department': data.get('department'),
            'job_nature': data.get('job_nature'), 'doj': parse_date_internal(data.get('doj')), 'moj': data.get('moj'),
            'phone_Personal': data.get('phone_Personal'), 'mail_id_Personal': data.get('mail_id_Personal'),
            'emergency_contact_person': data.get('emergency_contact_person'), 'phone_Office': data.get('phone_Office'),
            'mail_id_Office': data.get('mail_id_Office'), 'emergency_contact_relation': data.get('emergency_contact_relation'),
            'mail_id_Emergency_Contact_Person': data.get('mail_id_Emergency_Contact_Person'),
            'emergency_contact_phone': data.get('emergency_contact_phone'), 'location': data.get('location'),
            'permanent_address': data.get('permanent_address'), 'permanent_area': data.get('permanent_area'),
            'nationality': data.get('nationality'),
            'docName': data.get('docName'),
            'permanent_state': data.get('permanent_state'), 'permanent_nationality': data.get('permanent_nationality'),
            'residential_address': data.get('residential_address'), 'residential_area': data.get('residential_area'),
            'residential_state': data.get('residential_state'), 'residential_nationality': data.get('residential_nationality'),
            'country_id': data.get('country_id'), 'role': data.get('role'),
            'employee_status': data.get('employee_status'), 'since_date': parse_date_internal(data.get('since_date')),
            'transfer_details': data.get('transfer_details'), 'other_reason_details': data.get('other_reason_details'),
            'previousemployer':data.get('previousemployer'),'previouslocation':data.get('previouslocation'),
            
            # Visitor Fields
            'other_site_id': data.get('other_site_id'), 'organization': data.get('organization'),
            'addressOrganization': data.get('addressOrganization'), 'visiting_department': data.get('visiting_department'),
            'visiting_date_from': parse_date_internal(data.get('visiting_date_from')),
            'visiting_date_to': parse_date_internal(data.get('visiting_date_to')),
            'stay_in_guest_house': data.get('stay_in_guest_house'), 'visiting_purpose': data.get('visiting_purpose'),
            # Set 'type' based on role
            'type': data.get('role', 'Employee'), # Default type if role missing
            # profilepic handled below
        }

        # Filter out None values before passing to update_or_create defaults
        basic_defaults_filtered = {k: v for k, v in basic_defaults.items() if v is not None}

        # --- Use update_or_create based on AADHAR and DATE ---
        employee, created = employee_details.objects.update_or_create(
            aadhar=aadhar,
            entry_date=entry_date,
            mrdNo=mrdNo,
            defaults=basic_defaults_filtered
        )

        # --- Handle Profile Picture ---
        profile_image_b64 = data.get('profilepic') # Key from payload
        image_field_updated = False

        if profile_image_b64 and isinstance(profile_image_b64, str) and ';base64,' in profile_image_b64:
            try:
                header, encoded = profile_image_b64.split(';base64,', 1)
                file_ext_match = re.search(r'data:image/(?P<ext>\w+);base64', header) # More robust extraction
                file_ext = file_ext_match.group('ext') if file_ext_match else 'jpg'

                image_data = base64.b64decode(encoded)
                filename = f"profilepics/{aadhar}_{uuid.uuid4().hex[:8]}.{file_ext}"

                # Delete old file only if a new file is being saved
                if employee.profilepic and employee.profilepic.name:
                     try:
                         if default_storage.exists(employee.profilepic.path):
                             default_storage.delete(employee.profilepic.path)
                             logger.info(f"Deleted old profile pic for aadhar {aadhar}: {employee.profilepic.name}")
                     except Exception as del_err:
                          logger.error(f"Error deleting old profile pic for aadhar {aadhar}: {del_err}")

                # Save the new image file (triggers pre_save/post_save if defined)
                employee.profilepic.save(filename, ContentFile(image_data), save=True) # Save=True here to commit change
                image_field_updated = True
                logger.info(f"Profile picture updated and saved for aadhar: {aadhar}")

            except (TypeError, ValueError, base64.binascii.Error) as img_err:
                logger.error(f"Failed to decode or save profile picture for aadhar {aadhar}: {img_err}")
            except Exception as img_ex:
                logger.exception(f"Unexpected error processing profile picture for aadhar {aadhar}")

        elif 'profilepic' in data and data['profilepic'] is None:
             # Handle clearing the image
             if employee.profilepic:
                 try:
                     employee.profilepic.delete(save=True) # Delete file and save model change
                     image_field_updated = True
                     logger.info(f"Profile picture cleared for aadhar: {aadhar}")
                 except Exception as del_err:
                      logger.error(f"Error clearing profile pic file for aadhar {aadhar}: {del_err}")

        # No explicit final save needed if update_or_create handled non-image fields
        # and profilepic.save(save=True) or profilepic.delete(save=True) handled image fields.

        message = "Basic Details added successfully" if created else "Basic Details updated successfully"
        return JsonResponse({
            "message": message,
            "aadhar": aadhar,
            "entry_date": entry_date.isoformat(),
            "profilepic_url": employee.profilepic.url if employee.profilepic else None
            }, status=201 if created else 200)

    except json.JSONDecodeError:
        logger.error("add_basic_details failed: Invalid JSON data.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"add_basic_details failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing basic details."}, status=500)

import re # Added for profile pic extension extraction

@csrf_exempt
def uploadImage(request, aadhar):
    """Handles uploading/updating profile images based on AADHAR for the LATEST record."""
    # Note: This might be redundant if add_basic_details is always used.
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            image_b64 = data.get('profileImage') # Assuming this key

            if not image_b64 or not isinstance(image_b64, str) or ';base64,' not in image_b64:
                logger.warning(f"Image upload failed for aadhar {aadhar}: Invalid or missing image data.")
                return JsonResponse({'status': 'error', 'message': 'Invalid or missing profileImage data (must be base64 string).'}, status=400)

            # Get the LATEST employee record for this aadhar
            employee = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()

            if not employee:
                logger.warning(f"Image upload failed: No employee record found for aadhar {aadhar}.")
                return JsonResponse({'status': 'error', 'message': 'Employee record not found for this Aadhar.'}, status=404)

            # --- Process and Save Image ---
            try:
                header, encoded = image_b64.split(';base64,', 1)
                file_ext_match = re.search(r'data:image/(?P<ext>\w+);base64', header)
                file_ext = file_ext_match.group('ext') if file_ext_match else 'jpg'

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

                # Save new file (triggers model save)
                employee.profilepic.save(filename, ContentFile(image_data), save=True)

                logger.info(f"Successfully updated profile image for aadhar {aadhar} (latest record ID: {employee.id})")
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
def fetchVisitdata(request, aadhar):
    """
    Fetches all Dashboard visit records for a specific employee 
    and combines them with the corresponding vitals data by mapping mrdNo.
    """
    # REST convention for fetching data is GET
    if request.method == "POST":
        try:
            # 1. Fetch both datasets from the database
            visit_data = list(Dashboard.objects.filter(aadhar=aadhar).order_by('-date').values())
            vitals_data = list(vitals.objects.filter(aadhar=aadhar).order_by('-entry_date').values())

            # 2. Create a lookup map for vitals using mrdNo for efficient matching.
            # This maps each mrdNo to its corresponding vitals dictionary.
            # We add a check to ensure we only map records that have an mrdNo.
            vitals_map = {vital['mrdNo']: vital for vital in vitals_data if vital.get('mrdNo')}

            # 3. Iterate through the visits and enrich them with the vitals data
            for visit in visit_data:
                # First, serialize any date objects to strings for JSON compatibility
                if isinstance(visit.get('date'), date):
                    visit['date'] = visit['date'].isoformat()
                
                # Get the mrdNo for the current visit
                mrd_no = visit.get('mrdNo')
                
                # Find the matching vitals from the map using the mrdNo.
                # .get() safely returns None if the mrdNo is not found in the map.
                matching_vitals = vitals_map.get(mrd_no)

                # Add the found vitals data to the visit record under a 'vitals' key.
                # This is safer than a direct update() as it avoids key collisions.
                visit['vitals'] = matching_vitals  # This will be None if no match was found

            logger.info(f"Fetched and combined {len(visit_data)} visit records for aadhar: {aadhar}")
            
            # 4. Return the single, combined dataset
            return JsonResponse({"message": "Visit data fetched successfully", "data": visit_data}, status=200)

        except Exception as e:
            logger.exception(f"fetchVisitdata failed for aadhar {aadhar}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        logger.warning(f"fetchVisitdata called with invalid method {request.method} for aadhar {aadhar}.")
        # Corrected error message to align with the check
        return JsonResponse({"error": "Invalid request method. Please use GET."}, status=405)

@csrf_exempt
def fetchVisitDataWithDate(request, aadhar, date_str):
    """Fetches the LATEST record ON OR BEFORE a specific date for an Aadhar across multiple models."""
    if request.method == "GET":
        try:
            target_date_obj = parse_date_internal(date_str)
            if not target_date_obj:
                logger.warning(f"fetchVisitDataWithDate failed for aadhar {aadhar}: Invalid date format '{date_str}'. Use YYYY-MM-DD.")
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            # List of models to query, mapping key name to model class
            models_to_query = {
                "employee": employee_details, "dashboard": Dashboard, "vitals": vitals,
                "msphistory": MedicalHistory, "haematology": heamatalogy, "routinesugartests": RoutineSugarTests,
                "renalfunctiontests_and_electrolytes": RenalFunctionTest, # Use the key name from fetchdata
                "lipidprofile": LipidProfile, "liverfunctiontest": LiverFunctionTest,
                "thyroidfunctiontest": ThyroidFunctionTest, "coagulationtest": CoagulationTest,
                "enzymesandcardiacprofile": EnzymesCardiacProfile, "urineroutine": UrineRoutineTest,
                "serology": SerologyTest, "motion": MotionTest, "menspack": MensPack,
                "opthalamicreport": OphthalmicReport, "usg": USGReport, "mri": MRIReport,
                "fitnessassessment": FitnessAssessment, "vaccination": VaccinationRecord,
                "significant_notes": SignificantNotes, "consultation": Consultation,
                "prescription": Prescription, "form17": Form17, "form38": Form38,
                "form39": Form39, "form40": Form40, "form27": Form27,
                 # Added missing models from fetchdata
                "autoimmunetest": AutoimmuneTest, "routinecultureandsensitive": CultureSensitivityTest,
                "womenpack": WomensPack, "occupationalprofile": OccupationalProfile,
                "otherstest": OthersTest, "xray": XRay, "ct": CTReport,
            }

            employee_data = {}

            # Fetch the latest record ON OR BEFORE the target date for each model
            for key, model_class in models_to_query.items():
                date_field = 'entry_date' if hasattr(model_class, 'entry_date') else 'date'
                filter_kwargs = {'aadhar': aadhar, f'{date_field}__lte': target_date_obj}
                instance = model_class.objects.filter(**filter_kwargs).order_by(f'-{date_field}', '-id').first()
                employee_data[key] = serialize_model_instance(instance) # Use helper for serialization

            logger.info(f"Fetched latest data on/before {date_str} for aadhar: {aadhar}")
            return JsonResponse({"data": employee_data}, safe=False, status=200) # safe=False needed for top-level dict

        except Exception as e:
            logger.exception(f"fetchVisitDataWithDate failed for aadhar {aadhar}, date {date_str}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    logger.warning(f"fetchVisitDataWithDate failed for aadhar {aadhar}: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)

@csrf_exempt
def update_employee_status(request):
    """Creates a NEW employee_details record for TODAY with updated status fields, based on the last known record."""
    if request.method == 'POST':
        aadhar = None # Initialize for logging
        try:
            data = json.loads(request.body)
            logger.debug(f"Received data for update_employee_status: {data}")

            aadhar = data.get('aadhar')
            employee_status_val = data.get('employee_status')
            date_since_str = data.get('date_since')
            transfer_details_val = data.get('transfer_details', '') # Default to empty
            other_reason_details_val = data.get('other_reason_details', '') # Default to empty

            if not aadhar or not employee_status_val or not date_since_str:
                logger.warning("update_employee_status failed: Missing aadhar, employee_status, or date_since.")
                return JsonResponse({'success': False, 'message': 'Please provide aadhar, employee_status and date_since.'}, status=400)

            date_since_obj = parse_date_internal(date_since_str)
            if not date_since_obj:
                logger.warning(f"update_employee_status failed for aadhar {aadhar}: Invalid date_since format.")
                return JsonResponse({'success': False, 'message': 'Invalid date_since format. Use YYYY-MM-DD.'}, status=400)

            # Find the most recent entry for this aadhar
            last_entry = employee_details.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').first()

            if not last_entry:
                 logger.warning(f"update_employee_status failed: Cannot create new entry as no previous record found for aadhar {aadhar}.")
                 # Option: Could create a minimal new record here if desired, but original logic needed a base.
                 return JsonResponse({'success': False, 'message': 'No previous employee record found to base the new status entry on.'}, status=404)

            # Create a new entry based on the last one, updating status fields
            new_entry_data = model_to_dict(last_entry, exclude=['id', 'pk', 'entry_date']) # Exclude keys, entry_date
            new_entry_data['entry_date'] = date.today() # Set to today
            new_entry_data['employee_status'] = employee_status_val
            new_entry_data['since_date'] = date_since_obj
            new_entry_data['transfer_details'] = transfer_details_val
            new_entry_data['other_reason_details'] = other_reason_details_val
            # Important: Reassign FileField/ImageField if copying is needed
            # model_to_dict doesn't handle files. Manually copy reference.
            new_entry_data['profilepic'] = last_entry.profilepic

            # Create the new record
            new_entry = employee_details.objects.create(aadhar=aadhar, **new_entry_data)
            logger.info(f"Created new status entry (ID: {new_entry.id}) for aadhar {aadhar} based on last entry (ID: {last_entry.id}).")
            return JsonResponse({'success': True, 'message': 'New status entry created successfully for today.'})

        except json.JSONDecodeError:
             logger.error("update_employee_status failed: Invalid JSON.", exc_info=True)
             return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            logger.exception(f"update_employee_status failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'success': False, 'message': 'An internal server error occurred.'}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)
        response['Allow'] = 'POST'
        return response


# --- Vitals & Investigations (Using Aadhar from payload) ---

@csrf_exempt
def add_vital_details(request):
    """Adds or updates vital details AND files based on AADHAR and today's date."""
    model_class = vitals
    log_prefix = "add_vital_details_multipart"
    success_noun = "Vital Details and Files"

    if request.method == "POST":
        aadhar = None
        mrd_no = None
        try:
            # Read non-file data from request.POST
            post_data = request.POST
            aadhar = post_data.get('aadhar')
            mrd_no = post_data.get('mrdNo') # Get MRD number
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required in POST data")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)
            # Added: Validate MRD if required by model constraints
            if not mrd_no: # Assuming mrdNo is required
                 logger.warning(f"{log_prefix} failed: MRD number is required in POST data")
                 return JsonResponse({"error": "MRD number (mrdNo) is required"}, status=400)


            # Filter POST data for allowed model fields (excluding keys and files)
            allowed_fields = {
                field.name for field in model_class._meta.get_fields()
                if field.concrete and not field.primary_key and not field.is_relation and field.editable
                   and field.name not in ['aadhar', 'entry_date', 'mrdNo', 'manual', 'fc', 'report', 'self_declared', 'application_form', 'consent'] # Exclude files and keys
            }
            filtered_data = {}
            for key in allowed_fields:
                value = post_data.get(key)
                # Handle empty strings -> None conversion if field allows null
                field_instance = model_class._meta.get_field(key)
                if value == '' and (field_instance.null or field_instance.blank):
                     filtered_data[key] = None
                elif value is not None:
                    # Attempt type conversion for numeric fields if needed (robustness)
                    if isinstance(field_instance, (FloatField, IntegerField)):
                        try:
                            if isinstance(field_instance, FloatField): filtered_data[key] = float(value)
                            else: filtered_data[key] = int(value)
                        except (ValueError, TypeError):
                             logger.warning(f"{log_prefix}: Could not convert field '{key}' value '{value}' to number for aadhar {aadhar}. Skipping.")
                             # Optionally return error or skip field
                    else:
                        filtered_data[key] = value

            # Perform update_or_create based on aadhar, mrdNo and date
            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date,
                mrdNo=mrd_no, # Added: Use mrdNo as part of the key
                defaults=filtered_data
            )

            # Handle File Uploads AFTER getting/creating the instance
            files_updated = False
            update_fields_for_save = [] # Track fields updated by files
            file_fields = ['manual', 'fc', 'report', 'self_declared', 'application_form', 'consent'] # List of file fields to check
            for field_name in file_fields:
                if field_name in request.FILES:
                    # Delete old file if exists before saving new one
                    old_file = getattr(instance, field_name, None)
                    if old_file and old_file.name:
                         if default_storage.exists(old_file.path):
                              try: default_storage.delete(old_file.path)
                              except Exception as del_err: logger.error(f"Error deleting old file {field_name} for vital ID {instance.pk}: {del_err}")

                    setattr(instance, field_name, request.FILES[field_name])
                    files_updated = True
                    update_fields_for_save.append(field_name)
                    logger.info(f"{log_prefix}: Updating file field '{field_name}' for vital ID {instance.pk}, aadhar {aadhar}")

            # Save the instance again ONLY if files were updated
            if files_updated:
                instance.save(update_fields=update_fields_for_save)
                logger.info(f"{log_prefix}: Saved vital instance {instance.pk} after file updates for aadhar {aadhar}")


            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. Files updated: {files_updated}. ID: {instance.pk}")
            return JsonResponse({"message": message, "created": created, "files_updated": files_updated, "id": instance.pk}, status=201 if created else 200)

        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)

    logger.warning(f"{log_prefix} failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method must be POST"}, status=405)

# --- Function to handle standard JSON-based add/update for investigation models ---
def _add_update_investigation(request, model_class, log_prefix, success_noun, requires_mrd=False):
    """ Generic handler for adding/updating investigation records using JSON payload. """
    if request.method == "POST":
        aadhar = None
        mrd_no = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            accessLevel = data.get('accessLevel')
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            key_fields = ['aadhar', 'entry_date']
            filter_kwargs = {'aadhar': aadhar, 'entry_date': entry_date}

            if requires_mrd:
                mrd_no = data.get('mrdNo')
                if not mrd_no:
                    logger.warning(f"{log_prefix} failed: MRD number required")
                    return JsonResponse({"error": "MRD number (mrdNo) is required"}, status=400)
                key_fields.append('mrdNo')
                filter_kwargs['mrdNo'] = mrd_no
            if accessLevel == "nurse":
                data["checked"] = True
            else:
                data["checked"] = False

            # Filter data for allowed fields, excluding keys
            allowed_fields = {f.name for f in model_class._meta.get_fields() if f.concrete and not f.primary_key and f.name not in key_fields}
            # Handle type conversion and None/empty string logic
            filtered_data = {}
            for key in allowed_fields:
                 if key in data:
                     value = data[key]
                     field_instance = model_class._meta.get_field(key)
                     if value == '' and (field_instance.null or field_instance.blank):
                          filtered_data[key] = None
                     elif value is not None:
                          # Basic type check/conversion for safety
                          if isinstance(field_instance, (FloatField, IntegerField)):
                               try:
                                   if isinstance(field_instance, FloatField): filtered_data[key] = float(value)
                                   else: filtered_data[key] = int(value)
                               except (ValueError, TypeError):
                                   logger.warning(f"{log_prefix}: Could not convert field '{key}' value '{value}' to number for aadhar {aadhar}. Skipping.")
                          elif isinstance(field_instance, DateField):
                               parsed_date = parse_date_internal(value)
                               if parsed_date: filtered_data[key] = parsed_date
                               else: logger.warning(f"{log_prefix}: Invalid date format for field '{key}' value '{value}'. Skipping.")
                          elif isinstance(field_instance, BooleanField):
                               # Handle boolean conversion robustly (e.g., from 'true'/'false', 0/1)
                               if isinstance(value, str): filtered_data[key] = value.lower() in ['true', '1', 'yes']
                               else: filtered_data[key] = bool(value)
                          else:
                               filtered_data[key] = value


            instance, created = model_class.objects.update_or_create(
                **filter_kwargs, defaults=filtered_data
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. ID: {instance.pk}")
            return JsonResponse({"message": message, "id": instance.pk}, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except IntegrityError as e:
            logger.error(f"{log_prefix} failed for aadhar {aadhar}: Integrity Error: {e}", exc_info=True)
            return JsonResponse({"error": "Data integrity error. Check for conflicts or constraints.", "detail": str(e)}, status=409) # 409 Conflict
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response

# --- Apply the generic handler to investigation views ---

@csrf_exempt
def add_haem_report(request):
    return _add_update_investigation(request, heamatalogy, "add_haem_report", "Haematology details",requires_mrd=True)

@csrf_exempt
def add_routine_sugar(request):
    return _add_update_investigation(request, RoutineSugarTests, "add_routine_sugar", "Routine Sugar Test details",requires_mrd=True)

@csrf_exempt
def add_renal_function(request): # Corrected name
    # This model requires MRD according to previous logic
    return _add_update_investigation(request, RenalFunctionTest, "add_renal_function", "Renal Function Test details", requires_mrd=True)

@csrf_exempt
def add_lipid_profile(request):
    # This model requires MRD according to previous logic
    return _add_update_investigation(request, LipidProfile, "add_lipid_profile", "Lipid Profile details", requires_mrd=True)

@csrf_exempt
def add_liver_function(request):
    # This model requires MRD according to previous logic
    return _add_update_investigation(request, LiverFunctionTest, "add_liver_function", "Liver Function Test details", requires_mrd=True)

@csrf_exempt
def add_thyroid_function(request):
     # This model requires MRD according to previous logic
    return _add_update_investigation(request, ThyroidFunctionTest, "add_thyroid_function", "Thyroid Function Test details", requires_mrd=True)

@csrf_exempt
def add_autoimmune_function(request):
    return _add_update_investigation(request, AutoimmuneTest, "add_autoimmune_function", "Autoimmune Test details",requires_mrd=True) # Assuming no MRD required

@csrf_exempt
def add_coagulation_function(request):
    return _add_update_investigation(request, CoagulationTest, "add_coagulation_function", "Coagulation Test details",requires_mrd=True) # Assuming no MRD required

@csrf_exempt
def add_enzymes_cardiac(request):
     # This model requires MRD according to previous logic
    return _add_update_investigation(request, EnzymesCardiacProfile, "add_enzymes_cardiac", "Enzymes Cardiac Profile details", requires_mrd=True)

@csrf_exempt
def add_urine_routine(request):
    return _add_update_investigation(request, UrineRoutineTest, "add_urine_routine", "Urine Routine Test details",requires_mrd=True) # Assuming no MRD required

@csrf_exempt
def add_serology(request):
    return _add_update_investigation(request, SerologyTest, "add_serology", "Serology Test details",required=True) #Assuming no MRD required

@csrf_exempt
def add_motion_test(request):
    return _add_update_investigation(request, MotionTest, "add_motion_test", "Motion Test details",required=True) #Assuming no MRD required

@csrf_exempt
def add_culturalsensitivity_function(request): # Corrected spelling: CultureSensitivity
    return _add_update_investigation(request, CultureSensitivityTest, "add_culturalsensitivity_function", "Culture Sensitivity Test details",required=True) #Assuming no MRD required

@csrf_exempt
def create_medical_history(request):
    # Medical History is slightly different (more complex JSON fields), keep separate for now
    model_class = MedicalHistory
    log_prefix = "create_medical_history"
    success_noun = "Medical history"
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            logger.debug(f"Received data for {log_prefix}: {json.dumps(data)[:500]}...")

            aadhar = data.get('aadhar')
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)

            # Map payload keys carefully, ensure JSON fields are handled
            defaults = {
                'personal_history': data.get('personal_history'), # Assumes valid JSON sent
                'medical_data': data.get('medical_data'),
                'female_worker': data.get('female_worker'),
                'surgical_history': data.get('surgical_history'),
                'family_history': data.get('family_history'),
                'health_conditions': data.get('health_conditions'),
                'allergy_fields': data.get('allergy_fields'),
                'allergy_comments': data.get('allergy_comments', ''), # Default empty string
                'children_data': data.get('children_data'),
                'spouse_data': data.get('spouse_data'),
                'conditions': data.get('conditions'),
                'emp_no': data.get('emp_no'), # Store if present
                'mrdNo': data.get('mrdNo'),
                
            }
            print(defaults)
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            medical_history, created = model_class.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date,
                defaults=filtered_defaults
            )

            message = f"{success_noun} {'created' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar: {aadhar}. Created: {created}")
            return JsonResponse({"message": message, "id": medical_history.pk}, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except ValidationError as e:
            logger.error(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: Validation error: {e.message_dict}", exc_info=True)
            return JsonResponse({"error": "Validation Error", 'details': e.message_dict}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
    else:
        response = JsonResponse({"error": "Only POST requests are allowed"}, status=405)
        response['Allow'] = 'POST'
        return response


@csrf_exempt
def add_mens_pack(request):
    return _add_update_investigation(request, MensPack, "add_mens_pack", "Mens Pack details") # Assuming no MRD

@csrf_exempt
def add_womens_function(request):
    return _add_update_investigation(request, WomensPack, "add_womens_function", "Women's pack details") # Assuming no MRD

@csrf_exempt
def add_occupationalprofile_function(request):
    return _add_update_investigation(request, OccupationalProfile, "add_occupationalprofile_function", "Occupational Profile details") # Assuming no MRD

@csrf_exempt
def add_otherstest_function(request):
    return _add_update_investigation(request, OthersTest, "add_otherstest_function", "Others Test details") # Assuming no MRD

@csrf_exempt
def add_ophthalmic_report(request): # Corrected spelling
    return _add_update_investigation(request, OphthalmicReport, "add_ophthalmic_report", "Ophthalmic Report details") # Assuming no MRD

@csrf_exempt
def add_usg_report(request):
    return _add_update_investigation(request, USGReport, "add_usg_report", "USG Report details") # Assuming no MRD

@csrf_exempt
def add_mri_report(request):
    return _add_update_investigation(request, MRIReport, "add_mri_report", "MRI Report details") # Assuming no MRD

@csrf_exempt
def add_xray_function(request):
    return _add_update_investigation(request, XRay, "add_xray_function", "XRay details") # Assuming no MRD

@csrf_exempt
def add_ct_function(request):
    return _add_update_investigation(request, CTReport, "add_ct_function", "CT Report details") # Assuming no MRD

@csrf_exempt
def insert_vaccination(request):
    """Inserts or updates vaccination record based on AADHAR and today's date."""
    # Slightly different structure (JSON field primary data)
    model_class = VaccinationRecord
    log_prefix = "insert_vaccination"
    success_noun = "Vaccination record"
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            vaccination_data = data.get("vaccination") # Expect the JSON/dict data
            entry_date = date.today()
            mrdNo = data.get('mrdNo')
            if not aadhar or vaccination_data is None: # Allow empty list for vaccination data
                logger.warning(f"{log_prefix} failed: aadhar and vaccination fields are required")
                return JsonResponse({"error": "Aadhar (aadhar) and vaccination data are required"}, status=400)

            # CHANGED: Add mrdNo to the dictionary of fields to be saved/updated.
            filtered_data = {'vaccination': vaccination_data, 'emp_no': data.get('emp_no',"null"), 'mrdNo': mrdNo}

            # CHANGED: Remove mrdNo from the lookup parameters. The record is uniquely identified by aadhar and entry_date.
            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_data
            )
            message = f"{success_noun} {'saved' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. ID: {instance.pk}")
            response_data = model_to_dict(instance)
            response_data['entry_date'] = instance.entry_date.isoformat() # Format date
            return JsonResponse({
                "message": message,
                "created": created,
                "record": response_data,
                "id": instance.pk
            }, status=201 if created else 200)
        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response

def fetch_vaccinations(request, aadhar):
    """Fetches vaccination records, optionally filtered by AADHAR."""
    if request.method == "GET":
        aadhar_filter = aadhar
        print(aadhar)
        try:
            queryset = VaccinationRecord.objects.all()
            if aadhar_filter:
                queryset = queryset.filter(aadhar=aadhar_filter)
                
            records = list(queryset.order_by('-entry_date', '-id').values())
            for record in records:
                print(record)
                if isinstance(record.get('entry_date'), date):
                    record['entry_date'] = record['entry_date'].isoformat()

            logger.info(f"Fetched {len(records)} vaccination records." + (f" Filtered by aadhar: {aadhar_filter}" if aadhar_filter else ""))
            return JsonResponse({"vaccinations": records}, safe=False)
        except Exception as e:
            logger.exception("fetch_vaccinations failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

import json
import logging
from datetime import date
from dateutil.relativedelta import relativedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.db import IntegrityError
# Make sure to import all your relevant models
from .models import Consultation, FitnessAssessment, Dashboard 

logger = logging.getLogger(__name__)

# This is the view from your previous code, included for context. No changes here.
@csrf_exempt
def add_consultation(request):
    # ... (code for add_consultation remains the same)
    pass


# ==============================================================================
# CORRECTED FITNESS TEST VIEW
# ==============================================================================
@csrf_exempt
def fitness_test(request):
    """Adds or updates fitness assessment data based on AADHAR, MRD number and today's date."""
    model_class = FitnessAssessment
    log_prefix = "fitness_test"
    success_noun = "Fitness test details"

    if request.method == "POST":
        aadhar = None
        mrd_no = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            mrd_no = data.get('mrdNo')
            accessLevel = data.get('accessLevel')
            # Assuming your BaseModel provides an entry_date field on creation
            entry_date = date.today()

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({"error": "Aadhar number (aadhar) is required"}, status=400)
            if not mrd_no:
                logger.warning(f"{log_prefix} failed: MRD required")
                return JsonResponse({"error": "MRD number (mrdNo) is required"}, status=400)

            validity_date = entry_date + relativedelta(months=6)

            def parse_json_field(field_data):
                if isinstance(field_data, list): return field_data
                if isinstance(field_data, str):
                    try: return json.loads(field_data) if field_data else []
                    except json.JSONDecodeError: return []
                return []

            # Prepare defaults dictionary with keys matching the FitnessAssessment model fields EXACTLY
            if accessLevel == "nurse":
                defaults = {
                    'emp_no': data.get("emp_no"),
                    'aadhar': data.get("aadhar"),
                    'employer': data.get("employer"),
                    'submittedNurse': data.get("submittedDoctor"),
                    'mrdNo': data.get("mrdNo"),
                    'bookedDoctor': data.get("bookedDoctor"),

                    # Basic Tests
                    'tremors': data.get("tremors"), 'romberg_test': data.get("romberg_test"),
                    'acrophobia': data.get("acrophobia"), 'trendelenberg_test': data.get("trendelenberg_test"),
                    'CO_dizziness': data.get("CO_dizziness"), 'MusculoSkeletal_Movements': data.get("MusculoSkeletal_Movements"),
                    'Claustrophobia': data.get("Claustrophobia"), 'Tandem': data.get("Tandem"),
                    'Nystagmus_Test': data.get("Nystagmus_Test"), 'Dysdiadochokinesia': data.get("Dysdiadochokinesia"),
                    'Finger_nose_test': data.get("Finger_nose_test"), 'Psychological_PMK': data.get("Psychological_PMK"),
                    'Psychological_zollingar': data.get("Psychological_zollingar"),

                    # Job & Fitness Status
                    'job_nature': parse_json_field(data.get("job_nature")),
                    'overall_fitness': data.get("overall_fitness"),
                    'conditional_fit_feilds': parse_json_field(data.get("conditional_fit_feilds")), # Key matches model typo

                    # --- CORRECTED KEYS ---
                    # Changed keys from snake_case to camelCase to match the model definition
                    'otherJobNature': data.get("other_job_nature"), 
                    'conditionalotherJobNature': data.get("conditional_other_job_nature"),

                    'special_cases': data.get('special_cases'),

                    # Examinations
                    'general_examination': data.get("general_examination"),
                    'systematic_examination': data.get("systematic_examination"),
                    'eye_exam_fit_status': data.get("eye_exam_fit_status"),
                    
                    # Comments & Validity
                    'comments': data.get("comments"),
                    'validity': validity_date,

                    # Follow-up History
                    'follow_up_mrd_history': data.get('follow_up_mrd_history', []),
                }
            elif accessLevel == "doctor":
                defaults = {
                    'emp_no': data.get("emp_no"),
                    'aadhar': data.get("aadhar"),
                    'employer': data.get("employer"),
                    'submittedDoctor': data.get("submittedDoctor"),
                    'mrdNo': data.get("mrdNo"),

                    # Basic Tests
                    'tremors': data.get("tremors"), 'romberg_test': data.get("romberg_test"),
                    'acrophobia': data.get("acrophobia"), 'trendelenberg_test': data.get("trendelenberg_test"),
                    'CO_dizziness': data.get("CO_dizziness"), 'MusculoSkeletal_Movements': data.get("MusculoSkeletal_Movements"),
                    'Claustrophobia': data.get("Claustrophobia"), 'Tandem': data.get("Tandem"),
                    'Nystagmus_Test': data.get("Nystagmus_Test"), 'Dysdiadochokinesia': data.get("Dysdiadochokinesia"),
                    'Finger_nose_test': data.get("Finger_nose_test"), 'Psychological_PMK': data.get("Psychological_PMK"),
                    'Psychological_zollingar': data.get("Psychological_zollingar"),

                    # Job & Fitness Status
                    'job_nature': parse_json_field(data.get("job_nature")),
                    'overall_fitness': data.get("overall_fitness"),
                    'conditional_fit_feilds': parse_json_field(data.get("conditional_fit_feilds")), # Key matches model typo

                    # --- CORRECTED KEYS ---
                    # Changed keys from snake_case to camelCase to match the model definition
                    'otherJobNature': data.get("other_job_nature"), 
                    'conditionalotherJobNature': data.get("conditional_other_job_nature"),

                    'special_cases': data.get('special_cases'),

                    # Examinations
                    'general_examination': data.get("general_examination"),
                    'systematic_examination': data.get("systematic_examination"),
                    'eye_exam_fit_status': data.get("eye_exam_fit_status"),
                    
                    # Comments & Validity
                    'comments': data.get("comments"),
                    'validity': validity_date,

                    # Follow-up History
                    'follow_up_mrd_history': data.get('follow_up_mrd_history', []),
                }

            print(data)
            # Filter out any keys that were not provided in the request
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            # --- Update Dashboard visitOutcome (Side effect) ---
            overall_fitness_status = data.get("overall_fitness")
            if overall_fitness_status:
                 try:
                     dashboard_entry = Dashboard.objects.filter(aadhar=aadhar, date=entry_date).first()
                     if dashboard_entry:
                          dashboard_entry.visitOutcome = overall_fitness_status
                          dashboard_entry.save(update_fields=['visitOutcome'])
                          logger.info(f"Dashboard visitOutcome updated to '{overall_fitness_status}' for aadhar: {aadhar} on {entry_date}")
                 except Exception as db_e:
                      logger.error(f"Error updating Dashboard outcome for aadhar {aadhar}: {db_e}", exc_info=True)

            # --- Update or Create Fitness Assessment ---
            # Using aadhar and entry_date as unique identifiers for the record
            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date, # Assumes BaseModel provides this field
                defaults=filtered_defaults
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. ID: {instance.pk}")
            return JsonResponse({"message": message, "id": instance.pk}, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response


# your_app/views.py

import json
import logging
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import Consultation 
# (Assuming parse_date_internal is a helper you have defined elsewhere)
# from .utils import parse_date_internal 

# A simple placeholder if you don't have this utility
def parse_date_internal(date_str):
    if not date_str:
        return None
    try:
        return date.fromisoformat(date_str.split('T')[0])
    except (ValueError, AttributeError):
        return None

logger = logging.getLogger(__name__)

@csrf_exempt
def add_consultation(request):
    """Adds or updates consultation data based on AADHAR and today's date."""
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            logger.debug(f"Received data for consultation: {json.dumps(data)[:500]}...")
            
            aadhar = data.get('aadhar')
            entry_date = date.today()
            accessLevel = data.get('accessLevel') 
            if not aadhar or not accessLevel:
                logger.warning("add_consultation failed: Aadhar required")
                return JsonResponse({'status': 'error', 'message': 'Aadhar number (aadhar) is required'}, status=400)

            if accessLevel == "doctor":
                defaults = {
                    'complaints': data.get('complaints'), 'examination': data.get('examination'),
                    'systematic': data.get('systematic'), 'lexamination': data.get('lexamination'),
                    'diagnosis': data.get('diagnosis'), 'procedure_notes': data.get('procedure_notes'),
                    'obsnotes': data.get('obsnotes'), 'investigation_details': data.get('investigation_details'),
                    'advice': data.get('advice'), 'follow_up_date': parse_date_internal(data.get('follow_up_date')),
                    'case_type': data.get('case_type'), 'illness_or_injury': data.get('illness_or_injury'),
                    'other_case_details': data.get('other_case_details'), 'notifiable_remarks': data.get('notifiable_remarks'),
                    'referral': data.get('referral'),
                    'hospital_name': data.get('hospital_name') if data.get('referral') == 'yes' else None,
                    'speciality': data.get('speciality') if data.get('referral') == 'yes' else None,
                    'doctor_name': data.get('doctor_name') if data.get('referral') == 'yes' else None,
                    'shifting_required': data.get('shifting_required'),
                    'shifting_notes': data.get('shifting_notes') if data.get('shifting_required') == 'yes' else None,
                    'ambulance_details': data.get('ambulance_details') if data.get('shifting_required') == 'yes' else None,
                    'special_cases': data.get('special_cases'),
                    'submittedDoctor': data.get("submittedDoctor"),
                    'emp_no': data.get('emp_no'),
                    'mrdNo': data.get('mrdNo'),
                    'follow_up_mrd_history': data.get('follow_up_mrd_history', []) 
                }
            else:
                defaults = {
                    'submittedNurse': data.get("submittedDoctor"),
                    'bookedDoctor': data.get("bookerDoctor"),
                    'emp_no': data.get('emp_no'),
                    'mrdNo': data.get('mrdNo'),
                    'submittedNurse': data.get("submittedDoctor"),
                    'bookedDoctor': data.get("bookedDoctor"),
                    'follow_up_mrd_history': data.get('follow_up_mrd_history', []) 
                }
            
            # The existing logic to filter out None values works perfectly here
            filtered_defaults = {k: v for k, v in defaults.items() if v is not None}

            # Use update_or_create to find a record by aadhar and today's date
            # and update it with the new data, or create a new one.
            instance, created = Consultation.objects.update_or_create(
                aadhar=aadhar,
                entry_date=entry_date,
                defaults=filtered_defaults
            )

            message = f"Consultation {'added' if created else 'updated'} successfully"
            logger.info(f"Consultation successful for aadhar {aadhar}. Created: {created}. ID: {instance.id}")
            return JsonResponse({
                'status': 'success', 'message': message,
                'consultation_id': instance.id, 'created': created
            }, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error("add_consultation failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
        except ValidationError as e:
            logger.error(f"add_consultation failed for aadhar {aadhar or 'Unknown'}: Validation error: {e.message_dict}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Validation Error', 'details': e.message_dict}, status=400)
        except IntegrityError as e:
             logger.error(f"add_consultation failed for aadhar {aadhar or 'Unknown'}: Integrity error: {e}", exc_info=True)
             return JsonResponse({'status': 'error', 'message': 'Database integrity error.'}, status=409)
        except Exception as e:
            logger.exception(f"add_consultation failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.', 'detail': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use POST.'}, status=405)

@csrf_exempt
def add_significant_notes(request):
    """Adds or updates significant notes based on AADHAR and today's date."""
    model_class = SignificantNotes
    log_prefix = "add_significant_notes"
    success_noun = "Significant Notes"
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            aadhar = data.get('aadhar')
            entry_date = date.today()
            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar required")
                return JsonResponse({'status': 'error', 'message': 'Aadhar number (aadhar) is required'}, status=400)

            defaults = {
                'healthsummary': data.get('healthsummary'), 'remarks': data.get('remarks'),
                'communicable_disease': data.get('communicable_disease'),
                'incident_type': data.get('incident_type'), 'incident': data.get('incident'),
                'illness_type': data.get('illness_type'),
                'emp_no': data.get('emp_no') # Store if provided
                # Add submitted_by if needed
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
                         logger.info(f"Dashboard visitOutcome updated via Sig Notes for aadhar: {aadhar} on {entry_date}")
                 except Exception as db_e:
                      logger.error(f"Error updating Dashboard outcome from Sig Notes for aadhar {aadhar}: {db_e}", exc_info=True)

            instance, created = model_class.objects.update_or_create(
                aadhar=aadhar, entry_date=entry_date, defaults=filtered_defaults
            )
            message = f"{success_noun} {'added' if created else 'updated'} successfully"
            logger.info(f"{log_prefix} successful for aadhar {aadhar}. Created: {created}. ID: {instance.pk}")
            return JsonResponse({
                'status': 'success', 'message': message, 'significant_note_id': instance.id
            }, status=201 if created else 200)
        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.', 'detail': str(e)}, status=500)
    else:
        response = JsonResponse({'status': 'error', 'message': 'Invalid request method. Use POST.'}, status=405)
        response['Allow'] = 'POST'
        return response

@csrf_exempt
def get_notes(request, aadhar):
    """Fetches significant notes and the LATEST employee status based on AADHAR."""
    if request.method == 'GET': # Use GET
        try:
            # Fetch notes for the specific aadhar
            notes = list(SignificantNotes.objects.filter(aadhar=aadhar).order_by('-entry_date', '-id').values())
            for note in notes:
                if isinstance(note.get('entry_date'), date):
                    note['entry_date'] = note['entry_date'].isoformat()

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

            logger.info(f"Fetched {len(notes)} notes and status for aadhar {aadhar}.")
            return JsonResponse({'notes': notes, 'status': emp_status_data}) # Return notes list and single status object
        except Exception as e:
            logger.exception(f"get_notes failed for aadhar {aadhar}: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

# --- Forms ---
# Generic form creation handler
def _create_form(request, model_class, form_name, required_fields=None):
    log_prefix = f"create_{form_name.lower().replace(' ', '')}"
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            logger.debug(f"Received {form_name} Data: {json.dumps(data)[:500]}...")

            aadhar = data.get('aadhar')
            entry_date = date.today() # Record creation date

            if not aadhar:
                logger.warning(f"{log_prefix} failed: Aadhar number is required.")
                return JsonResponse({'error': 'Aadhar number (aadhar) is required'}, status=400)

            # Basic check for required fields if provided
            if required_fields:
                 missing = [f for f in required_fields if data.get(f) is None]
                 if missing:
                      return JsonResponse({'error': f"Missing required fields for {form_name}: {', '.join(missing)}"}, status=400)

            # Prepare form data based on model fields, handling potential type conversions
            form_data = {'aadhar': aadhar, 'entry_date': entry_date}
            for field in model_class._meta.get_fields():
                 if field.concrete and not field.auto_created and field.name not in ['id', 'aadhar', 'entry_date']:
                     payload_key = field.name # Assume payload key matches model field name for simplicity here
                     # Or use a mapping if keys differ significantly
                     if payload_key in data:
                         value = data[payload_key]
                         # Basic type handling
                         if isinstance(field, DateField):
                              form_data[field.name] = parse_date_internal(value)
                         elif isinstance(field, IntegerField):
                              form_data[field.name] = parse_form_age(value) # Use age parser for integers
                         elif isinstance(field, BooleanField):
                              if isinstance(value, str): form_data[field.name] = value.lower() in ['true', '1', 'yes']
                              else: form_data[field.name] = bool(value)
                         elif value is not None: # Add other non-None values
                              form_data[field.name] = value
                         # Handle potential None values for nullable fields correctly (already done by not adding if None)

            # Create a new form instance
            form = model_class(**form_data)
            form.full_clean() # Validate model fields
            form.save()

            logger.info(f"{form_name} created successfully for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully', 'id': form.pk}, status=201)

        except json.JSONDecodeError:
            logger.error(f"{log_prefix} failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            logger.error(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: Validation Error: {e.message_dict}", exc_info=True)
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
            return JsonResponse({'error': "An internal server error occurred.", 'detail': str(e)}, status=500)
    else:
         response = JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
         response['Allow'] = 'POST'
         return response

# Apply the generic handler
@csrf_exempt
def create_form17(request):
    return _create_form(request, Form17, "Form 17")

@csrf_exempt
def create_form38(request):
    return _create_form(request, Form38, "Form 38")

@csrf_exempt
def create_form39(request):
    return _create_form(request, Form39, "Form 39")

@csrf_exempt
def create_form40(request):
    return _create_form(request, Form40, "Form 40")

@csrf_exempt
def create_form27(request):
    # Form 27 might have slightly different date handling if 'date' refers to form date vs entry date
    # Keeping its specific logic for now, but could be adapted to _create_form
    model_class = Form27
    log_prefix = "create_form27"
    form_name = "Form 27"
    if request.method == 'POST':
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8'))
            aadhar = data.get('aadhar')
            entry_date = date.today() # Date the record is created in DB
            form_date = parse_date_internal(data.get('date')) # The date field *on* the form

            if not aadhar: return JsonResponse({'error': 'Aadhar required'}, status=400)

            form_data = {
                'aadhar': aadhar, 'entry_date': entry_date,
                'serialNumber': data.get('serialNumber'),
                'date': form_date, # Use parsed form date for the 'date' field
                'department': data.get('department'), 'nameOfWorks': data.get('nameOfWorks'),
                'sex': data.get('sex'), 'dateOfBirth': parse_date_internal(data.get('dateOfBirth')),
                'age': parse_form_age(data.get('age')), 'nameOfTheFather': data.get('nameOfTheFather'),
                'natureOfJobOrOccupation': data.get('natureOfJobOrOccupation'),
                'signatureOfFMO': data.get('signatureOfFMO'), 'descriptiveMarks': data.get('descriptiveMarks'),
                'signatureOfCertifyingSurgeon': data.get('signatureOfCertifyingSurgeon'),
                'emp_no': data.get('emp_no') # Assuming exists
            }
            # Filter None values before creating
            filtered_form_data = {k:v for k,v in form_data.items() if v is not None}

            form = model_class.objects.create(**filtered_form_data)
            # form.full_clean() # Consider validating before create if needed, create handles basic constraints
            # form.save() # create already saves
            logger.info(f"{form_name} created for aadhar {aadhar}. ID: {form.pk}")
            return JsonResponse({'message': f'{form_name} created successfully', 'id': form.pk}, status=201)
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e: return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            logger.exception(f"{log_prefix} failed for aadhar {aadhar or 'Unknown'}: {e}")
            return JsonResponse({'error': "Server error.", 'detail': str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Only POST allowed'}, status=405)
        response['Allow'] = 'POST'
        return response


# --- Appointments ---
#---  MedicalCertificate ---
from .models import MedicalCertificate
logger = logging.getLogger(__name__)

# --- Helper Function for Parsing Dates ---
# This is a robust way to handle dates that might be missing or in the wrong format.
def parse_date_internal(date_str):
    """Safely parses a date string (YYYY-MM-DD) into a date object."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        logger.warning(f"Could not parse date string: '{date_str}'")
        return None




#---  alcohol_form  ---

from .models import alcohol_form, employee_details # Import the necessary models
import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import alcohol_form, employee_details # Import your models

# Set up a logger
logger = logging.getLogger(__name__)

def parse_date_internal(date_str):
    if not date_str: return None
    try: return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError): return None

@csrf_exempt
def add_alcohol_form_data(request):
   
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)

    
    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_alcohol_form_data: {json.dumps(data)[:500]}...")
        print(data)
        mrdNo = data.get('mrdNo')
        form_date_str = data.get('date')
        aadhar = data.get('aadhar')

        if not mrdNo or not form_date_str:
            return JsonResponse({"error": "MRD Number (mrdNo) and form date (date) are required."}, status=400)

        form_date = parse_date_internal(form_date_str)
        if not form_date:
            return JsonResponse({"error": "Invalid format for date. Use YYYY-MM-DD."}, status=400)

        try:
            employee_instance = employee_details.objects.filter(aadhar=aadhar).first()        
        except employee_details.DoesNotExist:
            logger.warning(f"Employee with aadhar no. '{aadhar}' not found.")
            return JsonResponse({"error": f"Employee with aadhar '{aadhar}' not found."}, status=404)

        # --- THE KEY FIX: Map frontend camelCase keys to backend snake_case model fields ---
        key_map = {
            'alcoholBreathSmell': 'alcohol_breath_smell',
            'speech': 'speech',
            'drynessOfMouth': 'dryness_of_mouth',
            'drynessOfLips': 'dryness_of_lips',
            'cnsPupilReaction': 'cns_pupil_reaction',
            'handTremors': 'hand_tremors',
            'alcoholAnalyzerStudy': 'alcohol_analyzer_study',
            'remarks': 'remarks',
            'advice': 'advice',
            'aadhar': 'aadhar',
            'mrdNo' : 'mrdNo'
        }

        # Build the defaults dictionary for the database using the map
        form_defaults = {}
        for frontend_key, backend_key in key_map.items():
            value = data.get(frontend_key)
            # Only add the key if the value is present and not an empty string
            if value is not None and str(value).strip() != '':
                form_defaults[backend_key] = value

        # If no data fields were provided, there's nothing to update.
        if not form_defaults:
             return JsonResponse({"error": "No data provided to save."}, status=400)

        # Use update_or_create with the correctly mapped data
        record, created = alcohol_form.objects.update_or_create(
            employee=employee_instance,
            entry_date = timezone.now().date(),
            mrdNo = mrdNo,
            defaults=form_defaults
        )

        message = "Alcohol Form data added successfully" if created else "Alcohol Form data updated successfully"
        logger.info(f"{message} for aadhar: {aadhar} on date: {form_date}")

        return JsonResponse({
            "message": message,
            "id": record.id,
            "aadhar": aadhar,
            "date": form_date.isoformat(),
        }, status=201 if created else 200)

    except json.JSONDecodeError:
        logger.error("add_alcohol_form_data failed: Invalid JSON received.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"add_alcohol_form_data failed for aadhar {aadhar or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)
#---  alcohol_form end ---

#-- getting alcohol abuse form 
# Add this import at the top of your views.py if it's not already there
from django.utils import timezone
from .models import alcohol_form # Make sure this is imported

# ... keep your existing add_alcohol_form_data view ...

@csrf_exempt
def get_alcohol_form_data(request):
    """
    Fetches the most recent alcohol form data for a given patient (by Aadhar).
    """
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    aadhar = request.GET.get('aadhar')
    if not aadhar:
        return JsonResponse({"error": "Aadhar number parameter is required."}, status=400)

    try:
        # Find the most recent record for this patient
        # We assume the latest entry by 'entry_date' is the one to show
        latest_record = alcohol_form.objects.filter(aadhar=aadhar).order_by('-entry_date').first()

        if not latest_record:
            # It's not an error if no record exists, just return an empty object
            # The frontend will interpret this as "no data to show".
            return JsonResponse({}, status=200)

        # IMPORTANT: Convert backend snake_case fields to frontend camelCase keys
        data_to_return = {
            'alcoholBreathSmell': latest_record.alcohol_breath_smell,
            'speech': latest_record.speech,
            'drynessOfMouth': latest_record.dryness_of_mouth,
            'drynessOfLips': latest_record.dryness_of_lips,
            'cnsPupilReaction': latest_record.cns_pupil_reaction,
            'handTremors': latest_record.hand_tremors,
            'alcoholAnalyzerStudy': latest_record.alcohol_analyzer_study,
            'remarks': latest_record.remarks,
            'advice': latest_record.advice,
        }
        
        # Filter out any keys that have None or empty values if you prefer
        # a cleaner response, but returning them is fine too.
        # data_to_return = {k: v for k, v in data_to_return.items() if v is not None and v != ''}

        return JsonResponse(data_to_return, status=200)

    except Exception as e:
        logger.exception(f"get_alcohol_form_data failed for aadhar {aadhar}: {e}")
        return JsonResponse({"error": "An internal server error occurred while fetching alcohol data."}, status=500)


# medical certificate form
import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MedicalCertificate # Make sure to import your model

# It's good practice to get the logger for the current module
logger = logging.getLogger(__name__)

def parse_date_internal(date_str):
    """Helper to safely parse date strings from frontend."""
    if not date_str:
        return None
    try:
        # Assumes YYYY-MM-DD format from HTML date inputs
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return None

@csrf_exempt
def add_or_update_medical_certificate(request):
    """
    View to create or update a MedicalCertificate record from a JSON payload.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for medical certificate: {json.dumps(data)[:500]}...")
        print(data)
        mrdNo = data.get('mrdNo')
        
        # --- Essential validation ---
        if not mrdNo:
            return JsonResponse({"error": "MRD Number (mrdNo) is required."}, status=400)

            
        # This map translates frontend camelCase keys to backend model field names.
        # It's crucial for fields that don't match, like 'sp02' vs 'spo2'.
        key_map = {
            'mrdNo': 'mrdNo',
            'aadhar': 'aadhar',
            'employeeName': 'employeeName',
            'age': 'age',
            'sex': 'sex',
            'empNo': 'empNo',
            'department': 'department',
            'date': 'date', # This will be replaced by the parsed date object
            'jswContract': 'jswContract',
            'natureOfWork': 'natureOfWork',
            'covidVaccination': 'covidVaccination',
            'diagnosis': 'diagnosis',
            'leaveFrom': 'leaveFrom',
            'leaveUpTo': 'leaveUpTo',
            'daysLeave': 'daysLeave',
            'rejoiningDate': 'rejoiningDate',
            'shift': 'shift',
            'pr': 'pr',
            'sp02': 'spo2',  # Key translation: frontend 'sp02' maps to model 'spo2'
            'temp': 'temp',
            'certificateFrom': 'certificateFrom',
            'note': 'note',
            'ohcStaffSignature': 'ohcStaffSignature',
            'individualSignature': 'individualSignature',
        }

        form_defaults = {}
        for frontend_key, backend_key in key_map.items():
            value = data.get(frontend_key)
            # Only add the key if the value is not None and not an empty string
            # This prevents overwriting existing data with empty values
            if value is not None and str(value).strip() != '':
                # Handle date fields specifically
                if backend_key in ['date', 'leaveFrom', 'leaveUpTo', 'rejoiningDate']:
                    parsed_value = parse_date_internal(value)
                    if parsed_value:
                        form_defaults[backend_key] = parsed_value
                else:
                    form_defaults[backend_key] = value
        
        # The main date for the record must be present
        form_defaults['date'] = timezone.now().date()

        if not form_defaults:
             return JsonResponse({"error": "No data provided to save."}, status=400)
             
        # Use update_or_create to find a record by mrdNo and date,
        # then either update it with new data or create it if it doesn't exist.
        record, created = MedicalCertificate.objects.update_or_create(
            mrdNo=mrdNo,
            date=timezone.now().date(),
            defaults=form_defaults
        )

        message = "Medical Certificate added successfully" if created else "Medical Certificate updated successfully"
        logger.info(f"{message} for mrdNo: {mrdNo} on date: {timezone.now().date()}")

        return JsonResponse({
            "message": message,
            "id": record.id,
            "mrdNo": mrdNo,
            "date": timezone.now().date().isoformat(),
        }, status=201 if created else 200)

    except json.JSONDecodeError:
        logger.error("add_or_update_medical_certificate failed: Invalid JSON received.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"add_or_update_medical_certificate failed for data: {data.get('mrdNo', 'Unknown')}. Error: {str(e)}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)

# getting medical certificate form 
import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import MedicalCertificate # Import your model

# personal leave certificate form getting and storing

import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import PersonalLeaveCertificate

# --- Setup (no changes needed here) ---
logger = logging.getLogger(__name__)

def parse_date_internal(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return None

# --- VIEW 1: Get Existing Data (This view is correct) ---
@csrf_exempt
def get_personal_leave_data(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)
    aadhar = request.GET.get('aadhar')
    if not aadhar:
        return JsonResponse({"error": "Aadhar parameter is required."}, status=400)
    try:
        latest_record = PersonalLeaveCertificate.objects.filter(aadhar=aadhar).order_by('-id').first()
        if not latest_record:
            return JsonResponse({}, status=200)
        data_to_return = {
            'employeeName': latest_record.employeeName, 'age': latest_record.age,
            'sex': latest_record.sex, 'date': latest_record.date.isoformat() if latest_record.date else None,
            'empNo': latest_record.empNo, 'department': latest_record.department,
            'jswContract': latest_record.jswContract, 'natureOfWork': latest_record.natureOfWork,
            'hasSurgicalHistory': latest_record.hasSurgicalHistory, 'covidVaccination': latest_record.covidVaccination,
            'personalLeaveDescription': latest_record.personalLeaveDescription,
            'leaveFrom': latest_record.leaveFrom.isoformat() if latest_record.leaveFrom else None,
            'leaveUpTo': latest_record.leaveUpTo.isoformat() if latest_record.leaveUpTo else None,
            'daysLeave': latest_record.daysLeave,
            'rejoiningDate': latest_record.rejoiningDate.isoformat() if latest_record.rejoiningDate else None,
            'bp': latest_record.bp, 'pr': latest_record.pr, 'spo2': latest_record.spo2,
            'temp': latest_record.temp, 'note': latest_record.note,
            'ohcStaffSignature': latest_record.ohcStaffSignature, 'individualSignature': latest_record.individualSignature,
        }
        return JsonResponse(data_to_return, status=200)
    except Exception as e:
        logger.exception(f"get_personal_leave_data failed for aadhar {aadhar}: {e}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)


# --- VIEW 2: Save Data (This is the corrected version) ---
@csrf_exempt
def save_personal_leave_data(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        mrdNo = data.get('mrdNo')
        aadhar = data.get('aadhar')

        if not mrdNo or not aadhar:
            return JsonResponse({"error": "MRD Number and Aadhar are required."}, status=400)
            
        certificate_date = parse_date_internal(data.get('date')) or timezone.now().date()

        # Prepare a dictionary of defaults from the payload
        defaults = {
            'mrdNo': mrdNo, 'aadhar': aadhar, 'employeeName': data.get('employeeName'),
            'sex': data.get('sex'), 'empNo': data.get('empNo'),
            'department': data.get('department'), 'jswContract': data.get('jswContract'),
            'natureOfWork': data.get('natureOfWork'), 'hasSurgicalHistory': data.get('hasSurgicalHistory'),
            'covidVaccination': data.get('covidVaccination'), 'personalLeaveDescription': data.get('personalLeaveDescription'),
            'bp': data.get('bp'), 'pr': data.get('pr'), 'spo2': data.get('spo2'),
            'temp': data.get('temp'), 'note': data.get('note'),
            'ohcStaffSignature': data.get('ohcStaffSignature'), 'individualSignature': data.get('individualSignature'),
        }

        # --- THE KEY FIX IS HERE ---
        # Handle integer fields safely: convert only if they are not empty strings.
        age_val = data.get('age')
        if age_val: # This checks for both not None and not empty string
            defaults['age'] = age_val

        daysLeave_val = data.get('daysLeave')
        if daysLeave_val:
            defaults['daysLeave'] = daysLeave_val
            
        # Handle date fields safely
        defaults['date'] = parse_date_internal(data.get('date'))
        defaults['leaveFrom'] = parse_date_internal(data.get('leaveFrom'))
        defaults['leaveUpTo'] = parse_date_internal(data.get('leaveUpTo'))
        defaults['rejoiningDate'] = parse_date_internal(data.get('rejoiningDate'))
        
        # Filter out any keys that have a value of None.
        # Now, empty strings for integer fields are already excluded.
        defaults = {k: v for k, v in defaults.items() if v is not None}

        # Use update_or_create to handle both new and existing records
        record, created = PersonalLeaveCertificate.objects.update_or_create(
            aadhar=aadhar,
            date=certificate_date,
            defaults=defaults
        )

        message = "Personal Leave Certificate saved successfully" if created else "Personal Leave Certificate updated successfully"
        return JsonResponse({"message": message, "id": record.id}, status=201 if created else 200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data received."}, status=400)
    except Exception as e:
        # This will log the exact error to your Django console for future debugging.
        logger.exception(f"Error saving personal leave certificate for aadhar {data.get('aadhar', 'Unknown')}")
        return JsonResponse({"error": "An internal server error occurred. Check server logs for details."}, status=500)

# --- VIEW 1: Get Existing Data ---
# This view is called by the frontend's useEffect hook to pre-fill the form.
@csrf_exempt
def get_medical_certificate_data(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    aadhar = request.GET.get('aadhar')
    if not aadhar:
        return JsonResponse({"error": "Aadhar parameter is required."}, status=400)

    try:
        # Find the most recent certificate for this patient.
        # Ordering by '-id' is a reliable way to get the last one created.
        latest_record = MedicalCertificate.objects.filter(aadhar=aadhar).order_by('-id').first()

        if not latest_record:
            # It's not an error if none exists. Return an empty object.
            return JsonResponse({}, status=200)

        # --- IMPORTANT: Translate backend snake_case to frontend camelCase ---
        # This dictionary must match the state in your React component.
        data_to_return = {
            'employeeName': latest_record.employeeName,
            'age': latest_record.age,
            'sex': latest_record.sex,
            'date': latest_record.date.isoformat() if latest_record.date else None,
            'empNo': latest_record.empNo,
            'department': latest_record.department,
            'jswContract': latest_record.jswContract,
            'natureOfWork': latest_record.natureOfWork,
            'covidVaccination': latest_record.covidVaccination,
            'diagnosis': latest_record.diagnosis,
            'leaveFrom': latest_record.leaveFrom.isoformat() if latest_record.leaveFrom else None,
            'leaveUpTo': latest_record.leaveUpTo.isoformat() if latest_record.leaveUpTo else None,
            'daysLeave': latest_record.daysLeave,
            'rejoiningDate': latest_record.rejoiningDate.isoformat() if latest_record.rejoiningDate else None,
            'shift': latest_record.shift,
            'pr': latest_record.pr,
            'sp02': latest_record.spo2,  # Note the translation from model `spo2` to frontend `sp02`
            'temp': latest_record.temp,
            'certificateFrom': latest_record.certificateFrom,
            'note': latest_record.note,
            'ohcStaffSignature': latest_record.ohcStaffSignature,
            'individualSignature': latest_record.individualSignature,
        }
        
        return JsonResponse(data_to_return, status=200)

    except Exception as e:
        logger.exception(f"get_medical_certificate_data failed for aadhar {aadhar}: {e}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)


# --- VIEW 2: Submit/Save Data ---
# This is the view you already had, which handles the form submission.
@csrf_exempt
def add_or_update_medical_certificate(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received medical certificate data: {json.dumps(data)[:500]}")
        
        mrdNo = data.get('mrdNo')
        aadhar = data.get('aadhar')

        if not mrdNo or not aadhar:
            return JsonResponse({"error": "MRD Number (mrdNo) and Aadhar are required."}, status=400)
        
        key_map = {
            'mrdNo': 'mrdNo', 'aadhar': 'aadhar', 'employeeName': 'employeeName',
            'age': 'age', 'sex': 'sex', 'empNo': 'empNo', 'department': 'department',
            'jswContract': 'jswContract', 'natureOfWork': 'natureOfWork',
            'covidVaccination': 'covidVaccination', 'diagnosis': 'diagnosis',
            'daysLeave': 'daysLeave', 'shift': 'shift', 'pr': 'pr', 'sp02': 'spo2',
            'temp': 'temp', 'certificateFrom': 'certificateFrom', 'note': 'note',
            'ohcStaffSignature': 'ohcStaffSignature', 'individualSignature': 'individualSignature',
        }

        form_defaults = {}
        for frontend_key, backend_key in key_map.items():
            value = data.get(frontend_key)
            if value is not None and str(value).strip() != '':
                form_defaults[backend_key] = value
        
        # Handle date fields separately
        form_defaults['date'] = parse_date_internal(data.get('date'))
        form_defaults['leaveFrom'] = parse_date_internal(data.get('leaveFrom'))
        form_defaults['leaveUpTo'] = parse_date_internal(data.get('leaveUpTo'))
        form_defaults['rejoiningDate'] = parse_date_internal(data.get('rejoiningDate'))

        # Use update_or_create to prevent duplicate entries for the same patient on the same day.
        # It finds a record matching the keys (mrdNo, date) and updates it with `defaults`.
        # If not found, it creates a new one.
        record, created = MedicalCertificate.objects.update_or_create(
            mrdNo=mrdNo,
            date=timezone.now().date(),  # Use the current date as the unique identifier for the day's record
            defaults=form_defaults
        )

        message = "Medical Certificate saved successfully" if created else "Medical Certificate updated successfully"
        return JsonResponse({"message": message, "id": record.id}, status=201 if created else 200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data received."}, status=400)
    except Exception as e:
        logger.exception(f"Error saving medical certificate for MRD {data.get('mrdNo', 'Unknown')}")
        return JsonResponse({"error": f"An internal server error occurred: {str(e)}"}, status=500)

@csrf_exempt
def BookAppointment(request):
    """Books a new appointment, linking via AADHAR."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly

            aadhar = data.get("aadharNo") # Expect Aadhar
            employee_id = data.get("employeeId") # Accept emp_no if sent

            if not aadhar:
                 logger.warning("BookAppointment failed: Aadhar Number (aadharNo) is required.")
                 return JsonResponse({"error": "Aadhar Number (aadharNo) is required"}, status=400)

            appointment_date_str = data.get("appointmentDate")
            appointment_date_obj = parse_date_internal(appointment_date_str)
            if not appointment_date_obj:
                logger.error(f"BookAppointment failed: Invalid appointment date format: {appointment_date_str}. Use YYYY-MM-DD.")
                return JsonResponse({"error": "Invalid appointment date format. Use YYYY-MM-DD."}, status=400)

            # Generate Appointment Number (ensure atomicity if high concurrency)
            with transaction.atomic():
                existing_appointments = Appointment.objects.filter(date=appointment_date_obj).select_for_update().count()
                next_appointment_number = existing_appointments + 1
                appointment_no_gen = f"{next_appointment_number:04d}{appointment_date_obj.strftime('%d%m%Y')}"

            appointment_data = {
                'appointment_no': appointment_no_gen, 'booked_date': date.today(),
                'role': data.get("role", "Unknown"), 'aadhar': aadhar, 'emp_no': employee_id,
                'name': data.get("name", "Unknown"), 'organization_name': data.get("organization", ""),
                'contractor_name': data.get("contractorName", ""), 'purpose': data.get("purpose", "Unknown"),
                'date': appointment_date_obj, 'time': data.get("time", ""),
                'booked_by': data.get("bookedBy", "System"),
                'submitted_by_nurse': data.get("submitted_by_nurse", ""),
                'submitted_Dr': data.get("submitted_Dr", ""), # Check model field name case
                'consultated_Dr': data.get("consultedDoctor", ""), # Check model field name case
                'employer': data.get("employer", ""),
                'status': Appointment.StatusChoices.INITIATE # Default status
            }
            # Filter None before create
            filtered_appointment_data = {k:v for k,v in appointment_data.items() if v is not None}

            appointment = Appointment.objects.create(**filtered_appointment_data)

            logger.info(f"Appointment {appointment.appointment_no} booked successfully for Aadhar {appointment.aadhar} on {appointment.date}. ID: {appointment.id}")
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
    else:
        response = JsonResponse({"error": "Invalid request. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

# Use GET for fetching data
@csrf_exempt
def get_appointments(request):
    """Retrieves appointments based on optional filters (date range, aadharNo, status)."""
    if request.method == "GET":
        try:
            from_date_str = request.GET.get('fromDate')
            to_date_str = request.GET.get('toDate')
            aadhar_filter = request.GET.get('aadharNo') # Filter by Aadhar
            status_filter = request.GET.get('status') # Filter by status

            queryset = Appointment.objects.all()

            # Apply filters
            from_date_obj = parse_date_internal(from_date_str)
            to_date_obj = parse_date_internal(to_date_str)
            if from_date_obj: queryset = queryset.filter(date__gte=from_date_obj)
            if to_date_obj: queryset = queryset.filter(date__lte=to_date_obj)
            if aadhar_filter: queryset = queryset.filter(aadhar_no=aadhar_filter)
            if status_filter:
                 valid_statuses = [choice[0] for choice in Appointment.StatusChoices.choices]
                 if status_filter in valid_statuses: queryset = queryset.filter(status=status_filter)
                 else: logger.warning(f"Invalid status filter received: {status_filter}")

            appointments = queryset.order_by('date', 'time') # Sensible default order

            # Serialize data
            appointment_list = []
            for app in appointments:
                 app_data = model_to_dict(app)
                 app_data['date'] = app.date.isoformat() if app.date else None
                 app_data['booked_date'] = app.booked_date.isoformat() if app.booked_date else None
                 appointment_list.append(app_data)

            logger.info(f"Fetched {len(appointment_list)} appointments.")
            return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."}, safe=False)

        except Exception as e:
             logger.exception("get_appointments failed: An unexpected error occurred.")
             return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt
def update_appointment_status(request):
    """Updates the status of an appointment based on its ID."""
    # Should be PUT or PATCH ideally
    if request.method == "POST":
        appointment_id = None
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            appointment_id = data.get("id")
            new_status = data.get("status") # Allow setting specific status

            if not appointment_id:
                 return JsonResponse({"success": False, "message": "Appointment ID ('id') is required."}, status=400)

            appointment = get_object_or_404(Appointment, id=appointment_id)
            current_status = appointment.status

            if new_status is None: # Cycle logic if no specific status provided
                if current_status == Appointment.StatusChoices.INITIATE:
                    next_status = Appointment.StatusChoices.IN_PROGRESS
                elif current_status == Appointment.StatusChoices.IN_PROGRESS:
                    next_status = Appointment.StatusChoices.COMPLETED
                else:
                    logger.warning(f"Cannot cycle status further for appointment ID {appointment_id}. Current status: {current_status}")
                    return JsonResponse({"success": False, "message": "Cannot update status further from current state."}, status=400)
                appointment.status = next_status
            else: # Set specific status if provided
                 valid_statuses = [choice[0] for choice in Appointment.StatusChoices.choices]
                 if new_status in valid_statuses:
                      # Add logic here to prevent invalid transitions if needed
                      appointment.status = new_status
                 else:
                      logger.warning(f"Invalid status value '{new_status}' provided for appointment ID {appointment_id}.")
                      return JsonResponse({"success": False, "message": f"Invalid status value: {new_status}"}, status=400)

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
    else:
        response = JsonResponse({"error": "Invalid request method (use POST/PUT/PATCH)."}, status=405)
        response['Allow'] = 'POST, PUT, PATCH' # Indicate allowed methods
        return response

@csrf_exempt
def uploadAppointment(request):
    """Uploads appointments from a JSON payload containing a list of rows."""
    if request.method != "POST":
        logger.warning("uploadAppointment failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8')) # Decode explicitly
        appointments_data = data.get("appointments", [])

        if not appointments_data or len(appointments_data) <= 1: # Expect header row
            logger.warning("uploadAppointment failed: No appointment data or only header row.")
            return JsonResponse({"error": "No valid appointment data provided (minimum 2 rows expected)."}, status=400)

        successful_uploads = 0
        failed_uploads = []
        processed_count = 0

        # --- Excel date parsing helper ---
        def parse_excel_date(value):
            if isinstance(value, (int, float)):
                try: return (datetime(1899, 12, 30) + timedelta(days=value)).date()
                except OverflowError: return None
            if isinstance(value, str):
                value = value.strip()
                for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%b-%Y", "%d-%m-%Y", "%d/%m/%Y"):
                    try: return datetime.strptime(value, fmt).date()
                    except ValueError: continue
            if isinstance(value, datetime): return value.date()
            if isinstance(value, date): return value
            return None

        # Helper to safely get data from row
        def get_cell(row, index, default=''):
            try: return str(row[index]).strip() if len(row) > index and row[index] is not None else default
            except IndexError: return default

        # --- Process rows (skip header) ---
        header = appointments_data[0] # Assuming header is first row
        for i, row_data in enumerate(appointments_data[1:], start=1): # Start from second row
            processed_count += 1
            try:
                # Column mapping (adjust indices based on actual Excel file)
                role = get_cell(row_data, 1).lower() # Column B -> Role
                name = get_cell(row_data, 2)        # Column C -> Name
                emp_no_val = get_cell(row_data, 3)   # Column D -> Emp No
                organization = get_cell(row_data, 4)# Column E -> Org/Employer
                aadhar_no_val = get_cell(row_data, 5)# Column F -> Aadhar No *** CHECK INDEX ***
                contractor_name_val = get_cell(row_data, 6) # Column G -> Contractor
                purpose_val = get_cell(row_data, 7)      # Column H -> Purpose
                date_val = parse_excel_date(row_data[8] if len(row_data) > 8 else None) # Column I -> Date
                time_val = get_cell(row_data, 9)        # Column J -> Time
                booked_by_val = get_cell(row_data, 10)   # Column K -> Booked By
                submitted_by_nurse_val = get_cell(row_data, 11) # Column L -> Nurse
                submitted_dr_val = get_cell(row_data, 12)    # Column M -> Submitting Dr
                consulted_dr_val = get_cell(row_data, 13) # Column N -> Consulted Dr

                # Validation
                if not aadhar_no_val: raise ValueError(f"Row {i+1}: Missing Aadhar Number (Column F)")
                if not date_val: raise ValueError(f"Row {i+1}: Invalid/Missing Date (Column I)")
                if role not in ["contractor", "employee", "visitor"]: raise ValueError(f"Row {i+1}: Invalid Role '{role}' (Column B)")

                employer_val = organization # Employer determined by org/contractor name if needed

                # Use transaction for atomic appointment number generation and creation
                with transaction.atomic():
                    appointment_count_today = Appointment.objects.filter(date=date_val).select_for_update().count()
                    appointment_no_gen = f"{(appointment_count_today + 1):04d}{date_val.strftime('%d%m%Y')}"

                    Appointment.objects.create(
                        appointment_no=appointment_no_gen, booked_date=date.today(), role=role,
                        emp_no=emp_no_val, aadhar_no=aadhar_no_val, name=name,
                        organization_name=organization, contractor_name=contractor_name_val,
                        purpose=purpose_val, date=date_val, time=time_val,
                        booked_by=booked_by_val or "Bulk Upload",
                        submitted_by_nurse=submitted_by_nurse_val, submitted_Dr=submitted_dr_val,
                        consultated_Dr=consulted_dr_val, employer=employer_val,
                        status = Appointment.StatusChoices.INITIATE
                    )
                successful_uploads += 1

            except (IndexError, ValueError, ValidationError, TypeError) as e:
                error_msg = f"Row {i+1}: Error - {str(e)}. Data: {row_data}"
                logger.error(f"uploadAppointment error: {error_msg}")
                failed_uploads.append(error_msg)
            except Exception as e:
                 error_msg = f"Row {i+1}: Unexpected error - {str(e)}. Data: {row_data}"
                 logger.exception(f"uploadAppointment unexpected error: {error_msg}")
                 failed_uploads.append(error_msg)

        # Report Results
        message = f"Processed {processed_count} rows. {successful_uploads} appointments uploaded successfully."
        status_code = 200
        response_data = {"message": message, "successful_uploads": successful_uploads}
        if failed_uploads:
            response_data["failed_uploads"] = len(failed_uploads)
            response_data["errors"] = failed_uploads[:10] # Limit error details
            message += f" {len(failed_uploads)} rows failed."
            response_data["message"] = message
            if successful_uploads == 0: status_code = 400 # Indicate failure if nothing worked

        logger.info(f"uploadAppointment result: {message}")
        return JsonResponse(response_data, status=status_code)

    except json.JSONDecodeError:
        logger.error("uploadAppointment failed: Invalid JSON format.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    except Exception as e:
        logger.exception("uploadAppointment failed: An unexpected error occurred during bulk upload.")
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)



@csrf_exempt
def add_prescription(request):
    """
    Adds a new prescription with MRD number and handles stock deduction.
    Each MRD number gets a new entry in the system.
    """
    if request.method != "POST":
        logger.warning(f"add_prescription failed: Invalid request method '{request.method}'. Only POST allowed.")
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response

    data = None
    try:
        data = json.loads(request.body.decode('utf-8'))
        print("Data : ", data)

        # --- Extract Basic Information ---
        emp_no = data.get('emp_no')
        name = data.get('name')
        aadhar = data.get('aadhar')
        mrd_no = data.get('mrdNo')  # Get MRD number
        entry_date = timezone.now().date()  # Get current date

        # --- Basic Validation ---
        if not mrd_no:
            logger.warning("add_prescription failed: MRD number is required")
            return JsonResponse({"error": "MRD number is required"}, status=400)
        if not emp_no:
            logger.warning("add_prescription failed: emp_no is required")
            return JsonResponse({"error": "Employee number (emp_no) is required"}, status=400)
        if not name:
            logger.warning("add_prescription failed: name is required")
            return JsonResponse({"error": "Employee name (name) is required"}, status=400)

        submitted_by = data.get('submitted_by')
        issued_by = data.get('issued_by')
        if not submitted_by or not issued_by:
            logger.warning("add_prescription failed: submitted_by and issued_by are required fields")
            return JsonResponse({"error": "submitted_by and issued_by are required fields"}, status=400)

        # --- Prepare prescription data ---
        prescription_data = {
            'emp_no': emp_no,
            'name': name,
            'aadhar': aadhar,
            'mrdNo': mrd_no,
            'tablets': data.get('tablets'),
            'syrups': data.get('syrups'),
            'injections': data.get('injections'),
            'creams': data.get('creams'),
            'drops': data.get('drops'),
            'fluids': data.get('fluids'),
            'lotions': data.get('lotions'),
            'powder': data.get('powder'),
            'respules': data.get('respules'),
            'suture_procedure': data.get('suture_procedure'),
            'dressing': data.get('dressing'),
            'others': data.get('others'),
            'submitted_by': submitted_by,
            'issued_by': issued_by,
            'nurse_notes': data.get('nurse_notes'),
            'issued_status': data.get('issued_status')
        }

        # Filter out None values
        prescription_data = {k: v for k, v in prescription_data.items() if v is not None}

        # --- Use update_or_create based on emp_no, mrdNo and entry_date ---
        prescription, created = Prescription.objects.update_or_create(
            emp_no=emp_no,
            mrdNo=mrd_no,
            entry_date=entry_date,
            defaults=prescription_data
        )

        message = "Prescription added successfully" if created else "Prescription updated successfully"
        return JsonResponse({
            "message": message,
            "emp_no": emp_no,
            "mrdNo": mrd_no,
            "entry_date": entry_date.isoformat()
        }, status=201 if created else 200)

    except json.JSONDecodeError:
        logger.error("add_prescription failed: Invalid JSON data.", exc_info=True)
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"add_prescription failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing prescription."}, status=500)

@csrf_exempt
def view_prescriptions(request):
    
    if request.method == 'GET':
        prescriptions = Prescription.objects.all()
        data = []
        for prescription in prescriptions:
            print(prescription.aadhar)
            data.append({
                'id': prescription.id,
                'emp_no': prescription.emp_no,
                'aadhar': prescription.aadhar, # Include aadhar in response
                'name': prescription.name,  # Concatenate names
                'entry_date': prescription.entry_date.strftime('%Y-%m-%d'), # Format date,
                'issued_status': prescription.issued_status,  # Replace the status for view
                'prescription':{
                    'id': prescription.id,
                    'emp_no': prescription.emp_no,
                    'aadhar': prescription.aadhar, # Include aadhar in response
                    'name': f"{prescription.submitted_by} / {prescription.issued_by}",  # Concatenate names
                    'tablets':  prescription.tablets,
                    'syrups': prescription.syrups,
                    'injections':  prescription.injections,
                    'creams': prescription.creams,
                    'drops':  prescription.drops,
                    'fluids': prescription.fluids,
                    'lotions':  prescription.lotions,
                    'powder': prescription.powder,
                    'respules':  prescription.respules,
                    'suture_procedure': prescription.suture_procedure,
                    'others': prescription.others,
                    'dressing': prescription.dressing,
                    'submitted_by':  prescription.submitted_by,
                    'issued_by':  prescription.issued_by,
                    'nurse_notes': prescription.nurse_notes,
                    'entry_date': prescription.entry_date.strftime('%Y-%m-%d'), # Format date,
                    

                }
            })

        # print(data)

        return JsonResponse({'prescriptions': data})
    else:
        return JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)

# --- Mock Drills / Camps / Reviews / Misc ---

@csrf_exempt
def save_mockdrills(request):
    if request.method == "POST":
        aadhar = None
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            logger.debug(f"Received data for save_mockdrills: {json.dumps(data)[:500]}...")

            aadhar = data.get('aadhar') # Expect aadhar if victim is related
            emp_no_val = data.get('emp_no') # Keep emp_no if needed

            drill_date = parse_date_internal(data.get("date"))
            if not drill_date: return JsonResponse({"error": "Valid date is required"}, status=400)

            mock_drill_data = {
                'date': drill_date, 'time': data.get("time"), 'department': data.get("department"),
                'location': data.get("location"), 'scenario': data.get("scenario"),
                'ambulance_timing': data.get("ambulance_timing"), 'departure_from_OHC': data.get("departure_from_OHC"),
                'return_to_OHC': data.get("return_to_OHC"), 
                'aadhar': aadhar, # Aadhar is included here
                'emp_no': emp_no_val,
                'victim_department': data.get("victim_department"), 'victim_name': data.get("victim_name"),
                'nature_of_job': data.get("nature_of_job"), 'age': parse_form_age(data.get("age")),
                'mobile_no': data.get("mobile_no"), 'gender': data.get("gender"), 'vitals': data.get("vitals"),
                'complaints': data.get("complaints"), 'treatment': data.get("treatment"),
                'referal': data.get("referal"), 'ambulance_driver': data.get("ambulance_driver"),
                'staff_name': data.get("staff_name"), 'OHC_doctor': data.get("OHC_doctor"),
                'staff_nurse': data.get("staff_nurse"), 'Action_Completion': data.get("action_completion"), # Corrected key to match frontend if needed
                'Responsible': data.get("responsible"), # Corrected key to match frontend if needed
            }

            filtered_data = {k: v for k, v in mock_drill_data.items() if v is not None}

            mock_drill = mockdrills.objects.create(**filtered_data)

            logger.info(f"Mock drill saved ID: {mock_drill.id}" + (f" for Aadhar: {aadhar}" if aadhar else ""))
            return JsonResponse({"message": f"Mock drill saved successfully", "id": mock_drill.id}, status=201)

        except json.JSONDecodeError:
            logger.error("save_mockdrills failed: Invalid JSON data.", exc_info=True)
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception(f"save_mockdrills failed (Aadhar: {aadhar or 'N/A'}): {e}")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method"}, status=405)
        response['Allow'] = 'POST'
        return response

# Use GET
def get_mockdrills(request):
    if request.method == "GET":
        try:
            mock_drills_qs = mockdrills.objects.all().order_by('-date', '-time')
            mock_drills_list = []
            for drill in mock_drills_qs:
                 drill_data = model_to_dict(drill)
                 drill_data['date'] = drill.date.format() if drill.date else None
                 # Format time if needed: drill_data['time'] = drill.time.strftime('%H:%M:%S') if drill.time else None
                 mock_drills_list.append(drill_data)
            return JsonResponse(mock_drills_list, safe=False)
        except Exception as e:
            logger.exception("get_mockdrills failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method"}, status=405)
        response['Allow'] = 'GET'
        return response
    
@csrf_exempt # Keep if you are posting to it, but for GET it's not strictly needed. For simplicity, let's assume it's only GET.
def get_one_mockdrills(request):
    if request.method == "GET":
        try:
            # Order by 'id' descending is often a reliable way to get the latest created object
            # If you have a 'created_at' DateTimeField, that would be even better.
            # Using '-date', '-time' as per your model structure.
            latest_drill_qs = mockdrills.objects.all().order_by('-date', '-time').first()
            
            if latest_drill_qs:
                # model_to_dict converts the model instance to a dictionary.
                # The keys in this dictionary will be the model field names (e.g., 'action_completion', 'responsible').
                data_to_return = model_to_dict(latest_drill_qs)
            else:
                data_to_return = {} # Return an empty object if no drills are found

            return JsonResponse(data_to_return, safe=True) # safe=True because we are sending a dict

        except Exception as e:
            logger.exception("get_one_mockdrills failed.") # Corrected function name
            return JsonResponse({"error": "Server error retrieving latest mock drill.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method for get_one_mockdrills"}, status=405)
        response['Allow'] = 'GET'
        return response

# Camps/Events - No Aadhar dependency
@csrf_exempt
def add_camp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            start_date_obj = parse_date_internal(data.get("start_date"))
            end_date_obj = parse_date_internal(data.get("end_date"))
            if not start_date_obj or not end_date_obj: return JsonResponse({"error": "Valid start_date and end_date required (YYYY-MM-DD)."}, status=400)
            if start_date_obj > end_date_obj: return JsonResponse({"error": "Start date cannot be after end date."}, status=400)
            camp_name = data.get("camp_name")
            if not camp_name: return JsonResponse({"error": "Camp name is required."}, status=400)

            camp_data = {
                'camp_name': camp_name, 'hospital_name': data.get("hospital_name"),
                'start_date': start_date_obj, 'end_date': end_date_obj,
                'camp_details': data.get("camp_details"), 'camp_type': data.get("camp_type", "Camp"),
            }
            filtered_data = {k:v for k,v in camp_data.items() if v is not None}

            camp = eventsandcamps.objects.create(**filtered_data)
            logger.info(f"Camp '{camp.camp_name}' saved ID: {camp.id}")
            return JsonResponse({"message": "Camp added successfully.", "id": camp.id}, status=201)
        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("add_camp failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

# Use GET
def get_camps(request):
    if request.method == "GET":
        try:
            search_term = request.GET.get("searchTerm", "")
            filter_status = request.GET.get("filterStatus", "") # "Live" or specific camp_type
            date_from_str = request.GET.get("dateFrom")
            date_to_str = request.GET.get("dateTo")
            today = date.today()

            camps_qs = eventsandcamps.objects.all()
            if search_term: camps_qs = camps_qs.filter(Q(camp_name__icontains=search_term) | Q(camp_details__icontains=search_term))

            if filter_status == "Live": camps_qs = camps_qs.filter(start_date__lte=today, end_date__gte=today)
            elif filter_status: camps_qs = camps_qs.filter(camp_type=filter_status) # Filter by type if not "Live"

            date_from = parse_date_internal(date_from_str)
            date_to = parse_date_internal(date_to_str)
            if date_from: camps_qs = camps_qs.filter(start_date__gte=date_from)
            if date_to: camps_qs = camps_qs.filter(end_date__lte=date_to)

            camps_qs = camps_qs.order_by('-start_date', 'camp_name')
            data = []
            media_prefix = get_media_url_prefix(request)
            for camp in camps_qs:
                 camp_files = {ft: f"{media_prefix}{getattr(camp, ft).name}" if getattr(camp, ft) else None for ft in ['report1', 'report2', 'photos', 'ppt']}
                 data.append({
                     'id': camp.id, 'camp_name': camp.camp_name, 'hospital_name': camp.hospital_name,
                     'start_date': camp.start_date.isoformat() if camp.start_date else None,
                     'end_date': camp.end_date.isoformat() if camp.end_date else None,
                     'camp_details': camp.camp_details, 'camp_type': camp.camp_type,
                     **camp_files # Unpack file URLs
                 })
            return JsonResponse(data, safe=False)
        except Exception as e:
            logger.exception("get_camps failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt
def upload_files(request):
    # Handles file uploads for camps
    if request.method == 'POST':
        camp_id_str = request.POST.get('campId')
        file_type = request.POST.get('fileType') # e.g., 'report1', 'photos'
        uploaded_file = request.FILES.get('file') # Common key for the file

        if not camp_id_str or not file_type or not uploaded_file:
            return JsonResponse({'error': 'campId, fileType, and file are required.'}, status=400)
        try:
            camp_id = int(camp_id_str)
        except ValueError:
            return JsonResponse({'error': 'Invalid campId.'}, status=400)

        valid_file_types = ['report1', 'report2', 'photos', 'ppt']
        if file_type not in valid_file_types:
            return JsonResponse({'error': f"Invalid file type '{file_type}'. Must be one of: {', '.join(valid_file_types)}"}, status=400)

        # Validate file extension
        file_extension = os.path.splitext(uploaded_file.name)[1].lower().strip('.')
        if file_extension not in ALLOWED_FILE_TYPES:
             return JsonResponse({'error': f"Disallowed file extension '{file_extension}'. Allowed: {', '.join(ALLOWED_FILE_TYPES)}"}, status=400)

        try:
            camp = get_object_or_404(eventsandcamps, pk=camp_id)

            # Delete old file before saving new one
            old_file_field = getattr(camp, file_type, None)
            if old_file_field and old_file_field.name:
                try:
                    if default_storage.exists(old_file_field.path):
                        default_storage.delete(old_file_field.path)
                        logger.info(f"Deleted old {file_type} for camp {camp_id}: {old_file_field.name}")
                except Exception as e:
                    logger.error(f"Error deleting old {file_type} for camp {camp_id}: {e}")

            # Save the new file
            setattr(camp, file_type, uploaded_file)
            camp.save(update_fields=[file_type]) # Save only the updated field

            new_file_field = getattr(camp, file_type)
            file_url = f"{get_media_url_prefix(request)}{new_file_field.name}" if new_file_field and new_file_field.name else None
            logger.info(f"File uploaded for camp {camp_id}, type {file_type}: {uploaded_file.name}")
            return JsonResponse({'message': 'File uploaded successfully.', 'file_url': file_url}, status=200)
        except Http404:
             return JsonResponse({'error': 'Camp not found.'}, status=404)
        except Exception as e:
             logger.exception(f"upload_files failed for camp {camp_id}, type {file_type}")
             return JsonResponse({'error': 'Failed to upload file.', 'detail': str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

# Use GET
def download_file(request):
    # Handles file downloads for camps
    if request.method == 'GET':
        try:
            camp_id_str = request.GET.get('campId')
            file_type = request.GET.get('fileType')
            if not camp_id_str or not file_type: raise Http404("Missing campId or fileType parameter.")
            try: camp_id = int(camp_id_str)
            except ValueError: raise Http404("Invalid campId.")

            valid_types = ['report1', 'report2', 'photos', 'ppt']
            if file_type not in valid_types: raise Http404("Invalid file type.")

            camp = get_object_or_404(eventsandcamps, pk=camp_id)
            file_field = getattr(camp, file_type, None)

            if not file_field or not file_field.name: raise Http404(f"File '{file_type}' not found for this camp.")
            if not default_storage.exists(file_field.path): raise Http404("File not found in storage.")

            # Use FileResponse for efficient file serving
            response = FileResponse(default_storage.open(file_field.path, 'rb'), as_attachment=True)
            # response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_field.name)}"' # Optional: Set filename explicitly
            return response
        except Http404 as e:
            logger.warning(f"download_file failed: {e}")
            return HttpResponse(str(e), status=404)
        except Exception as e:
            logger.exception("download_file failed.")
            return HttpResponse("Server error.", status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt
def delete_file(request):
    # Should ideally be DELETE, using POST for now
    if request.method == 'POST':
        camp_id_str = None # Initialize
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            camp_id_str = data.get('campId')
            file_type = data.get('fileType')
            if not camp_id_str or not file_type: return JsonResponse({'error': 'campId and fileType required.'}, status=400)
            try: camp_id = int(camp_id_str)
            except ValueError: return JsonResponse({'error': 'Invalid campId.'}, status=400)

            valid_types = ['report1', 'report2', 'photos', 'ppt']
            if file_type not in valid_types: return JsonResponse({'error': f"Invalid file type."}, status=400)

            camp = get_object_or_404(eventsandcamps, pk=camp_id)
            file_field = getattr(camp, file_type, None)

            if file_field and file_field.name:
                 file_path = file_field.path # Get path before clearing
                 file_name = file_field.name # Get name for logging
                 setattr(camp, file_type, None) # Clear the field reference
                 camp.save(update_fields=[file_type]) # Save the change
                 # Now attempt to delete from storage
                 try:
                     if default_storage.exists(file_path):
                          default_storage.delete(file_path)
                          logger.info(f"File '{file_name}' deleted from storage for camp {camp_id}, type {file_type}")
                          return JsonResponse({'message': 'File deleted successfully.'}, status=200)
                     else:
                          logger.warning(f"File '{file_name}' not found in storage for camp {camp_id}, type {file_type}, but reference removed.")
                          return JsonResponse({'message': 'File reference removed, but file not found in storage.'}, status=200) # Still success from DB perspective
                 except Exception as e:
                     logger.error(f"Error deleting file from storage camp {camp_id}, type {file_type}: {e}")
                     # Field reference is already removed, report storage error
                     return JsonResponse({'message': 'File reference removed, but error deleting from storage.', 'error_detail': str(e)}, status=500)
            else:
                 # No file was associated with the field
                 return JsonResponse({'message': 'No file associated with this type to delete.'}, status=200)
        except Http404: return JsonResponse({'error': 'Camp not found'}, status=404)
        except json.JSONDecodeError: return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.exception(f"delete_file failed for camp {camp_id_str or 'Unknown'}.")
            return JsonResponse({'error': "Server error.", 'detail': str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST or DELETE."}, status=405)
        response['Allow'] = 'POST, DELETE' # Indicate allowed methods
        return response


# Reviews - No Aadhar dependency
def get_categories(request):
    if request.method == 'GET':
        try:
            categories = list(ReviewCategory.objects.values("id", "name").order_by("name"))
            return JsonResponse({"categories": categories}, safe=False)
        except Exception as e:
            logger.exception("get_categories failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

def get_reviews(request, status):
    if request.method == 'GET':
        try:
            # Basic status validation (can add more checks if needed)
            if not status: return JsonResponse({"error": "Status parameter is required."}, status=400)

            reviews = list(Review.objects.filter(status=status).select_related('category')
                           .order_by('-appointment_date') # Order by most recent
                           .values("id", "pid", "name", "gender", "appointment_date", "category__name"))

            for review in reviews:
                if isinstance(review.get('appointment_date'), date):
                    review['appointment_date'] = review['appointment_date'].isoformat()

            return JsonResponse({"reviews": reviews}, safe=False)
        except Exception as e:
            logger.exception(f"get_reviews failed for status '{status}'.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt
def add_review(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly

            required = ['category', 'pid', 'name', 'gender', 'appointment_date', 'status']
            missing = [f for f in required if data.get(f) is None]
            if missing: return JsonResponse({"error": f"Missing required fields: {', '.join(missing)}"}, status=400)

            # Get or create category
            category_name = data["category"]
            if not category_name: return JsonResponse({"error": "Category name cannot be empty."}, status=400)
            category, _ = ReviewCategory.objects.get_or_create(name=category_name)

            appointment_date_obj = parse_date_internal(data["appointment_date"])
            if not appointment_date_obj: return JsonResponse({"error": "Invalid appointment_date format (YYYY-MM-DD)."}, status=400)

            review_data = {
                'category': category, 'pid': data["pid"], 'name': data["name"],
                'gender': data["gender"], 'appointment_date': appointment_date_obj,
                'status': data["status"]
            }
            filtered_data = {k:v for k,v in review_data.items() if v is not None}

            review = Review.objects.create(**filtered_data)
            logger.info(f"Review saved ID: {review.id}")
            return JsonResponse({"message": "Review added successfully", "id": review.id}, status=201)
        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("add_review failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response


# --- Aggregate/All Data Fetching ---

@csrf_exempt # Should be GET
def dashboard_stats(request):
    if request.method == 'GET':
        try:
            from_date_str = request.GET.get("fromDate")
            to_date_str = request.GET.get("toDate")
            visit_type_filter = request.GET.get("visitType")
            entity_filter = request.GET.get("entityType")
            today = date.today()

            from_date_obj = parse_date_internal(from_date_str) if from_date_str else today
            to_date_obj = parse_date_internal(to_date_str) if to_date_str else today
            if from_date_obj > to_date_obj: from_date_obj, to_date_obj = to_date_obj, from_date_obj

            queryset = Dashboard.objects.filter(date__range=[from_date_obj, to_date_obj])
            if visit_type_filter in ["Preventive", "Curative"]: queryset = queryset.filter(type_of_visit=visit_type_filter)
            entity_mapping = {"Employee": "Employee", "Contractor": "Contractor", "Visitor": "Visitor"}
            if entity_filter in entity_mapping: queryset = queryset.filter(type=entity_mapping[entity_filter])

            # Calculate counts efficiently
            type_counts = list(queryset.values("type").annotate(count=Count("id")).order_by("-count"))
            type_of_visit_counts = list(queryset.values("type_of_visit").annotate(count=Count("id")).order_by("-count"))
            register_counts = list(queryset.values("register").annotate(count=Count("id")).order_by("-count"))
            purpose_counts = list(queryset.values("purpose").annotate(count=Count("id")).order_by("-count"))
            total_count = queryset.count()

            data = {
                "type_counts": type_counts, "type_of_visit_counts": type_of_visit_counts,
                "register_counts": register_counts, "purpose_counts": purpose_counts,
                "total_count": total_count
            }
            return JsonResponse(data, safe=False)
        except Exception as e:
            logger.exception("Error in dashboard_stats view.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid request method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt # Should be GET
def fetchVisitdataAll(request):
    if request.method == "POST": # Use POST
        try:
            visits_qs = Dashboard.objects.all().order_by('-date', '-id')
            visits = []
            for v in visits_qs:
                 v_data = model_to_dict(v); v_data['date'] = v.date.isoformat() if v.date else None
                 visits.append(v_data)
            logger.info(f"Fetched all {len(visits)} visit records.")
            return JsonResponse({"message": "All visit data fetched successfully", "data": visits}, status=200)
        except Exception as e:
            logger.exception("fetchVisitdataAll failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method (use GET)."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt # Should be GET
def fetchFitnessData(request):
    if request.method == "POST": # Use POST
        try:
            fitness_qs = FitnessAssessment.objects.all().order_by('-entry_date', '-id')
            fitness_data = []
            for r in fitness_qs:
                 r_data = model_to_dict(r)
                 r_data['entry_date'] = r.entry_date.isoformat() if r.entry_date else None
                 r_data['validity'] = r.validity.isoformat() if r.validity else None
                 fitness_data.append(r_data)
            logger.info(f"Fetched all {len(fitness_data)} fitness records.")
            return JsonResponse({"message": "All fitness data fetched successfully", "data": fitness_data}, status=200)
        except Exception as e:
            logger.exception("fetchFitnessData failed.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method (use GET)."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt # Should be GET
def get_notes_all(request):
    if request.method == 'GET': # Use GET
        try:
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

            logger.info(f"Fetched all notes ({len(notes)}) and consultations ({len(consultations)}).")
            return JsonResponse({'notes': notes, 'consultation': consultations})
        except Exception as e:
            logger.exception("get_notes_all failed.")
            return JsonResponse({'error': "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt # Should be GET
def view_prescriptions(request):
    if request.method == 'GET':
        try:
            prescriptions_qs = Prescription.objects.all().order_by('-entry_date', '-id')
            data = []
            for p in prescriptions_qs:
                p_data = model_to_dict(p)
                p_data['entry_date'] = p.entry_date.isoformat() if p.entry_date else None
                data.append(p_data)
            logger.info(f"Fetched {len(data)} prescriptions.")
            return JsonResponse({'prescriptions': data})
        except Exception as e:
            logger.exception("view_prescriptions failed.")
            return JsonResponse({'error': "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid method. Use GET.'}, status=405)
        response['Allow'] = 'GET'
        return response

# --- Pharmacy / Inventory / Calibration (Continued) ---

# Added missing import for FieldError
from django.core.exceptions import FieldError
from django.db.models import F # Added for potential future optimisations

# Helper to avoid repeating stock/history lookups
def get_total_quantity(entry_date, medicine_form, brand_name, chemical_name, dose_volume, expiry_date):
    """
    Try to fetch total_quantity from PharmacyStock or PharmacyStockHistory.
    Prioritize PharmacyStock if available.
    """
    try:
        # Check active stock first
        stock = PharmacyStock.objects.filter(
            # entry_date=entry_date, # Entry date might not be the best key here if stock is aggregated
            medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
            dose_volume=dose_volume, expiry_date=expiry_date
        ).first()
        if stock and hasattr(stock, 'total_quantity') and stock.total_quantity is not None:
            return stock.total_quantity

        # If not in active stock, check history (use latest entry for this combo if needed)
        stock_history = PharmacyStockHistory.objects.filter(
            # entry_date=entry_date, # Might need to find based on other keys if entry date isn't reliable
            medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
            dose_volume=dose_volume, expiry_date=expiry_date
        ).order_by('-entry_date').first() # Get the most recent history record

        return stock_history.total_quantity if stock_history and hasattr(stock_history, 'total_quantity') else 0 # Default to 0 if not found
    except Exception as e:
        logger.error(f"Error getting total quantity for {brand_name}/{chemical_name}: {e}")
        return 0 # Return 0 or None on error


@csrf_exempt # Should be GET
def get_stock_history(request):
    """ Fetch stock history (archived/consumed items) """
    if request.method == 'GET':
        try:
            stock_data = PharmacyStockHistory.objects.all().order_by(
                "medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date", "-entry_date"
            ).values() # Fetch all fields

            data = []
            for entry in stock_data:
                # Format dates safely
                entry_date_fmt = entry.get("entry_date").strftime("%Y-%m-%d") if entry.get("entry_date") else None
                expiry_date_fmt = entry.get("expiry_date").strftime("%b-%y") if entry.get("expiry_date") else None
                archive_date_fmt = entry.get("archive_date").strftime("%Y-%m-%d") if entry.get("archive_date") else None

                data.append({
                    "entry_date": entry_date_fmt,
                    "medicine_form": entry.get("medicine_form"),
                    "brand_name": entry.get("brand_name"),
                    "chemical_name": entry.get("chemical_name"),
                    "dose_volume": entry.get("dose_volume"),
                    "total_quantity_recorded": entry.get("total_quantity"), # Use the actual quantity recorded in history
                    "expiry_date": expiry_date_fmt,
                    "archive_date": archive_date_fmt # Include archive date
                })

            return JsonResponse({"stock_history": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_stock_history")
            return JsonResponse({"error": "Server error fetching stock history.", "detail": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt
def add_stock(request):
    """ Adds new stock to PharmacyStock and creates a corresponding history record. """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            logger.debug(f"Add Stock Received Data: {data}")

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            quantity_str = data.get("quantity")
            expiry_date_str = data.get("expiry_date") # Expect YYYY-MM

            # Validation
            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity_str, expiry_date_str]):
                return JsonResponse({"error": "All fields (medicine_form, brand_name, chemical_name, dose_volume, quantity, expiry_date [YYYY-MM]) are required"}, status=400)
            try:
                quantity = int(quantity_str)
                if quantity <= 0: raise ValueError("Quantity must be positive")
            except (ValueError, TypeError):
                 return JsonResponse({"error": "Invalid quantity provided. Must be a positive integer."}, status=400)
            try:
                 # Parse YYYY-MM, assume last day of month for expiry or first? Use first for consistency.
                 expiry_date = datetime.strptime(f"{expiry_date_str}-01", "%Y-%m-%d").date()
            except ValueError:
                 return JsonResponse({"error": "Invalid expiry date format. Use YYYY-MM."}, status=400)

            entry_date = date.today()

            with transaction.atomic():
                # Ensure PharmacyMedicine entry exists (defines the medicine itself)
                medicine_entry, created = PharmacyMedicine.objects.get_or_create(
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    defaults={'entry_date': entry_date} # Set entry date only if created
                )
                if created: logger.info(f"Created new PharmacyMedicine entry: ID {medicine_entry.id}")

                # Add or update PharmacyStock
                # Find existing stock for this specific batch (same expiry)
                stock_item, stock_created = PharmacyStock.objects.select_for_update().get_or_create(
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    expiry_date=expiry_date,
                    defaults={
                        'entry_date': entry_date,
                        'quantity': quantity,
                        'total_quantity': quantity # Initial total quantity
                    }
                )
                if not stock_created:
                    # If stock for this batch already exists, add to it
                    stock_item.quantity = F('quantity') + quantity
                    stock_item.total_quantity = F('total_quantity') + quantity # Increment total as well
                    stock_item.entry_date = entry_date # Update entry date to reflect latest addition
                    stock_item.save()
                    logger.info(f"Updated existing PharmacyStock for batch: {stock_item.id}, Added: {quantity}")
                else:
                     logger.info(f"Created new PharmacyStock for batch: {stock_item.id}, Quantity: {quantity}")

                # Add entry to PharmacyStockHistory for this addition
                PharmacyStockHistory.objects.create(
                    entry_date=entry_date,
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    total_quantity=quantity, # Record the quantity added in this transaction
                    expiry_date=expiry_date,
                    # archive_date is null initially
                )

            return JsonResponse({"message": "Stock added successfully"}, status=201)

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.exception("Error in add_stock:")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method"}, status=405)
        response['Allow'] = 'POST'
        return response


# --- Other Pharmacy helpers ---

@csrf_exempt # Should be GET
def get_brand_names(request):
    if request.method == 'GET':
        try:
            chemical_name = request.GET.get("chemical_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip()
            query = request.GET.get("query", "").strip()
            suggestions = set()

            filters = Q()
            if chemical_name: filters &= Q(chemical_name__iexact=chemical_name)
            if medicine_form: filters &= Q(medicine_form__iexact=medicine_form)
            if query and len(query) >= 2: filters |= Q(brand_name__istartswith=query) # Combine with OR if query present

            if filters: # Only query if filters exist
                brand_names = PharmacyMedicine.objects.filter(filters).values_list("brand_name", flat=True).distinct()
                suggestions.update(brand_names)

            return JsonResponse({"suggestions": sorted(list(suggestions))}) # Convert set to list

        except Exception as e:
            logger.exception("Error in get_brand_names")
            return JsonResponse({"error": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt # Should be GET
def get_dose_volume(request):
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            chemical_name = request.GET.get("chemical_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip()

            if not brand_name or not chemical_name or not medicine_form:
                return JsonResponse({"suggestions": []}) # Return empty list if params missing

            dose_suggestions = list(
                PharmacyMedicine.objects.filter(
                    brand_name__iexact=brand_name,
                    chemical_name__iexact=chemical_name,
                    medicine_form__iexact=medicine_form
                ).values_list("dose_volume", flat=True).distinct()
            )
            return JsonResponse({"suggestions": dose_suggestions})
        except Exception as e:
            logger.exception("Error in get_dose_volume")
            return JsonResponse({"error": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt # Should be GET
def get_chemical_name_by_brand(request):
    # This seems redundant with get_chemical_name, assuming brand is unique enough?
    # Keeping it, but might be combined later.
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            medicine_form = request.GET.get("medicine_form", "").strip() # Form might be needed to disambiguate

            if not brand_name or not medicine_form:
                return JsonResponse({"suggestions": []})

            suggestions = list(
                PharmacyMedicine.objects.filter(brand_name__iexact=brand_name, medicine_form__iexact=medicine_form)
                .values_list("chemical_name", flat=True).distinct()
            )
            return JsonResponse({"suggestions": suggestions})
        except Exception as e:
            logger.exception("Error in get_chemical_name_by_brand")
            return JsonResponse({"error": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt # Should be GET
def get_chemical_name(request):
     # Simpler version - assumes brand name is enough? Might return multiple if ambiguous.
    if request.method == 'GET':
        try:
            brand_name = request.GET.get("brand_name", "").strip()
            if not brand_name: return JsonResponse({"chemical_name": None}) # Return None if no brand provided

            # Find the first chemical name matching the brand (case-insensitive)
            chemical_name = PharmacyMedicine.objects.filter(brand_name__iexact=brand_name)\
                             .values_list("chemical_name", flat=True).first()

            return JsonResponse({"chemical_name": chemical_name}) # Returns None if not found
        except Exception as e:
            logger.exception("Error in get_chemical_name")
            return JsonResponse({"error": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt # Should be GET
def get_current_stock(request):
    """ Fetch current stock, summing quantities for identical items/batches. """
    if request.method == 'GET':
        try:
            # Group by all identifying fields including expiry date to sum quantities per batch
            stock_data = (
                PharmacyStock.objects
                .values("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
                .annotate(
                    total_quantity_batch=Sum("total_quantity"), # Sum total quantity for this batch
                    quantity_batch=Sum("quantity"), # Sum current quantity for this batch
                    latest_entry_date=Max("entry_date") # Get the latest entry date for this batch
                )
                .filter(quantity_batch__gt=0) # Only include batches with quantity > 0
                .order_by("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
            )

            data = [
                {
                    "entry_date" : entry["latest_entry_date"].isoformat() if entry["latest_entry_date"] else None,
                    "medicine_form": entry["medicine_form"],
                    "brand_name": entry["brand_name"],
                    "chemical_name": entry["chemical_name"],
                    "dose_volume": entry["dose_volume"],
                    "total_quantity": entry["total_quantity_batch"], # Use summed total
                    "quantity_expiry": entry["quantity_batch"], # Use summed current quantity
                    "expiry_date": entry["expiry_date"].strftime("%b-%y") if entry["expiry_date"] else None,
                }
                for entry in stock_data
            ]
            return JsonResponse({"stock": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_current_stock")
            return JsonResponse({"error": "Server error fetching current stock.", "detail": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt # Should be POST? Or part of a scheduled task?
def get_current_expiry(request):
    """
    Identifies stock expiring this month or next month, moves it to ExpiryRegister,
    deletes it from PharmacyStock, and returns the current ExpiryRegister items.
    """
    # This endpoint modifies data, POST might be more appropriate than GET,
    # although it also returns data. Consider splitting if needed.
    if request.method == 'POST':
        try:
            today = date.today()
            current_month = today.month; current_year = today.year
            next_month_date = today + relativedelta(months=1)
            next_month = next_month_date.month; next_year = next_month_date.year

            with transaction.atomic():
                # Find medicines expiring exactly in the current month OR exactly in the next month
                expiry_medicines = PharmacyStock.objects.select_for_update().filter(
                    Q(expiry_date__year=current_year, expiry_date__month=current_month) |
                    Q(expiry_date__year=next_year, expiry_date__month=next_month)
                )

                medicines_processed_count = 0
                for medicine in expiry_medicines:
                    # Create ExpiryRegister entry
                    ExpiryRegister.objects.create(
                        entry_date=medicine.entry_date, # Preserve original entry date
                        medicine_form=medicine.medicine_form, brand_name=medicine.brand_name,
                        chemical_name=medicine.chemical_name, dose_volume=medicine.dose_volume,
                        quantity=medicine.quantity, # Record the quantity at time of expiry flagging
                        expiry_date=medicine.expiry_date,
                        total_quantity = medicine.total_quantity
                        # removed_date is initially null
                    )
                    medicine.delete() # Remove from active stock
                    medicines_processed_count += 1

                logger.info(f"Processed {medicines_processed_count} soon-to-expire medicines.")

            # Fetch medicines from ExpiryRegister not yet marked as removed
            expired_data_qs = ExpiryRegister.objects.filter(removed_date__isnull=True).order_by('expiry_date')
            expired_data = list(expired_data_qs.values(
                "id", "medicine_form", "brand_name", "chemical_name", "dose_volume", "quantity", "expiry_date", "total_quantity"
            ))

            data = [
                {
                    "id": entry["id"], "medicine_form": entry["medicine_form"], "brand_name": entry["brand_name"],
                    "chemical_name": entry["chemical_name"], "dose_volume": entry["dose_volume"],
                    "quantity": entry["quantity"],
                    "expiry_date": entry["expiry_date"].strftime("%b-%y") if entry["expiry_date"] else "N/A",
                    "total_quantity": entry["total_quantity"]
                }
                for entry in expired_data
            ]
            return JsonResponse({"expiry_stock": data, "processed_count": medicines_processed_count}, safe=False)

        except Exception as e:
            logger.exception("Error processing expiry register.")
            return JsonResponse({"error": f"An internal server error occurred: {str(e)}"}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

try:
    from .models import DailyQuantity
except ImportError:
    logging.critical("Failed to import DailyQuantity model. Ensure it's defined in models.py and the import path is correct.")
    # Raise configuration error during startup if essential model is missing
    raise ImproperlyConfigured("DailyQuantity model is not available.")

try:
    # Replace 'PharmacyStock' with your actual stock model name
    from .models import PharmacyStock
    HAS_STOCK_MODEL = True
    if PharmacyStock is None:
        raise ImportError("PharmacyStock imported as None") # Be explicit if import results in None
except ImportError:
    HAS_STOCK_MODEL = False
    logging.warning("Optional PharmacyStock model not found or failed to import. Fetching logic will rely solely on DailyQuantity, which might be incomplete for identifying all possible stock items.")


#update_pharmacy_stock
@csrf_exempt
def update_pharmacy_stock(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            chemical_name = data.get("chemicalName")
            brand_name = data.get("brandName")
            expiry_date = data.get("expiryDate")
            dose_volume = data.get("doseVolume")
            quantity = data.get("quantity")
            action = data.get("action")

            # --- Validation ---
            if not all([chemical_name, brand_name, expiry_date, dose_volume, action]):
                return JsonResponse({"error": "Missing required fields (chemicalName, brandName, expiryDate, doseVolume, action)."}, status=400)

            if not isinstance(quantity, (int, float)) or quantity <= 0:
                 return JsonResponse({"error": "Quantity must be a positive number."}, status=400)

            if action not in ['increase', 'decrease']:
                return JsonResponse({"error": "Invalid action. Must be 'increase' or 'decrease'."}, status=400)
            
            with transaction.atomic():
                # Lock the pharmacy stock record to prevent race conditions
                try:
                    medicine = PharmacyStock.objects.select_for_update().get(
                        chemical_name=chemical_name, 
                        brand_name=brand_name, 
                        dose_volume=dose_volume, 
                        expiry_date=expiry_date
                    )
                except PharmacyStock.DoesNotExist:
                    return JsonResponse({"error": "Medicine stock not found."}, status=404)
                
                # Update the main PharmacyStock quantity
                if action == 'increase':
                    medicine.quantity = F('quantity') + quantity
                else: # 'decrease'
                    if medicine.quantity < quantity:
                        return JsonResponse({
                            "error": "Insufficient stock.", 
                            "current_stock": medicine.quantity
                        }, status=400)
                    medicine.quantity = F('quantity') - quantity
                
                medicine.save(update_fields=['quantity'])

                # --- CORRECTED LOGIC FOR DailyQuantity ---
                # Only update the daily usage/dispensed count when stock is decreased.
                if action == 'decrease':
                    # Find or create a record for this specific medicine batch for today.
                    # This tracks the total amount dispensed today.
                    daily_record, created = DailyQuantity.objects.get_or_create(
                        chemical_name=chemical_name,
                        brand_name=brand_name,
                        dose_volume=dose_volume,
                        expiry_date=expiry_date,
                        date=timezone.now().date(),
                        # 'defaults' is used only when creating a new record for the day.
                        defaults={'quantity': 0} 
                    )
                    
                    # Atomically ADD the dispensed quantity to today's total.
                    # This will never result in a negative number.
                    daily_record.quantity = F('quantity') + quantity
                    daily_record.save(update_fields=['quantity'])
                
                return JsonResponse({"message": "Stock updated successfully", "success": True})
                    
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("Error updating pharmacy stock")
            return JsonResponse({"error": "An unexpected server error occurred.", "detail": str(e)}, status=500)
    else:
        # The request method is not POST
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response


def get_days_in_month(year, month):
    """Returns the number of days in a given month (1-indexed)."""
    if not (1 <= month <= 12):
        raise ValueError("Month must be between 1 and 12")
    if month == 12:
        next_month_first_day = date(year + 1, 1, 1)
    else:
        next_month_first_day = date(year, month + 1, 1)
    last_day_current_month = next_month_first_day - timedelta(days=1)
    return last_day_current_month.day

def parse_expiry_date(date_str):
    # ... (implementation from previous answer) ...
    if not date_str or not isinstance(date_str, str): return None
    try:
        parsed = django_parse_date(date_str)
        if parsed: return parsed
        else:
             try: return date.fromisoformat(date_str) # Strict ISO YYYY-MM-DD
             except ValueError:
                 try: # Handle potential datetime string with timezone
                    parsed_dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    return parsed_dt.date()
                 except ValueError:
                    logger.warning(f"Could not parse expiry date string: {date_str}")
                    return None
    except Exception as e:
        logger.error(f"Unexpected error during expiry date parsing for '{date_str}': {e}")
        return None



@csrf_exempt
def get_prescription_in_data(request):
    """
    Fetches unique stock items and their corresponding daily quantities
    for a given month and year.
    """
    # Check model availability again (belt-and-suspenders)
    if DailyQuantity is None:
        return JsonResponse({'error': 'Server configuration error: DailyQuantity model not available.'}, status=500)

    if request.method != 'GET':
        logger.warning(f"get_prescription_in_data rejected non-GET request: {request.method}")
        return JsonResponse({'error': 'GET method required'}, status=405)

    try:
        # --- Parameter Validation ---
        today = timezone.now().date()
        try:
            year_str = request.GET.get('year', str(today.year))
            month_str = request.GET.get('month', str(today.month))
            year = int(year_str)
            month = int(month_str)
            if not (1 <= month <= 12): raise ValueError("Month must be between 1 and 12.")
            if year < 1900 or year > 2100: raise ValueError("Year out of reasonable range.")
        except (ValueError, TypeError):
             logger.warning(f"Invalid year/month parameters: year='{request.GET.get('year')}', month='{request.GET.get('month')}'")
             return JsonResponse({'error': 'Invalid or missing year/month parameter.'}, status=400)

        logger.info(f"Fetching prescription-in data for {year}-{month:02d}")

        # --- Date Range Calculation ---
        try:
            start_date = date(year, month, 1)
            days_in_req_month = get_days_in_month(year, month)
            end_date = date(year, month, days_in_req_month)
        except ValueError as date_err:
             logger.error(f"Error calculating date range for {year}-{month}: {date_err}")
             return JsonResponse({'error': 'Internal error calculating month days.'}, status=500)

        # --- Step 1: Get Unique Stock Identifiers ---
        unique_items_qs = None
        required_fields = ['chemical_name', 'brand_name', 'dose_volume'] # Core identifiers
        stock_fields_to_get = required_fields + ['expiry_date']

        if HAS_STOCK_MODEL and PharmacyStock:
            logger.debug("Querying PharmacyStock model for unique items.")
            # *** ADJUST field names to match your PharmacyStock model ***
            unique_items_qs = PharmacyStock.objects.values(*stock_fields_to_get).distinct().order_by('chemical_name', 'brand_name', 'expiry_date')
        elif DailyQuantity:
             logger.warning("Querying DailyQuantity as fallback for unique items.")
             # This might miss items never entered or only with far future expiry
             unique_items_qs = DailyQuantity.objects.filter(
                 # Look for entries in the requested month OR relevant expiry
                 Q(date__year=year, date__month=month) | Q(expiry_date__gte=start_date) | Q(expiry_date__isnull=True)
             ).values(*stock_fields_to_get).distinct().order_by('chemical_name', 'brand_name', 'expiry_date')
        else:
             logger.critical("Configuration Error: No model available to determine unique stock items.")
             return JsonResponse({'error': 'Server configuration error: Cannot determine stock items.'}, status=500)

        # Convert to list for efficient iteration & check if empty
        item_identifiers_list = list(unique_items_qs)
        if not item_identifiers_list:
            logger.warning(f"No unique stock items identified for {year}-{month} based on available data.")
            return JsonResponse([], safe=False) # Return empty list if no items found

        logger.debug(f"Found {len(item_identifiers_list)} unique item identifiers.")

        # --- Step 2: Fetch Relevant Daily Quantities ---
        q_objects_filter = Q()
        valid_identifiers_found_for_q = False
        for item in item_identifiers_list:
             # Ensure the item dict has the required keys for filtering
             if all(k in item for k in required_fields):
                 q_objects_filter |= Q(
                     chemical_name=item['chemical_name'],
                     brand_name=item['brand_name'],
                     dose_volume=item['dose_volume'],
                     expiry_date=item.get('expiry_date') # Handles None expiry
                 )
                 valid_identifiers_found_for_q = True
             else:
                  logger.warning(f"Skipping identifier dict (missing keys) when building Q filter: {item}")

        daily_data_qs = DailyQuantity.objects.none() # Default to empty queryset
        if valid_identifiers_found_for_q:
            # Fetch records matching any valid identifier within the date range
            daily_data_qs = DailyQuantity.objects.filter(
                q_objects_filter,
                date__gte=start_date,
                date__lte=end_date
            ).values(
                'chemical_name', 'brand_name', 'dose_volume', 'expiry_date',
                'date', 'quantity' # Ensure quantity is selected
            )
            logger.debug(f"Found {daily_data_qs.count()} daily quantity records for the month.")
        else:
             logger.warning("No valid identifiers found to build DailyQuantity filter.")


        # --- Step 3: Organize Daily Data into a Lookup Map ---
        # Key: tuple(chem, brand, dose, expiry_obj_or_None), Value: {day_num: qty}
        daily_quantities_map = {}
        for dq in daily_data_qs:
            # Validate essential keys before creating map entry
            if not all(k in dq for k in required_fields + ['date']):
                logger.warning(f"Skipping daily quantity record (missing keys) for map: {dq}")
                continue
            expiry_key = dq.get('expiry_date') # Date object or None from DB
            key = (dq['chemical_name'], dq['brand_name'], dq['dose_volume'], expiry_key)
            try:
                day_num = dq['date'].day
                quantity_val = dq.get('quantity', 0) # Default to 0 if quantity missing
            except AttributeError: # Handle if 'date' is somehow not a date object
                 logger.warning(f"Skipping daily quantity record with invalid date object: {dq}")
                 continue

            if key not in daily_quantities_map:
                daily_quantities_map[key] = {}
            daily_quantities_map[key][day_num] = quantity_val

        # --- Step 4: Structure Final JSON Response ---
        structured_data = []
        processed_chemicals = {} # Helper: chemical_name -> index in structured_data
        s_no_counter = 1

        for item in item_identifiers_list:
            # Validate item before structuring
            if not all(k in item for k in required_fields):
                 logger.warning(f"Skipping item during final structuring (missing keys): {item}")
                 continue

            chem_name = item['chemical_name']

            # Find or create the chemical group in the result list
            if chem_name not in processed_chemicals:
                 group_index = len(structured_data)
                 processed_chemicals[chem_name] = group_index
                 structured_data.append({
                     "s_no": s_no_counter,
                     "chemical_name": chem_name,
                     "brands": []
                 })
                 s_no_counter += 1
            else:
                 group_index = processed_chemicals[chem_name]

            # Prepare data for the current brand variant
            brand_name = item['brand_name']
            dose_volume = item['dose_volume']
            expiry_date_obj = item.get('expiry_date') # Date object or None
            # Format date for JSON response (ISO format recommended)
            expiry_date_str = expiry_date_obj.isoformat() if expiry_date_obj else None

            # Lookup daily quantities using the map
            lookup_key = (chem_name, brand_name, dose_volume, expiry_date_obj)
            brand_daily_data_raw = daily_quantities_map.get(lookup_key, {}) # Get {day: qty} or {}

            # Format the daily quantities object for the frontend
            daily_quantities_formatted = {}
            monthly_total = 0
            for i in range(1, days_in_req_month + 1):
                qty = brand_daily_data_raw.get(i, 0) # Default to 0
                # Ensure frontend receives number or empty string (consistency)
                daily_quantities_formatted[f"day_{i}"] = qty if qty != 0 else '' # Send empty string for 0? Or keep 0? FE handles '' or 0. Let's keep 0.
                # daily_quantities_formatted[f"day_{i}"] = qty # Keep as number (0 or positive)
                monthly_total += qty

            # Append brand details to its chemical group
            # Ensure target list exists
            if group_index < len(structured_data) and 'brands' in structured_data[group_index]:
                structured_data[group_index]['brands'].append({
                    "brand_name": brand_name,
                    "dosage": dose_volume, # Match frontend 'dosage' key
                    "daily_quantities": daily_quantities_formatted,
                    "monthly_total": monthly_total,
                    "expiry_date": expiry_date_str, # Send ISO string or null
                })
            else:
                logger.error(f"Logic error: Could not find chemical group at index {group_index} for chemical {chem_name}")


        logger.info(f"Successfully structured data for {len(structured_data)} chemicals for {year}-{month:02d}.")
        return JsonResponse(structured_data, safe=False) # Return the list

    # --- General Exception Handling ---
    except Exception as e:
        logger.exception(f"Critical error occurred in get_prescription_in_data for {request.GET.get('year')}-{request.GET.get('month')}")
        return JsonResponse({'error': f'An unexpected server error occurred: {type(e).__name__}'}, status=500)


import json
# =================================================================
# === FIX 1: ADJUST THE IMPORTS FOR CLARITY AND CORRECTNESS     ===
# =================================================================
from datetime import datetime, time, date

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict

# Assume your models are imported here...

@csrf_exempt
def get_investigation_details(request, aadhar):
    if request.method == "POST":
        try:
            print(f"Request received for Aadhar: {aadhar}")
            if not employee_details.objects.filter(aadhar=aadhar).exists():
                return JsonResponse({'error': f'No employee found with Aadhar: {aadhar}'}, status=404)
            
            from_date_str = None
            to_date_str = None
            if request.body:
                try:
                    data = json.loads(request.body)
                    from_date_str = data.get('fromDate')
                    to_date_str = data.get('toDate')
                except json.JSONDecodeError:
                    pass

            model_map = {
                'heamatalogy': heamatalogy,
                'routinesugartests': RoutineSugarTests,
                # ... other models
            }

            response_data = {}

            for key, model in model_map.items():
                try:
                    query = model.objects.filter(aadhar=aadhar)

                    if from_date_str and to_date_str:
                        # =================================================================
                        # === FIX 2: CALL DATETIME METHODS CORRECTLY                  ===
                        # =================================================================
                        # Use datetime.strptime directly, not datetime.datetime.strptime
                        to_date_obj = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                        
                        # Use datetime.combine and time.max directly
                        to_datetime_end_of_day = datetime.combine(to_date_obj, time.max)
                        
                        query = query.filter(entry_date__gte=from_date_str, entry_date__lte=to_datetime_end_of_day)
                    
                    all_records = query.order_by('-entry_date')

                    records_list = []
                    for record_instance in all_records:
                        record_dict = model_to_dict(record_instance)

                        if hasattr(record_instance, 'entry_date'):
                            record_dict['entry_date'] = record_instance.entry_date

                        for field_name, field_value in record_dict.items():
                            # Use `date` and `datetime` from the import
                            if isinstance(field_value, (date, datetime)):
                                record_dict[field_name] = field_value.isoformat()
                        
                        records_list.append(record_dict)

                    response_data[key] = records_list
                
                except Exception as e:
                    print(f"--> NOTICE: Skipping model '{key}' due to an error. Details: {type(e).__name__}: {str(e)}")
                    continue

            return JsonResponse(response_data, status=200)

        except Exception as e:
            print(f"!!! CRITICAL ERROR: An unexpected error occurred in the view. Details: {str(e)}")
            return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method. Please use POST.'}, status=405)


@csrf_exempt
@transaction.atomic
def update_daily_quantities(request):
    """
    Receives daily quantity updates and saves them based on
    chemical, brand, dose, expiry_date, and date.
    """
    if DailyQuantity is None:
        return JsonResponse({'error': 'Server configuration error: DailyQuantity model not available.'}, status=500)

    if request.method != 'POST':
        logger.warning("update_daily_quantities rejected non-POST request")
        return JsonResponse({'error': 'POST method required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        if not isinstance(data, list):
            raise ValueError("Invalid data format: Expected a list of quantity updates.")

        updated_count = 0
        created_count = 0
        skipped_count = 0
        processed_entries = 0

        logger.info(f"Received {len(data)} entries for daily quantity update.")
        print(f"--- Starting Daily Quantity Update Transaction ---") # DEBUG START

        for entry in data:
            processed_entries += 1
            print(f"\n--- Processing Entry #{processed_entries} ---") # DEBUG ENTRY START
            print(f"  Raw Entry Data: {entry}") # DEBUG RAW

            # --- Extract and Validate ---
            chem_name = entry.get('chemical_name')
            brand_name = entry.get('brand_name')
            dose_volume = entry.get('dose_volume') # Keep original type for now
            expiry_date_str = entry.get('expiry_date')
            year = entry.get('year')
            month = entry.get('month')
            day = entry.get('day')
            quantity_val = entry.get('quantity')

            # Refined Validation
            valid = True
            if not (isinstance(chem_name, str) and chem_name): valid = False; logger.warning(f"Invalid chem_name: {chem_name}")
            if not (isinstance(brand_name, str) and brand_name): valid = False; logger.warning(f"Invalid brand_name: {brand_name}")
            if dose_volume is None: valid = False; logger.warning(f"Missing dose_volume") # Check presence
            if not isinstance(year, int): valid = False; logger.warning(f"Invalid year type: {type(year)}")
            if not (isinstance(month, int) and 1 <= month <= 12): valid = False; logger.warning(f"Invalid month: {month}")
            if not (isinstance(day, int) and 1 <= day <= 31): valid = False; logger.warning(f"Invalid day: {day}")
            if not (isinstance(quantity_val, int) and quantity_val >= 0): valid = False; logger.warning(f"Invalid quantity: {quantity_val}")

            if not valid:
                logger.warning(f"Skipping entry #{processed_entries} due to missing/invalid core data types.")
                skipped_count += 1
                continue

            # --- Parse Dates and Quantity ---
            try:
                entry_date = date(year, month, day)
                entry_expiry_date = parse_expiry_date(expiry_date_str)
                entry_quantity = quantity_val # Already validated
                print(f"  Parsed Date: {entry_date} ({type(entry_date)})") # DEBUG PARSED
                print(f"  Parsed Expiry: {entry_expiry_date} ({type(entry_expiry_date)})") # DEBUG PARSED
                print(f"  Parsed Quantity: {entry_quantity} ({type(entry_quantity)})") # DEBUG PARSED
            except (ValueError, TypeError) as e:
                logger.warning(f"Skipping entry #{processed_entries} due to invalid date during object creation ({e}): {entry}")
                skipped_count += 1
                continue

            # --- Prepare for DB Operation ---
            # Convert dose_volume to string for lookup IF model uses CharField
            # *** ADJUST THIS if your model field is DecimalField/FloatField etc. ***
            dose_volume_str = str(dose_volume)

            lookup_keys = {
                'chemical_name': chem_name,
                'brand_name': brand_name,
                'dose_volume': dose_volume_str,
                'expiry_date': entry_expiry_date,
                'date': entry_date,
            }
            defaults = {
                'quantity': entry_quantity,
                # Add expiry to defaults as well, in case it needs updating or setting on create
                'expiry_date': entry_expiry_date, # Keep original expiry unless specific logic added
            }
            print(f"  Lookup Keys for DB: {lookup_keys}") # DEBUG KEYS
            print(f"  Defaults for DB: {defaults}") # DEBUG DEFAULTS

            # --- Database update_or_create ---
            try:
                obj, created = DailyQuantity.objects.update_or_create(
                    defaults=defaults,
                    **lookup_keys
                )
                action = "CREATED" if created else "UPDATED"
                print(f"  DB Result: {action} record with ID: {obj.id}") # DEBUG DB RESULT
                if created: created_count += 1
                else: updated_count += 1
            except Exception as db_error:
                 logger.error(f"Database error processing entry #{processed_entries} {lookup_keys}: {db_error}")
                 print(f"  DB ERROR: {db_error}") # DEBUG DB ERROR
                 skipped_count += 1
                 # Decide on transaction strategy: continue or rollback?
                 # To rollback on first error: transaction.set_rollback(True); raise db_error
                 # Current behavior: log error and continue with next entry

        # --- Response ---
        msg = f'Daily quantities processed: {created_count} created, {updated_count} updated, {skipped_count} skipped out of {processed_entries} received.'
        logger.info(msg)
        print(f"--- Finished Daily Quantity Update Transaction: {msg} ---") # DEBUG END
        status_code = 200 if skipped_count == 0 else 207
        return JsonResponse({
            'message': msg,
            'created': created_count, 'updated': updated_count,
            'skipped': skipped_count, 'received': processed_entries
        }, status=status_code)

    # --- General Error Handling ---
    except json.JSONDecodeError:
        logger.error("update_daily_quantities failed: Invalid JSON.")
        print("--- ERROR: Invalid JSON received ---") # DEBUG JSON ERROR
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    except ValueError as ve:
         logger.error(f"update_daily_quantities validation failed: {ve}")
         print(f"--- ERROR: Validation Error - {ve} ---") # DEBUG VALIDATION ERROR
         return JsonResponse({'error': str(ve)}, status=400)
    except Exception as e:
        logger.exception("update_daily_quantities failed unexpectedly.")
        print(f"--- CRITICAL ERROR: {type(e).__name__} - {e} ---") # DEBUG UNEXPECTED ERROR
        return JsonResponse({'error': f'An unexpected server error occurred: {type(e).__name__}'}, status=500)

        from django.http import JsonResponse


@csrf_exempt
def remove_expired_medicine(request):
    """ Mark expired medicine as removed and update history archive date. """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            medicine_id = data.get("id")
            if not medicine_id: return JsonResponse({"error": "Medicine ID ('id') is required."}, status=400)

            with transaction.atomic():
                medicine = ExpiryRegister.objects.select_for_update().get(id=medicine_id)

                if medicine.removed_date is not None:
                    return JsonResponse({"error": "Medicine already marked as removed."}, status=400)

                today = date.today()
                medicine.removed_date = today
                medicine.save(update_fields=['removed_date'])

                

            return JsonResponse({"message": "Medicine removed successfully", "success": True})

        except ExpiryRegister.DoesNotExist: return JsonResponse({"error": "Medicine not found in expiry register"}, status=404)
        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception(f"Error removing expired medicine ID {medicine_id or 'N/A'}")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid request. Use POST."}, status=405)
         response['Allow'] = 'POST'
         return response



@csrf_exempt # Should be GET
def get_expiry_register(request):
    """ Fetch history of removed/expired medicines from ExpiryRegister. """
    if request.method == 'GET':
        try:
            from_date_str = request.GET.get("from_date")
            to_date_str = request.GET.get("to_date")

            queryset = ExpiryRegister.objects.filter(removed_date__isnull=False) # Only show those marked removed

            from_date = parse_date_internal(from_date_str)
            to_date = parse_date_internal(to_date_str)
            if from_date: queryset = queryset.filter(removed_date__gte=from_date)
            if to_date: queryset = queryset.filter(removed_date__lte=to_date)

            expired_medicines = queryset.order_by('-removed_date').values( # Order by removal date
                "id", "entry_date", "medicine_form", "brand_name", "chemical_name", "dose_volume",
                "quantity", "expiry_date", "removed_date", "total_quantity"
            )

            data = []
            for entry in expired_medicines:
                # Fetch total quantity using the helper
                total_quantity = get_total_quantity(
                    entry["entry_date"], entry["medicine_form"], entry["brand_name"],
                    entry["chemical_name"], entry["dose_volume"], entry["expiry_date"]
                )
                data.append({
                    "id": entry["id"],
                    "medicine_form": entry["medicine_form"], "brand_name": entry["brand_name"],
                    "chemical_name": entry["chemical_name"], "dose_volume": entry["dose_volume"],
                    "quantity": entry["quantity"], # Quantity at time of expiry flagging
                    "expiry_date": entry["expiry_date"].strftime("%b-%y") if entry["expiry_date"] else "",
                    "removed_date": entry["removed_date"].strftime("%d-%b-%Y") if entry["removed_date"] else "", # More specific format
                    "total_quantity": entry["total_quantity"] # Show original total quantity if found
                })

            return JsonResponse({"expiry_register": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_expiry_register")
            return JsonResponse({"error": "Server error fetching expiry register.", "detail": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt
def get_expiry_dates(request):
    if request.method == 'GET':
        try:
            chemical_name = request.GET.get("chemical_name", "").strip()
            brand_name = request.GET.get("brand_name", "").strip()
            dose_volume = request.GET.get("dose_volume", "").strip()

            logger.debug(f"get_expiry_dates: chemical_name='{chemical_name}', brand_name='{brand_name}', dose_volume='{dose_volume}'")

            if not chemical_name or not brand_name or not dose_volume:
                return JsonResponse({"suggestions": []})

            # Important: Filter by exact values
            expiry_dates = (
                PharmacyStock.objects.filter(  # Use PharmacyStock model
                    chemical_name__iexact=chemical_name,
                    brand_name__iexact=brand_name,
                    dose_volume__iexact=dose_volume  # Case-insensitive
                )
                .values_list("expiry_date", flat=True)
                .distinct()
                .order_by("expiry_date")
            )

            formatted_expiry_dates = [date.strftime('%Y-%m-%d') for date in expiry_dates if date] #Handle if expiry_date is null/None
            logger.debug(f"Expiry dates for {chemical_name}, {brand_name}, {dose_volume}: {formatted_expiry_dates}")
            return JsonResponse({"suggestions": formatted_expiry_dates})

        except Exception as e:
            logger.exception("get_expiry_dates failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)



@csrf_exempt  # Should be GET, review if you want to keep it exempt or not
def get_quantity_suggestions(request):
    if request.method == 'GET':
        try:
            chemical_name = request.GET.get("chemical_name", "").strip()
            brand_name = request.GET.get("brand_name", "").strip()
            expiry_date = request.GET.get("expiry_date", "").strip() # Get expiry date from request

            if not chemical_name or not brand_name or not expiry_date:
                return JsonResponse({"suggestions": []})

            # Query PharmacyStock objects matching criteria
            #Using Q objects for more complex query logic to handle different cases
            quantities = PharmacyStock.objects.filter(
                Q(chemical_name__iexact=chemical_name) &
                Q(brand_name__iexact=brand_name) &
                Q(expiry_date=expiry_date) # Match expiry date directly, format must match YYYY-MM-DD
            ).values_list("quantity", flat=True).distinct().order_by("quantity") #Distinct and order by quantity

            #Convert to list and log output
            qty_suggestions = list(quantities)

            logger.debug(f"Quantity suggestions for {chemical_name}, {brand_name}, {expiry_date}: {qty_suggestions}")
            return JsonResponse({"suggestions": qty_suggestions})

        except ValueError as ve: #Catch Value Errors when incorrect date formats passed
            logger.error(f"Date parsing error: {ve}")
            return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD.", "detail": str(ve)}, status=400)

        except Exception as e:
            logger.exception("get_quantity_suggestions failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=405)


@csrf_exempt # Should be GET
def get_discarded_medicines(request):
    if request.method == 'GET':
        try:
            discarded_qs = DiscardedMedicine.objects.all()
            from_date_str = request.GET.get('from_date')
            to_date_str = request.GET.get('to_date')
            from_date = parse_date_internal(from_date_str)
            to_date = parse_date_internal(to_date_str)
            if from_date: discarded_qs = discarded_qs.filter(entry_date__gte=from_date) # Filter by entry_date
            if to_date: discarded_qs = discarded_qs.filter(entry_date__lte=to_date)

            data = []
            for entry in discarded_qs.order_by('-entry_date'):
                 total_quantity = get_total_quantity(entry.entry_date, entry.medicine_form, entry.brand_name, entry.chemical_name, entry.dose_volume, entry.expiry_date)
                 data.append({
                     "id": entry.id, "medicine_form": entry.medicine_form, "brand_name": entry.brand_name,
                     "chemical_name": entry.chemical_name, "dose_volume": entry.dose_volume,
                     "quantity": entry.quantity, # Quantity discarded
                     "total_quantity": total_quantity, # Original total qty
                     "expiry_date": entry.expiry_date.strftime("%b-%y") if entry.expiry_date else "",
                     "reason": entry.reason,
                     "entry_date": entry.entry_date.strftime("%d-%b-%Y") if entry.entry_date else "", # Date discarded
                 })
            return JsonResponse({"discarded_medicines": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_discarded_medicines")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
         response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
         response['Allow'] = 'GET'
         return response

@csrf_exempt
def add_discarded_medicine(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date") # Expect YYYY-MM
            quantity_str = data.get("quantity")
            reason = data.get("reason")

            # Validation
            if not all([medicine_form, brand_name, chemical_name, dose_volume, expiry_date_str, quantity_str, reason]):
                 return JsonResponse({"error": "Missing required fields for discarding medicine."}, status=400)
            try:
                 quantity_to_discard = int(quantity_str)
                 if quantity_to_discard <= 0: raise ValueError("Quantity must be positive")
            except (ValueError, TypeError):
                  return JsonResponse({"error": "Invalid quantity."}, status=400)
            try:
                  expiry_date = datetime.strptime(f"{expiry_date_str}-01", "%Y-%m-%d").date()
            except ValueError:
                  return JsonResponse({"error": "Invalid expiry date format (YYYY-MM)."}, status=400)

            with transaction.atomic():
                # Find the stock item to deduct from
                stock_item = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, expiry_date=expiry_date
                ).first()

                if not stock_item:
                    return JsonResponse({"error": "Matching medicine batch not found in active stock."}, status=404)
                if stock_item.quantity < quantity_to_discard:
                    return JsonResponse({"error": f"Not enough quantity in stock. Available: {stock_item.quantity}, Requested: {quantity_to_discard}."}, status=400)

                # Deduct from stock
                stock_item.quantity -= quantity_to_discard
                # Decide if total_quantity should also be reduced - typically yes for discard/damage
                stock_item.total_quantity -= quantity_to_discard
                stock_item.save()

                # Add to DiscardedMedicine log
                DiscardedMedicine.objects.create(
                    entry_date=date.today(), # Log when it was discarded
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, quantity=quantity_to_discard,
                    expiry_date=expiry_date, reason=reason,
                    # Link back to original stock entry date if needed/possible
                    # original_entry_date=stock_item.entry_date # Requires adding field to DiscardedMedicine
                )

            logger.info(f"Discarded {quantity_to_discard} of {brand_name} (Expiry: {expiry_date_str}). Reason: {reason}")
            return JsonResponse({"message": "Discarded medicine recorded successfully", "success": True})

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("Error adding discarded medicine.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

@csrf_exempt # Should be GET
def get_ward_consumables(request):
    if request.method == 'GET':
        try:
            consumables_qs = WardConsumables.objects.all()
            from_date_str = request.GET.get("from_date")
            to_date_str = request.GET.get("to_date")
            from_date = parse_date_internal(from_date_str)
            to_date = parse_date_internal(to_date_str)
            if from_date: consumables_qs = consumables_qs.filter(consumed_date__gte=from_date) # Filter by consumed_date
            if to_date: consumables_qs = consumables_qs.filter(consumed_date__lte=to_date)

            data = []
            for entry in consumables_qs.order_by("-consumed_date", "-entry_date"): # Order by consumed, then entry
                 total_quantity = get_total_quantity(entry.entry_date, entry.medicine_form, entry.brand_name, entry.chemical_name, entry.dose_volume, entry.expiry_date)
                 data.append({
                     "id": entry.id,
                     # "entry_date": entry.entry_date.strftime("%Y-%m-%d") if entry.entry_date else None, # Original stock entry date
                     "medicine_form": entry.medicine_form, "brand_name": entry.brand_name,
                     "chemical_name": entry.chemical_name, "dose_volume": entry.dose_volume,
                     "quantity": entry.quantity, # Quantity consumed
                     "total_quantity": total_quantity, # Original total qty
                     "expiry_date": entry.expiry_date.strftime("%b-%y") if entry.expiry_date else None,
                     "consumed_date": entry.consumed_date.strftime("%d-%b-%Y") if entry.consumed_date else None, # Date consumed
                 })
            return JsonResponse({"ward_consumables": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_ward_consumables")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt
def add_ward_consumable(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8')) # Decode explicitly
            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date") # Expect YYYY-MM
            consumed_date_str = data.get("consumed_date") # Expect YYYY-MM-DD
            quantity_str = data.get("quantity")

            # Validation
            if not all([medicine_form, brand_name, chemical_name, dose_volume, expiry_date_str, consumed_date_str, quantity_str]):
                 return JsonResponse({"error": "Missing required consumable information."}, status=400)
            try:
                 quantity_to_consume = int(quantity_str)
                 if quantity_to_consume <= 0: raise ValueError("Quantity must be positive")
            except (ValueError, TypeError): return JsonResponse({"error": "Invalid quantity."}, status=400)
            try: expiry_date = datetime.strptime(f"{expiry_date_str}-01", "%Y-%m-%d").date()
            except ValueError: return JsonResponse({"error": "Invalid expiry date format (YYYY-MM)."}, status=400)
            consumed_date = parse_date_internal(consumed_date_str)
            if not consumed_date: return JsonResponse({"error": "Invalid consumed date format (YYYY-MM-DD)."}, status=400)

            with transaction.atomic():
                stock_item = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, expiry_date=expiry_date
                ).first()

                if not stock_item: return JsonResponse({"error": "Matching medicine batch not found in PharmacyStock."}, status=404)
                if stock_item.quantity < quantity_to_consume:
                    return JsonResponse({"error": f"Not enough quantity. Available: {stock_item.quantity}, Requested: {quantity_to_consume}."}, status=400)

                stock_item.quantity -= quantity_to_consume
                # Do NOT reduce total_quantity for consumption, only for discard/damage
                stock_item.save()

                WardConsumables.objects.create(
                    entry_date=stock_item.entry_date, # Link to original entry if needed
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, quantity=quantity_to_consume,
                    expiry_date=expiry_date, consumed_date=consumed_date,
                )

            logger.info(f"Consumed {quantity_to_consume} of Ward item {brand_name} (Expiry: {expiry_date_str}) on {consumed_date_str}")
            return JsonResponse({"message": "Ward consumable added and stock updated successfully", "success": True})

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("Error adding ward consumable.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)
        response['Allow'] = 'POST'
        return response

@csrf_exempt # Should be GET
def get_ambulance_consumables(request):
     if request.method == 'GET':
        try:
            consumables_qs = AmbulanceConsumables.objects.all()
            from_date_str = request.GET.get("from_date")
            to_date_str = request.GET.get("to_date")
            from_date = parse_date_internal(from_date_str)
            to_date = parse_date_internal(to_date_str)
            if from_date: consumables_qs = consumables_qs.filter(consumed_date__gte=from_date)
            if to_date: consumables_qs = consumables_qs.filter(consumed_date__lte=to_date)

            data = []
            for entry in consumables_qs.order_by("-consumed_date", "-entry_date"):
                 total_quantity = get_total_quantity(entry.entry_date, entry.medicine_form, entry.brand_name, entry.chemical_name, entry.dose_volume, entry.expiry_date)
                 data.append({
                     "id": entry.id,
                     "medicine_form": entry.medicine_form, "brand_name": entry.brand_name,
                     "chemical_name": entry.chemical_name, "dose_volume": entry.dose_volume,
                     "quantity": entry.quantity, # Quantity consumed
                     "total_quantity": total_quantity, # Original total qty
                     "expiry_date": entry.expiry_date.strftime("%b-%y") if entry.expiry_date else None,
                     "consumed_date": entry.consumed_date.strftime("%d-%b-%Y") if entry.consumed_date else None,
                 })
            return JsonResponse({"ambulance_consumables": data}, safe=False)
        except Exception as e:
            logger.exception("Error in get_ambulance_consumables")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
     else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt
def add_ambulance_consumable(request):
    # Logic is identical to add_ward_consumable, just different model
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date") # YYYY-MM
            consumed_date_str = data.get("consumed_date") # YYYY-MM-DD
            quantity_str = data.get("quantity")

            # Validation
            if not all([medicine_form, brand_name, chemical_name, dose_volume, expiry_date_str, consumed_date_str, quantity_str]):
                 return JsonResponse({"error": "Missing required consumable information."}, status=400)
            try:
                 quantity_to_consume = int(quantity_str)
                 if quantity_to_consume <= 0: raise ValueError("Quantity must be positive")
            except (ValueError, TypeError): return JsonResponse({"error": "Invalid quantity."}, status=400)
            try: expiry_date = datetime.strptime(f"{expiry_date_str}-01", "%Y-%m-%d").date()
            except ValueError: return JsonResponse({"error": "Invalid expiry date format (YYYY-MM)."}, status=400)
            consumed_date = parse_date_internal(consumed_date_str)
            if not consumed_date: return JsonResponse({"error": "Invalid consumed date format (YYYY-MM-DD)."}, status=400)

            with transaction.atomic():
                stock_item = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form, brand_name=brand_name, chemical_name=chemical_name,
                    dose_volume=dose_volume, expiry_date=expiry_date
                ).first()

                if not stock_item: return JsonResponse({"error": "Matching medicine batch not found in PharmacyStock."}, status=404)
                if stock_item.quantity < quantity_to_consume:
                    return JsonResponse({"error": f"Not enough quantity. Available: {stock_item.quantity}, Requested: {quantity_to_consume}."}, status=400)

                stock_item.quantity -= quantity_to_consume
                stock_item.save() # Do not reduce total_quantity

                AmbulanceConsumables.objects.create(
                    entry_date=stock_item.entry_date, medicine_form=medicine_form, brand_name=brand_name,
                    chemical_name=chemical_name, dose_volume=dose_volume, quantity=quantity_to_consume,
                    expiry_date=expiry_date, consumed_date=consumed_date,
                )

            logger.info(f"Consumed {quantity_to_consume} of Ambulance item {brand_name} (Expiry: {expiry_date_str}) on {consumed_date_str}")
            return JsonResponse({"message": "Ambulance consumable added and stock updated successfully", "success": True})

        except json.JSONDecodeError: return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.exception("Error adding ambulance consumable.")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)
        response['Allow'] = 'POST'
        return response

# --- Calibration ---

def normalize_frequency(freq):
    # Normalize frequency input for consistent month calculation
    if not freq: return 12 # Default yearly if not specified
    freq = str(freq).lower().strip()
    mapping = {
        "yearly": 12, "annual": 12, "annually": 12,
        "halfyearly": 6, "half-yearly": 6,
        "quartearly": 3, "quarterly": 3, # Correct spelling
        "monthly": 1,
        "once in 2 months": 2, "bimonthly": 2,
        "once in 2 years": 24, "biyearly": 24, "biannual": 24, "biannually": 24,
    }
    return mapping.get(freq, 12) # Default to yearly (12 months) if unrecognized

def get_next_due_date(calibration_date_str, freq):
    # Calculates next due date based on calibration date and frequency string
    try:
        calibration_date = datetime.strptime(str(calibration_date_str), "%Y-%m-%d")
        months_to_add = normalize_frequency(freq)
        return calibration_date + relativedelta(months=months_to_add)
    except (ValueError, TypeError):
        logger.error(f"Could not parse calibration date '{calibration_date_str}' or frequency '{freq}'")
        return None # Return None if parsing fails

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import InstrumentCalibration
from django.db.models import Max # Import Max
import logging

logger = logging.getLogger(__name__)

@csrf_exempt # This decorator is not necessary for a GET request
def get_calibrations(request):
    if request.method != 'GET':
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

    try:
        # Step 1: Find the ID of the latest pending record for each equipment_sl_no.
        # We group by the serial number and find the maximum 'id' in each group.
        latest_pending_ids = InstrumentCalibration.objects.values(
            'equipment_sl_no'
        ).annotate(
            latest_id=Max('id')
        ).values_list('latest_id', flat=True)

        # Step 2: Fetch the full objects for those specific IDs.
        # This ensures we only get the single, most recent entry for each instrument.
        unique_pending_calibrations = InstrumentCalibration.objects.filter(
            id__in=list(latest_pending_ids)
        ).order_by("next_due_date") # Order the final result by the due date for display

        # Serialize the data for the JSON response
        data = []
        for i in unique_pending_calibrations:
            data.append({
                "id": i.id,
                "equipment_sl_no": i.equipment_sl_no,
                "instrument_name": i.instrument_name,
                "numbers": i.numbers,
                "certificate_number": i.certificate_number,
                "make": i.make,
                "model_number": i.model_number,
                "freq": i.freq,
                # Format dates for better readability in the frontend
                "calibration_date": i.calibration_date.strftime("%d-%b-%Y") if i.calibration_date else None,
                "next_due_date": i.next_due_date.strftime("%d-%b-%Y") if i.next_due_date else None,
                "calibration_status": i.calibration_status,
            })
            
        return JsonResponse({"pending_calibrations": data})

    except Exception as e:
        logger.exception("Error in get_calibrations")
        return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)

@csrf_exempt # Should be GET
def get_calibration_history(request):
    if request.method == 'GET':
        try:
            from_date_str = request.GET.get("from")
            to_date_str = request.GET.get("to")

            # Fetch completed calibrations (status=True)
            calibrated_instruments = InstrumentCalibration.objects.filter(calibration_status="Completed")

            # Apply date filtering based on calibration_date
            from_date = parse_date_internal(from_date_str)
            to_date = parse_date_internal(to_date_str)
            if from_date: calibrated_instruments = calibrated_instruments.filter(calibration_date__gte=from_date)
            if to_date: calibrated_instruments = calibrated_instruments.filter(calibration_date__lte=to_date)

            data = []
            for entry in calibrated_instruments.order_by("-calibration_date"): # Order by most recent calibration
                 data.append({
                     "id": entry.id, # Include ID
                     "equipment_sl_no": entry.equipment_sl_no, "instrument_name": entry.instrument_name,
                     "numbers": entry.numbers, "certificate_number": entry.certificate_number,
                     "make": entry.make, "model_number": entry.model_number, "freq": entry.freq,
                     "calibration_date": entry.calibration_date.strftime("%d-%b-%Y") if entry.calibration_date else "",
                     "next_due_date": entry.next_due_date.strftime("%d-%b-%Y") if entry.next_due_date else "",
                     "calibration_status": entry.calibration_status,
                 })
            return JsonResponse({"calibration_history": data})
        except Exception as e:
            logger.exception("Error in get_calibration_history")
            return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction, IntegrityError
from django.db.models import Max
from .models import InstrumentCalibration
from .utils import parse_date_internal # Assuming this is in your utils.py
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def complete_calibration(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405)

    try:
        data = json.loads(request.body)
        instrument_id = data.get("id")
        new_completion_date_str = data.get("calibration_date")
        new_freq = data.get("freq")
        new_next_due_date_str = data.get("next_due_date")
        
        # Optional field for the completed record
        new_certificate_number = data.get("certificate_number") 

        # Validate that all required data for the new cycle is present
        if not all([instrument_id, new_completion_date_str, new_freq, new_next_due_date_str]):
            return JsonResponse({"error": "Missing required fields: id, calibration_date, freq, and next_due_date are all required."}, status=400)

        completion_date = parse_date_internal(new_completion_date_str)
        next_due_date_for_new_record = parse_date_internal(new_next_due_date_str)

        if not completion_date or not next_due_date_for_new_record:
            return JsonResponse({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=400)

        # Use a database transaction to ensure both operations succeed or fail together
        with transaction.atomic():
            # 1. Find the original record and lock it to prevent race conditions
            original_instrument = InstrumentCalibration.objects.select_for_update().get(id=instrument_id)

            # Check if it's already completed to prevent duplicate actions
            if original_instrument.calibration_status == "Completed":
                return JsonResponse({"error": "This calibration record has already been completed."}, status=409) # 409 Conflict

            # 2. Update the old record: Mark as 'completed'
            original_instrument.calibration_status = "Completed"
            original_instrument.calibration_date = completion_date # Set its completion date
            if new_certificate_number:
                original_instrument.certificate_number = new_certificate_number
            original_instrument.save()

            # 3. Create the new record for the next cycle
            # Get the next serial number
            last_serial = InstrumentCalibration.objects.aggregate(max_serial=Max('serial_no'))['max_serial']
            new_serial_no = (last_serial or 0) + 1
            
            # Create the new pending record by copying data from the original
            InstrumentCalibration.objects.create(
                serial_no=new_serial_no,
                equipment_sl_no=original_instrument.equipment_sl_no,
                instrument_name=original_instrument.instrument_name,
                numbers=original_instrument.numbers,
                make=original_instrument.make,
                model_number=original_instrument.model_number,
                
                # Set the new cycle's details
                calibration_date=completion_date, # The new cycle starts on the completion date of the old one
                freq=new_freq,
                next_due_date=next_due_date_for_new_record,
                
                # Mark this new record as 'pending'
                calibration_status="Pending",
                
                # Carry over who is responsible for the instrument
                done_by=original_instrument.done_by 
            )

        logger.info(f"Calibration completed for Instrument ID {instrument_id} and new pending record created.")
        return JsonResponse({"message": "Calibration completed and new cycle scheduled successfully."})

    except InstrumentCalibration.DoesNotExist:
        return JsonResponse({"error": "Instrument with the specified ID not found."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format in request body."}, status=400)
    except IntegrityError as e:
        logger.error(f"Database integrity error during completion: {e}")
        return JsonResponse({"error": "A database error occurred. It's possible a unique constraint was violated.", "detail": str(e)}, status=500)
    except Exception as e:
        logger.exception(f"An unexpected error occurred in complete_calibration for ID {data.get('id', 'Unknown')}")
        return JsonResponse({"error": "An unexpected server error occurred.", "detail": str(e)}, status=500)



import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.db.models import Max
from .models import InstrumentCalibration
from .utils import parse_date_internal, get_next_due_date
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def add_instrument(request):
    """ Adds a new instrument and its initial calibration record with an auto-incrementing serial number. """
    if request.method != "POST":
        response = JsonResponse({"error": "Invalid method"}, status=405)
        response['Allow'] = 'POST'
        return response

    try:
        data = json.loads(request.body.decode('utf-8'))

        # Validation
        required_fields = ["equipment_sl_no", "instrument_name", "numbers", "freq", "calibration_date", "calibration_status"]
        missing = [f for f in required_fields if data.get(f) is None]
        if missing:
            return JsonResponse({"error": f"Missing required fields: {', '.join(missing)}"}, status=400)

        # --- Logic for Auto-incrementing serial_no ---
        # 1. Find the current maximum serial number.
        last_instrument = InstrumentCalibration.objects.aggregate(max_serial=Max('serial_no'))
        max_serial = last_instrument.get('max_serial', 0)
        
        # 2. If it's None (first entry), start at 1. Otherwise, increment.
        new_serial_no = (max_serial or 0) + 1
        # --- End of serial_no logic ---

        calibration_date_str = data["calibration_date"]
        calibration_date = parse_date_internal(calibration_date_str)
        if not calibration_date:
            return JsonResponse({"error": "Invalid calibration_date format (YYYY-MM-DD)"}, status=400)

        freq = data["freq"]
        next_due = get_next_due_date(calibration_date_str, freq)
        if not next_due:
            return JsonResponse({"error": f"Invalid or unsupported frequency: {freq}"}, status=400)
        
        

        instrument_data = {
            "serial_no": new_serial_no, 
            "equipment_sl_no": data["equipment_sl_no"],
            "instrument_name": data["instrument_name"],
            "numbers": data["numbers"],
            "certificate_number": data.get("certificate_number"),
            "make": data.get("make"),
            "model_number": data.get("model_number"),
            "freq": freq,
            "calibration_date": calibration_date,
            "next_due_date": data["next_due_date"],
            "calibration_status": data["calibration_status"],
            "done_by": data.get("done_by")
        }
        filtered_data = {k: v for k, v in instrument_data.items() if v is not None}

        instrument = InstrumentCalibration.objects.create(**filtered_data)
        logger.info(f"Instrument added successfully: ID {instrument.id}, S/N {instrument.equipment_sl_no}")
        return JsonResponse({"message": "Instrument added successfully", "id": instrument.id, "serial_no": instrument.serial_no}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        logger.exception("Error adding instrument")
        return JsonResponse({"error": "Server error.", "detail": str(e)}, status=500)


@csrf_exempt # Should be GET
def get_pending_next_month_count(request):
    if request.method == 'GET':
        try:
            today = date.today()
            one_month_later = today + relativedelta(months=1)
            # Count instruments pending (status=False) AND due on or before one month from now
            count = InstrumentCalibration.objects.filter(
                calibration_status=False,
                next_due_date__lte=one_month_later
            ).count()
            return JsonResponse({"count": count})
        except Exception as e:
            logger.exception("Error getting pending calibration count for next month")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

@csrf_exempt # Should be GET
def get_red_status_count(request):
    # Calculates counts based on proximity to due date
    if request.method == 'GET':
        try:
            today = date.today()
            red_count, yellow_count, green_count = 0, 0, 0
            instruments = InstrumentCalibration.objects.filter(calibration_status=False)

            for instrument in instruments:
                if not instrument.next_due_date or not instrument.freq or not instrument.calibration_date: # Need calibration_date too
                    continue # Skip if essential dates/freq are missing

                due_date = instrument.next_due_date
                last_cal_date = instrument.calibration_date # Use the last known calibration date
                if not last_cal_date: # If initial record has no cal date, maybe use entry? Less accurate.
                     last_cal_date = instrument.entry_date or today - relativedelta(months=normalize_frequency(instrument.freq)) # Estimate last


                # Calculate total period in days (more accurate than assuming 30.44 days/month)
                total_period_days = (due_date - last_cal_date).days
                if total_period_days <= 0: # Avoid division by zero or negative period
                     red_count += 1 # If due date is same or before last cal, it's overdue
                     continue

                # Calculate days remaining
                days_remaining = (due_date - today).days

                if days_remaining < 0: # Overdue
                    red_count += 1
                    continue

                fraction_remaining = days_remaining / total_period_days

                # Define thresholds (e.g., Red < 10%, Yellow < 33%, Green >= 33%) - Adjust as needed
                if fraction_remaining < 0.10: # Less than 10% of period remaining
                    red_count += 1
                elif fraction_remaining < 0.33: # Less than 33% remaining
                    yellow_count += 1
                else: # 33% or more remaining
                    green_count += 1

            return JsonResponse({"red_count": red_count,"yellow_count": yellow_count,"green_count": green_count})
        except Exception as e:
            logger.exception("Error calculating red status count")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response


@csrf_exempt # Should be POST
def archive_zero_quantity_stock(request):
    """ Moves zero-quantity PharmacyStock entries to PharmacyStockHistory. """
    if request.method == "POST":
        archived_count = 0
        try:
            with transaction.atomic():
                # Select stock items with quantity <= 0 for update (locking)
                zero_stocks = PharmacyStock.objects.select_for_update().filter(quantity__lte=0)
                items_to_delete = list(zero_stocks) # Evaluate queryset

                if not items_to_delete:
                    return JsonResponse({"message": "No zero quantity stock found to archive.", "success": True})

                history_entries = []
                for item in items_to_delete:
                    # Prepare history entry data
                    history_entries.append(
                        PharmacyStockHistory(
                            entry_date=item.entry_date, # Preserve original entry date
                            medicine_form=item.medicine_form,
                            brand_name=item.brand_name,
                            chemical_name=item.chemical_name,
                            dose_volume=item.dose_volume,
                            total_quantity=item.total_quantity, # Preserve original total
                            expiry_date=item.expiry_date,
                            archive_date=timezone.now().date() # Set archive date
                        )
                    )

                # Bulk create history entries for efficiency
                PharmacyStockHistory.objects.bulk_create(history_entries, ignore_conflicts=True) # ignore_conflicts assumes duplicates are okay or handled by constraints

                # Delete original stock items
                deleted_count, _ = zero_stocks.delete() # Use the original queryset to delete
                archived_count = deleted_count

            logger.info(f"{archived_count} zero quantity stock items archived.")
            return JsonResponse({"message": f"{archived_count} items archived successfully.", "success": True})

        except Exception as e:
            logger.exception("archive_zero_quantity_stock failed.")
            return JsonResponse({"error": "Server error during archiving.", "detail": str(e), "success": False}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
        response['Allow'] = 'POST'
        return response

# HR Upload - Simple test endpoint, no Aadhar dependency shown
@csrf_exempt
def hrupload(request):
    if request.method == 'POST':
        try:
            # It's better practice to decode and load JSON safely
            data = json.loads(request.body.decode('utf-8'))
            logger.info(f"HRUpload Received Data: {data.get('data')}") # Log received data
            # Add actual processing logic here if needed
            return JsonResponse({"message":"HR data received successfully"}, status = 200)
        except json.JSONDecodeError:
            logger.error("hrupload failed: Invalid JSON")
            return JsonResponse({"message":"Invalid JSON format"}, status = 400)
        except Exception as e:
            logger.exception("Error processing hrupload")
            return JsonResponse({"message":"Error processing data", "detail": str(e)} ,status = 500)
    else:
         response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
         response['Allow'] = 'POST'
         return response
    

@csrf_exempt
def medicalupload(request):
    if request.method == 'POST':
        try:
            # It's better practice to decode and load JSON safely
            data = json.loads(request.body.decode('utf-8'))
            
            logger.info(f"medicalupload Received Data: {data.get('data')}") # Log received data
            # Add actual processing logic here if needed
            return JsonResponse({"message":"HR data received successfully"}, status = 200)
        except json.JSONDecodeError:
            logger.error("medicalupload failed: Invalid JSON")
            return JsonResponse({"message":"Invalid JSON format"}, status = 400)
        except Exception as e:
            logger.exception("Error processing medicalupload")
            return JsonResponse({"message":"Error processing data", "detail": str(e)} ,status = 500)
    else:
         response = JsonResponse({"error": "Invalid method. Use POST."}, status=405)
         response['Allow'] = 'POST'
         return response


@csrf_exempt # Should be GET
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

# Add this function definition to your jsw/views.py file

from django.http import JsonResponse
from .models import ExpiryRegister
import logging

logger = logging.getLogger(__name__)

# This function specifically returns the count of items in the expiry register
# that have NOT been marked as removed yet.
def get_current_expiry_count(request):
    """
    Returns the count of medicines currently in ExpiryRegister (removed_date is NULL).
    """
    if request.method == 'GET': # Counts should always be GET requests
        try:
            # Count items in ExpiryRegister where removed_date is not set
            count = ExpiryRegister.objects.filter(removed_date__isnull=True).count()
            logger.info(f"Fetched current expiry count: {count}")
            return JsonResponse({"count": count})
        except Exception as e:
            logger.exception("Error getting current expiry count")
            return JsonResponse({"error": "Server error calculating expiry count.", "detail": str(e)}, status=500)
    else:
        response = JsonResponse({"error": "Invalid method. Use GET."}, status=405)
        response['Allow'] = 'GET'
        return response

# --- Ensure other necessary imports like models and logging are present at the top of views.py ---
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import logging
from .models import PharmacyMedicine  # Make sure this is your correct model

logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
def get_chemical_name_suggestions(request):
    """
    Provides suggestions for chemical names that start with the user's query
    AND are filtered by the specific medicine type (form).
    """
    try:
        # 1. Get the query parameters from the frontend request
        name_query = request.GET.get('name', '').strip()
        form_query = request.GET.get('medicine_form', '').strip() # e.g., 'Tablet', 'Syrup'

        # If the user hasn't typed anything, return an empty list
        if not name_query:
            return JsonResponse({'suggestions': []})

        # 2. Start by filtering for names that begin with the user's query
        queryset = PharmacyMedicine.objects.filter(chemical_name__istartswith=name_query)

        # --- THIS IS THE KEY CHANGE FOR FILTERING BY TYPE ---
        # 3. If a medicine form was provided, further filter the queryset.
        if form_query:
            # This line narrows the search to only include medicines of the
            # specified type (e.g., only 'Tablet' or only 'Syrup').
            # '__iexact' is a case-insensitive exact match.
            queryset = queryset.filter(medicine_form__iexact=form_query)
        
        # 4. Get the final, clean list of suggestions
        suggestions = list(
            queryset
            .values_list('chemical_name', flat=True)
            .distinct()
            .order_by('chemical_name')
            [:10]
        )

        return JsonResponse({'suggestions': suggestions})

    except Exception as e:
        logger.error(f"Error in get_chemical_name_suggestions: {e}")
        return JsonResponse(
            {"error": "An internal server error occurred."},
            status=500
        )


"""
This view handles the bulk upload of medical data from a structured Excel file.

Key Features:
- Handles raw file uploads to avoid request size limits.
- Uses `openpyxl` for efficient, server-side Excel parsing.
- Parses a 3-level hierarchical header structure into meaningful data.
- Uses a modular design with mapping dictionaries and helper functions for each data model.
- Enforces data integrity using atomic transactions: the entire file upload succeeds or fails as a single unit.
- Provides detailed error reporting back to the client if the upload fails.
"""

# ==============================================================================
# IMPORTS
# ==============================================================================
import openpyxl
from datetime import datetime
from django.db import transaction
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Import all your models
from .models import (
    employee_details, vitals, heamatalogy, RoutineSugarTests,
    RenalFunctionTest, LipidProfile, LiverFunctionTest, ThyroidFunctionTest,
    AutoimmuneTest, CoagulationTest, EnzymesCardiacProfile, UrineRoutineTest,
    SerologyTest, MotionTest, CultureSensitivityTest, MensPack, WomensPack,
    OccupationalProfile, OthersTest, OphthalmicReport, XRay, USGReport,
    CTReport, MRIReport
)

# ==============================================================================
# MAPPING DICTIONARIES (Excel Headers -> Django Model Fields)
#
# CRITICAL: The string values MUST EXACTLY match the headers generated by the
# parser. Pay close attention to spaces, special characters, and capitalization.
# ==============================================================================

# --- Basic Info ---
BASIC_DETAILS_MAP = {
    'emp_no': 'Details_Basic detail_EMP NO',
    'name': 'Details_Basic detail_NAME',
    'year': 'Details_Basic detail_Year',
    'batch': 'Details_Basic detail_Batch',
    'hospitalName': 'Details_Basic detail_Hospital',
    'date': 'Details_Basic detail_Date',
    # NOTE: Assuming an 'Aadhar' column exists in your Excel file
    'aadhar': 'Details_Basic detail_Aadhar',
}

# --- Vitals ---
VITALS_MAP = {
    'height': 'General Test_Vitals_Height',
    'weight': 'General Test_Vitals_weight',
    'bmi': 'General Test_Vitals_BMI',
    'systolic': 'General Test_Vitals_Systolic BP',
    'diastolic': 'General Test_Vitals_Diastolic BP',
    'pulse': 'General Test_Vitals_Pulse Rate',
    'spO2': 'General Test_Vitals_sp O2',
    'respiratory_rate': 'General Test_Vitals_Respiratory Rate',
    'temperature': 'General Test_Vitals_Temperature',
}

# --- Test-specific Maps ---
HAEMATOLOGY_MAP = {
    'hemoglobin': 'HAEMATALOGY_Haemoglobin_RESULT',
    'total_rbc': 'HAEMATALOGY_Red Blood Cell (RBC) Count_RESULT',
    'total_wbc': 'HAEMATALOGY_WBC Count (TC)_RESULT',
    'Haemotocrit': 'HAEMATALOGY_Haemotocrit (PCV)_RESULT',
    'mcv': 'HAEMATALOGY_MCV_RESULT',
    'mch': 'HAEMATALOGY_MCH_RESULT',
    'mchc': 'HAEMATALOGY_MCHC_RESULT',
    'platelet_count': 'HAEMATALOGY_Platelet Count_RESULT',
    'rdw': 'HAEMATALOGY_RDW (CV)_RESULT',
    'neutrophil': 'HAEMATALOGY_Neutrophil_RESULT',
    'lymphocyte': 'HAEMATALOGY_Lymphocyte_RESULT',
    'eosinophil': 'HAEMATALOGY_Eosinophil_RESULT',
    'monocyte': 'HAEMATALOGY_Monocyte_RESULT',
    'basophil': 'HAEMATALOGY_Basophils_RESULT',
    'esr': 'HAEMATALOGY_Erythrocyte Sedimentation Rate (ESR)_RESULT',
    'peripheral_blood_smear_rbc_morphology': 'HAEMATALOGY_Peripheral Blood Smear - RBC Morphology_RESULT',
    'peripheral_blood_smear_parasites': 'HAEMATALOGY_Peripheral Blood Smear - Parasites_RESULT',
    'peripheral_blood_smear_others': 'HAEMATALOGY_Peripheral Blood Smear - Others_RESULT',
}

SUGAR_TESTS_MAP = {
    'glucose_f': 'ROUTINE SUGAR TESTS_Glucose (F)_RESULT',
    'glucose_pp': 'ROUTINE SUGAR TESTS_Glucose (PP)_RESULT',
    'random_blood_sugar': 'ROUTINE SUGAR TESTS_Random Blood sugar_RESULT',
    'estimated_average_glucose': 'ROUTINE SUGAR TESTS_Estimated Average Glucose_RESULT',
    'hba1c': 'ROUTINE SUGAR TESTS_HbA1c_RESULT',
}

RENAL_FUNCTION_MAP = {
    'urea': 'RENAL FUNCTION TEST & ELECTROLYTES_Urea_RESULT',
    'bun': 'RENAL FUNCTION TEST & ELECTROLYTES_Blood urea nitrogen (BUN)_RESULT',
    'serum_creatinine': 'RENAL FUNCTION TEST & ELECTROLYTES_Sr.Creatinine_RESULT',
    'eGFR': 'RENAL FUNCTION TEST & ELECTROLYTES_e GFR_RESULT',
    'uric_acid': 'RENAL FUNCTION TEST & ELECTROLYTES_Uric acid_RESULT',
    'sodium': 'RENAL FUNCTION TEST & ELECTROLYTES_Sodium_RESULT',
    'potassium': 'RENAL FUNCTION TEST & ELECTROLYTES_Potassium_RESULT',
    'calcium': 'RENAL FUNCTION TEST & ELECTROLYTES_Calcium_RESULT',
    'phosphorus': 'RENAL FUNCTION TEST & ELECTROLYTES_Phosphorus_RESULT',
    'chloride': 'RENAL FUNCTION TEST & ELECTROLYTES_Chloride_RESULT',
    'bicarbonate': 'RENAL FUNCTION TEST & ELECTROLYTES_Bicarbonate_RESULT',
}

LIPID_PROFILE_MAP = {
    'Total_Cholesterol': 'LIPID PROFILE_Total Cholesterol_RESULT',
    'triglycerides': 'LIPID PROFILE_Triglycerides_RESULT',
    'hdl_cholesterol': 'LIPID PROFILE_HDL - Cholesterol_RESULT',
    'ldl_cholesterol': 'LIPID PROFILE_LDL- Cholesterol_RESULT',
    'vldl_cholesterol': 'LIPID PROFILE_VLDL -Choleserol_RESULT',
    'chol_hdl_ratio': 'LIPID PROFILE_CHOL:HDL ratio_RESULT',
    'ldl_hdl_ratio': 'LIPID PROFILE_LDL.CHOL/HDL.CHOL Ratio_RESULT',
}

LIVER_FUNCTION_MAP = {
    'bilirubin_total': 'LIVER FUNCTION TEST_Bilirubin -Total_RESULT',
    'bilirubin_direct': 'LIVER FUNCTION TEST_Bilirubin -Direct_RESULT',
    'bilirubin_indirect': 'LIVER FUNCTION TEST_Bilirubin -indirect_RESULT',
    'sgot_ast': 'LIVER FUNCTION TEST_SGOT /AST_RESULT',
    'sgpt_alt': 'LIVER FUNCTION TEST_SGPT /ALT_RESULT',
    'alkaline_phosphatase': 'LIVER FUNCTION TEST_Alkaline phosphatase_RESULT',
    'total_protein': 'LIVER FUNCTION TEST_Total Protein_RESULT',
    'albumin_serum': 'LIVER FUNCTION TEST_Albumin (Serum )_RESULT',
    'globulin_serum': 'LIVER FUNCTION TEST_Globulin(Serum)_RESULT',
    'alb_glob_ratio': 'LIVER FUNCTION TEST_Alb/Glob Ratio_RESULT',
    'gamma_glutamyl_transferase': 'LIVER FUNCTION TEST_Gamma Glutamyl transferase_RESULT',
}

THYROID_FUNCTION_MAP = {
    't3_triiodothyronine': 'THYROID FUNCTION TEST_T3- Triiodothyroine_RESULT',
    't4_thyroxine': 'THYROID FUNCTION TEST_T4 - Thyroxine_RESULT',
    'tsh_thyroid_stimulating_hormone': 'THYROID FUNCTION TEST_TSH- Thyroid Stimulating Hormone_RESULT',
}

AUTOIMMUNE_MAP = {
    'ANA': 'AUTOIMMUNE TEST_ANA (Antinuclear Antibody)_RESULT',
    'Anti_ds_dna': 'AUTOIMMUNE TEST_Anti ds DNA_RESULT',
    'Anticardiolipin_Antibodies': 'AUTOIMMUNE TEST_Anticardiolipin Antibodies (IgG & IgM)_RESULT',
    'Rheumatoid_factor': 'AUTOIMMUNE TEST_Rheumatoid factor_RESULT',
}

COAGULATION_MAP = {
    'prothrombin_time': 'COAGULATION TEST_Prothrombin Time (PT)_RESULT',
    'pt_inr': 'COAGULATION TEST_PT INR_RESULT',
    'bleeding_time': 'COAGULATION TEST_Bleeding Time (BT)_RESULT',
    'clotting_time': 'COAGULATION TEST_Clotting Time (CT)_RESULT',
}

ENZYMES_CARDIAC_MAP = {
    'acid_phosphatase': 'ENZYMES & CARDIAC Profile_Acid Phosphatase_RESULT',
    'adenosine_deaminase': 'ENZYMES & CARDIAC Profile_Adenosine Deaminase_RESULT',
    'amylase': 'ENZYMES & CARDIAC Profile_Amylase_RESULT',
    'lipase': 'ENZYMES & CARDIAC Profile_Lipase_RESULT',
    'troponin_t': 'ENZYMES & CARDIAC Profile_Troponin- T_RESULT',
    'troponin_i': 'ENZYMES & CARDIAC Profile_Troponin- I_RESULT',
    'cpk_total': 'ENZYMES & CARDIAC Profile_CPK - TOTAL_RESULT',
    'cpk_mb': 'ENZYMES & CARDIAC Profile_CPK - MB_RESULT',
    'ecg': 'ENZYMES & CARDIAC Profile_ECG_RESULT',
    'echo': 'ENZYMES & CARDIAC Profile_ECHO_RESULT',
    'tmt_normal': 'ENZYMES & CARDIAC Profile_TMT_RESULT',
}

URINE_ROUTINE_MAP = {
    'colour': 'URINE ROUTINE_Colour_RESULT',
    'appearance': 'URINE ROUTINE_Appearance_RESULT',
    'reaction_ph': 'URINE ROUTINE_Reaction (pH)_RESULT',
    'specific_gravity': 'URINE ROUTINE_Specific gravity_RESULT',
    'protein_albumin': 'URINE ROUTINE_Protein/Albumin_RESULT',
    'glucose_urine': 'URINE ROUTINE_Glucose (Urine)_RESULT',
    'ketone_bodies': 'URINE ROUTINE_Ketone Bodies_RESULT',
    'urobilinogen': 'URINE ROUTINE_Urobilinogen_RESULT',
    'bile_salts': 'URINE ROUTINE_Bile Salts_RESULT',
    'bile_pigments': 'URINE ROUTINE_Bile Pigments_RESULT',
    'wbc_pus_cells': 'URINE ROUTINE_WBC / Pus cells_RESULT',
    'red_blood_cells': 'URINE ROUTINE_Red Blood Cells_RESULT',
    'epithelial_cells': 'URINE ROUTINE_Epithelial celss_RESULT',
    'casts': 'URINE ROUTINE_Casts_RESULT',
    'crystals': 'URINE ROUTINE_Crystals_RESULT',
    'bacteria': 'URINE ROUTINE_Bacteria_RESULT',
}

SEROLOGY_MAP = {
    'screening_hiv': 'SEROLOGY_Screening For HIV I & II_RESULT', # Assuming this covers both
    'HBsAG': 'SEROLOGY_HBsAg_RESULT',
    'HCV': 'SEROLOGY_HCV_RESULT',
    'WIDAL': 'SEROLOGY_WIDAL_RESULT',
    'VDRL': 'SEROLOGY_VDRL_RESULT',
    'Dengue_NS1Ag': 'SEROLOGY_Dengue NS1Ag_RESULT',
    'Dengue_IgG': 'SEROLOGY_Dengue IgG_RESULT',
    'Dengue_IgM': 'SEROLOGY_Dengue IgM_RESULT',
}

MOTION_TEST_MAP = {
    'colour_motion': 'MOTION_Colour_RESULT',
    'appearance_motion': 'MOTION_Appearance_RESULT',
    'occult_blood': 'MOTION_Occult Blood_RESULT',
    'ova': 'MOTION_Ova_RESULT',
    'cyst': 'MOTION_Cyst_RESULT',
    'mucus': 'MOTION_Mucus_RESULT',
    'pus_cells': 'MOTION_Pus Cells_RESULT',
    'rbcs': 'MOTION_RBCs_RESULT',
    'others': 'MOTION_Others_RESULT',
}

CULTURE_SENSITIVITY_MAP = {
    'urine': 'ROUTINE CULTURE & SENSITIVITY TEST_Urine_RESULT',
    'motion': 'ROUTINE CULTURE & SENSITIVITY TEST_Motion_RESULT',
    'sputum': 'ROUTINE CULTURE & SENSITIVITY TEST_Sputum_RESULT',
    'blood': 'ROUTINE CULTURE & SENSITIVITY TEST_Blood_RESULT',
}

MENS_PACK_MAP = {
    'psa': "Men's Pack_PSA (Prostate specific Antigen)_RESULT",
}

WOMENS_PACK_MAP = {
    'Mammogaram': "Women's Pack_Mammogram_RESULT",
    'PAP_Smear': "Women's Pack_PAP Smear_RESULT",
}

OCCUPATIONAL_PROFILE_MAP = {
    'Audiometry': "Occupational Profile_Audiometry_RESULT",
    'PFT': "Occupational Profile_PFT_RESULT",
}

OTHERS_TEST_MAP = {
    'Bone_Densitometry': "Others TEST_Bone Densitometry_RESULT",
    'Dental': "Others TEST_Dental_RESULT",
    'Pathology': "Others TEST_Pathology_RESULT",
}

OPHTHALMIC_MAP = {
    'vision': 'OPHTHALMIC REPORT_Vision_RESULT',
    'color_vision': 'OPHTHALMIC REPORT_Color Vision_RESULT',
    'Cataract_glaucoma': 'OPHTHALMIC REPORT_Cataract/ glaucoma_RESULT',
}

XRAY_MAP = {
    'Chest': 'X-RAY_Chest_RESULT',
    'Spine': 'X-RAY_Spine_RESULT',
    'Abdomen': 'X-RAY_Abdomen_RESULT',
    'KUB': 'X-RAY_KUB_RESULT',
    'Pelvis': 'X-RAY_Pelvis_RESULT',
}

USG_MAP = {
    'usg_abdomen': 'USG_ABDOMEN_RESULT',
    'usg_kub': 'USG_KUB_RESULT',
    'usg_pelvis': 'USG_Pelvis_RESULT',
    'usg_neck': 'USG_Neck_RESULT',
}

CT_MAP = {
    'CT_brain': 'CT_Brain_RESULT',
    'CT_lungs': 'CT_Lungs_RESULT',
    'CT_abdomen': 'CT_Abdomen_RESULT',
    'CT_spine': 'CT_Spine_RESULT',
    'CT_pelvis': 'CT_Pelvis_RESULT',
}

MRI_MAP = {
    'mri_brain': 'MRI_Brain_RESULT',
    'mri_lungs': 'MRI_Lungs_RESULT',
    'mri_abdomen': 'MRI_Abdomen_RESULT',
    'mri_spine': 'MRI_Spine_RESULT',
    'mri_pelvis': 'MRI_Pelvis_RESULT',
}


# ==============================================================================
# PYTHON-BASED EXCEL PARSER
# ==============================================================================
def parse_hierarchical_excel_py(worksheet):

    header_row1 = [cell.value for cell in worksheet[1]]
    header_row2 = [cell.value for cell in worksheet[2]]
    header_row3 = [cell.value for cell in worksheet[3]]

    combined_headers = []
    last_l1_header = ''
    last_l2_header = ''

    for i in range(len(header_row3)):
        l1_header = header_row1[i] if header_row1[i] is not None else last_l1_header
        l2_header = header_row2[i] if header_row2[i] is not None else last_l2_header
        l3_header = header_row3[i] if header_row3[i] is not None else ''
        
        last_l1_header = l1_header
        last_l2_header = l2_header

        full_header = '_'.join(filter(None, [str(h).strip() for h in [l1_header, l2_header, l3_header]]))
        combined_headers.append(full_header)
    
    json_data = []
    for row_cells in worksheet.iter_rows(min_row=4):
        row_data = {}
        for i, cell in enumerate(row_cells):
            if i < len(combined_headers):
                cell_value = cell.value
                if isinstance(cell_value, datetime):
                    cell_value = cell_value.strftime('%Y-%m-%d')
                row_data[combined_headers[i]] = cell_value

        if any(val is not None and str(val).strip() != '' for val in row_data.values()):
            json_data.append(row_data)
            
    return json_data

# ==============================================================================
# DATA PROCESSING HELPER FUNCTIONS
# ==============================================================================
def _populate_data(model_map, row_data):
    """Generic helper to populate a dictionary from row_data based on a map."""
    instance_data = {}
    for model_field, excel_key in model_map.items():
        if excel_key in row_data and row_data[excel_key] is not None:
            instance_data[model_field] = row_data[excel_key]
    return instance_data

def process_model_data(model, model_map, row_data, employee, entry_date):
    """A generic function to process any model."""
    data = _populate_data(model_map, row_data)
    if data:
        model.objects.update_or_create(
            emp_no=employee.emp_no,
            aadhar=employee.aadhar,
            entry_date=entry_date,
            mrdNo = employee.mrdNo,
            defaults=data
        )

# ==============================================================================
# MAIN UPLOAD VIEW (HANDLES FILE UPLOAD)
# ==============================================================================
@method_decorator(csrf_exempt, name='dispatch')
class MedicalDataUploadView(View):
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('medical_file')
        if not uploaded_file:
            return JsonResponse({'status': 'error', 'message': 'No file was uploaded.'}, status=400)

        try:
            workbook = openpyxl.load_workbook(uploaded_file, data_only=True)
            worksheet = workbook.active
            json_data = parse_hierarchical_excel_py(worksheet)

            if not json_data:
                return JsonResponse({'status': 'error', 'message': 'Excel file is empty or has an unsupported format.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Failed to parse Excel file: {e}'}, status=400)
            
        success_count = 0
        error_count = 0
        errors = []

        try:
            with transaction.atomic():
                for i, row in enumerate(json_data):
                    s_no_key = 'Details_Basic detail_S.NO'
                    row_identifier = f"Row (S.No: {row.get(s_no_key, i + 4)})"

                    try:
                        hospital = row.get(BASIC_DETAILS_MAP['hospitalName'])
                        batch = row.get(BASIC_DETAILS_MAP['batch'])
                        aadhar = str(row.get(BASIC_DETAILS_MAP['aadhar'])).strip() if row.get(BASIC_DETAILS_MAP['aadhar']) else None
                        date_str = row.get(BASIC_DETAILS_MAP['date'])
                        print(hospital, batch, aadhar, date_str)
                        if not all([hospital, batch, aadhar, date_str]):
                            errors.append(f"{row_identifier}: Missing required lookup fields (Hospital, Batch, Aadhar, or Date).")
                            error_count += 1
                            continue

                        entry_date = datetime.strptime(str(date_str), '%Y-%m-%d').date()
                        
                    except (ValueError, TypeError) as e:
                        errors.append(f"{row_identifier}: Invalid date format or missing key. Details: {e}.")
                        error_count += 1
                        continue

                    try:
                        
                        employee = employee_details.objects.get(
                            hospitalName=hospital,
                            batch=batch,
                            aadhar=aadhar,
                            entry_date = date_str
                        )
                        print(employee)
                    except employee_details.DoesNotExist:
                        errors.append(f"{row_identifier}: Employee with Aadhar '{aadhar}', Hospital '{hospital}', and Batch '{batch}' not found.")
                        error_count += 1
                        continue
                    except employee_details.MultipleObjectsReturned:
                        errors.append(f"{row_identifier}: Found multiple employees for Aadhar '{aadhar}'. Data is ambiguous.")
                        error_count += 1
                        continue

                    # --- Call all processing functions ---
                    process_model_data(vitals, VITALS_MAP, row, employee, entry_date)
                    process_model_data(heamatalogy, HAEMATOLOGY_MAP, row, employee, entry_date)
                    process_model_data(RoutineSugarTests, SUGAR_TESTS_MAP, row, employee, entry_date)
                    process_model_data(RenalFunctionTest, RENAL_FUNCTION_MAP, row, employee, entry_date)
                    process_model_data(LipidProfile, LIPID_PROFILE_MAP, row, employee, entry_date)
                    process_model_data(LiverFunctionTest, LIVER_FUNCTION_MAP, row, employee, entry_date)
                    process_model_data(ThyroidFunctionTest, THYROID_FUNCTION_MAP, row, employee, entry_date)
                    process_model_data(AutoimmuneTest, AUTOIMMUNE_MAP, row, employee, entry_date)
                    process_model_data(CoagulationTest, COAGULATION_MAP, row, employee, entry_date)
                    process_model_data(EnzymesCardiacProfile, ENZYMES_CARDIAC_MAP, row, employee, entry_date)
                    process_model_data(UrineRoutineTest, URINE_ROUTINE_MAP, row, employee, entry_date)
                    process_model_data(SerologyTest, SEROLOGY_MAP, row, employee, entry_date)
                    process_model_data(MotionTest, MOTION_TEST_MAP, row, employee, entry_date)
                    process_model_data(CultureSensitivityTest, CULTURE_SENSITIVITY_MAP, row, employee, entry_date)
                    process_model_data(MensPack, MENS_PACK_MAP, row, employee, entry_date)
                    process_model_data(WomensPack, WOMENS_PACK_MAP, row, employee, entry_date)
                    process_model_data(OccupationalProfile, OCCUPATIONAL_PROFILE_MAP, row, employee, entry_date)
                    process_model_data(OthersTest, OTHERS_TEST_MAP, row, employee, entry_date)
                    process_model_data(OphthalmicReport, OPHTHALMIC_MAP, row, employee, entry_date)
                    process_model_data(XRay, XRAY_MAP, row, employee, entry_date)
                    process_model_data(USGReport, USG_MAP, row, employee, entry_date)
                    process_model_data(CTReport, CT_MAP, row, employee, entry_date)
                    process_model_data(MRIReport, MRI_MAP, row, employee, entry_date)
                    
                    success_count += 1
                
                if error_count > 0:
                    raise Exception(f"Validation failed for {error_count} row(s). Rolling back all changes.")

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e),
                'success_count': 0,
                'error_count': error_count or len(json_data),
                'errors': errors,
            }, status=400)

        return JsonResponse({
            'status': 'success',
            'message': f'Successfully processed {success_count} records.',
            'success_count': success_count,
            'error_count': 0,
            'errors': []
        }, status=201)


@csrf_exempt
def fetchadmindata(request):
    if request.method == "POST":
        data = list(Member.objects.all().values())
        return JsonResponse({'message':'Successfully retrieved data', 'data':data}, status = 200)
    else:
        return JsonResponse({'error':'Invalid Method'}, status = 500)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date
from .models import employee_details, FitnessAssessment, Consultation
from django.core.serializers.json import DjangoJSONEncoder
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def get_currentfootfalls(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid Method. Only POST is allowed.'}, status=405)

    try:
        # --- MODIFIED SECTION: Dynamic Filtering ---

        # 1. Get optional filter parameters from the URL query string
        from_date_str = request.GET.get('fromDate')
        to_date_str = request.GET.get('toDate')
        purpose_str = request.GET.get('purpose')

        # 2. Start with a base queryset
        queryset = employee_details.objects.all()

        # 3. Apply filters conditionally
        if from_date_str:
            queryset = queryset.filter(entry_date__gte=from_date_str)
        
        if to_date_str:
            queryset = queryset.filter(entry_date__lte=to_date_str)

        if purpose_str:
            queryset = queryset.filter(register=purpose_str)
            
        # 4. If no date range is provided, default to today's footfalls.
        #    This preserves the original behavior when no filters are applied.
        if not from_date_str and not to_date_str:
            today = date.today()
            queryset = queryset.filter(entry_date=today)
        
        # 5. Execute the final filtered query
        #    The .order_by() is added to ensure a consistent output order.
        footfalls = list(queryset.order_by('-entry_date', '-id').values())

        # --- END MODIFIED SECTION ---


        if not footfalls:
            return JsonResponse({
                'message': 'No footfalls found for the selected criteria.',
                'data': []
            }, status=200)

        # 6. Collect all MRD numbers from the filtered results
        preventive_mrds = [
            f['mrdNo'] for f in footfalls if f['type_of_visit'] == 'Preventive' and f['mrdNo']
        ]
        curative_mrds = [
            f['mrdNo'] for f in footfalls if f['type_of_visit'] == 'Curative' and f['mrdNo']
        ]

        # 7. Fetch all related records in bulk (Efficient)
        fitness_records = FitnessAssessment.objects.filter(mrdNo__in=preventive_mrds).values()
        consultation_records = Consultation.objects.filter(mrdNo__in=curative_mrds).values()

        # 8. Create maps for quick lookups
        fitness_map = {record['mrdNo']: record for record in fitness_records}
        consultation_map = {record['mrdNo']: record for record in consultation_records}

        # 9. Combine the data
        response_data = []
        for footfall in footfalls:
            mrd_number = footfall.get('mrdNo')
            combined_record = {
                'details': footfall,
                'assessment': None,
                'consultation': None,
            }

            if footfall.get('type_of_visit') == 'Preventive':
                combined_record['assessment'] = fitness_map.get(mrd_number)
            elif footfall.get('type_of_visit') == 'Curative':
                combined_record['consultation'] = consultation_map.get(mrd_number)
            
            response_data.append(combined_record)
        
        # 10. Return the successful response
        return JsonResponse(
            {'data': response_data, 'message': 'Successfully retrieved data'},
            encoder=DjangoJSONEncoder,
            status=200
        )

    except Exception as e:
        logger.exception("An error occurred in get_currentfootfalls") # More detailed logging
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
def deleteInstrument(request):
    if request.method == "POST":
        instrument_id = json.loads(request.body)['equipment_sl_no']
        print(instrument_id)
        # instrument_id = request.data.get('id')
        InstrumentCalibration.objects.filter(equipment_sl_no=instrument_id).delete()
        return JsonResponse({'message':'Successfully retrieved data'}, status = 200)
    else:
        return JsonResponse({'error':'Invalid Method'}, status = 500)