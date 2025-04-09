import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import models
import logging
import traceback
from datetime import datetime
from django.utils.timezone import make_aware
import json
from .models import DiscardedMedicine, InstrumentCalibration, PharmacyMedicine, Prescription, WardConsumables, user  # Replace with your actual model
# from .models import Appointment  # Replace with your actual model
from .models import mockdrills  # Replace with your actual model
# from .models import eventsandcamps  # Replace with your actual model
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Max
import logging
from django.db.models import Count
from datetime import datetime, date
from .models import Dashboard  
from .models import FitnessAssessment 
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.files.base import ContentFile
import base64
import uuid
from django.core.exceptions import ValidationError
from django.forms.models import model_to_dict
from django.utils import timezone
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.fields.files import ImageFieldFile
from django.db.models import CharField, TextField, IntegerField, FloatField, BooleanField, DateField, DateTimeField, JSONField, Sum
from .models import Appointment, ReviewCategory, Review, Member, eventsandcamps, VaccinationRecord, PharmacyStock, ExpiryRegister
from django.core.files.storage import default_storage
import json
import traceback  # Needed for logging tracebacks
from datetime import datetime, date, timedelta # Add timedelta if needed later
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum
from django.db import transaction # For atomic operations
from django.utils import timezone # Crucial for timezone-aware datetimes like in add_ward_consumable
import logging # For Prescription logging

# --- Make sure your models are imported correctly ---
# Replace 'yourapp' with the actual name of your Django app
# Example: from yourapp.models import PharmacyMedicine, PharmacyStock, ExpiryRegister, DiscardedMedicine, WardConsumables, InstrumentCalibration, Prescription
# Or if models.py is in the same directory:
from .models import PharmacyMedicine, PharmacyStock, ExpiryRegister, DiscardedMedicine, WardConsumables, InstrumentCalibration, Prescription

# Configure logger if not done elsewhere (e.g., in settings.py)
logger = logging.getLogger(__name__)
# Basic logging config for testing (better config usually in settings.py)
# logging.basicConfig(level=logging.DEBUG)



logger = logging.getLogger(__name__)

# Configure logging (if not already configured)
logging.basicConfig(level=logging.INFO,  # Set desired log level
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

import json
import random
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core.cache import cache
from django.contrib.auth.hashers import make_password

logger = logging.getLogger(__name__)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.cache import cache
from jsw.models import Member
import json
import random
import logging
import bcrypt

logger = logging.getLogger(__name__)


from django.core.mail import send_mail

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_otp_via_email(email, otp):
    subject = "🔐 Password Reset OTP - JSW Health Portal"
    from_email = "youremail@example.com"
    recipient_list = [email]

    context = {
        "otp": otp,
        "email": email
    }

    try:
        # Render HTML and plain text content
        html_content = render_to_string("otp_email_template.html", context)
        text_content = f"Your OTP is {otp}. This code is valid for 5 minutes."

        msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"OTP {otp} sent successfully to {email}.")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}. Error: {str(e)}")
        return False


@csrf_exempt
def forgot_password(request):
    """Sends OTP to registered WhatsApp number based on employee_number."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")

            if not username:
                return JsonResponse({"message": "Username is required"}, status=400)

            try:
                user = Member.objects.get(employee_number=username)
            except Member.DoesNotExist:
                return JsonResponse({"message": "User not found"}, status=404)

            otp = random.randint(100000, 999999)
            cache.set(f"otp_{username}", otp, timeout=300)  # Store OTP for 5 minutes

            email = user.email # Make sure this field exists in your model

            if send_otp_via_email(email, otp):
                return JsonResponse({"message": "OTP sent successfully"}, status=200)
            else:
                return JsonResponse({"message": "Failed to send OTP"}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("An error occurred in forgot_password.")
            return JsonResponse({"message": "An unexpected error occurred."}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)


@csrf_exempt
def verify_otp(request):
    """Verifies OTP against cache for a given user."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            otp = data.get("otp")

            if not username or not otp:
                return JsonResponse({"message": "Username and OTP are required"}, status=400)

            stored_otp = cache.get(f"otp_{username}")

            if stored_otp and str(stored_otp) == str(otp):
                cache.delete(f"otp_{username}")  # OTP used
                return JsonResponse({"message": "OTP verified successfully"}, status=200)
            else:
                return JsonResponse({"message": "Invalid or expired OTP"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("An error occurred in verify_otp.")
            return JsonResponse({"message": "An unexpected error occurred."}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)


@csrf_exempt
def reset_password(request):
    """Updates password using bcrypt after OTP verification."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            new_password = data.get("newPassword")

            if not username or not new_password:
                return JsonResponse({"message": "Username and new password are required"}, status=400)

            try:
                user = Member.objects.get(employee_number=username)
                hashed_pw = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode('utf-8')
                user.password = hashed_pw
                user.save()

                return JsonResponse({"message": "Password reset successful"}, status=200)

            except Member.DoesNotExist:
                return JsonResponse({"message": "User not found"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("An error occurred in reset_password.")
            return JsonResponse({"message": "An unexpected error occurred."}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from jsw.models import Member
import json
import bcrypt
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')  # Could be email or employee_number
            password = data.get('password')

            if not username or not password:
                logger.warning("Login failed: Missing username or password.")
                return JsonResponse({"message": "Username and password are required."}, status=400)

            # Try to find the member by email or employee_number
            try:
                member = Member.objects.get(employee_number=username)  # You can switch to employee_number if needed
            except Member.DoesNotExist:
                logger.warning(f"Login failed: Member with email {username} not found.")
                return JsonResponse({"message": "Invalid credentials"}, status=401)
            print(password, member.password)
            if bcrypt.checkpw(password.encode(), member.password.encode()):
                logger.info(f"Member {username} logged in successfully.")
                return JsonResponse({
                    "username": member.name,
                    "accessLevel": member.role,
                    "message": "Login successful!"
                }, status=200)
            else:
                logger.warning(f"Login failed: Incorrect password for {username}.")
                return JsonResponse({"message": "Invalid credentials"}, status=401)

        except json.JSONDecodeError as e:
            logger.error(f"Login failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("Login failed: An unexpected error occurred.")
            return JsonResponse({"message": "An unexpected error occurred."}, status=500)

    logger.warning("Login failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"message": "Invalid request method"}, status=405)

def validate_date(date_str):
    """Convert empty strings to None and validate date format"""
    if not date_str:  
        return None  # Handle empty string case
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()  # Ensure correct format
    except ValueError:
        return None  # Handle incorrect date formats gracefully

@csrf_exempt
def uploadImage(request, emp_no):
    """Handles uploading and updating employee profile images."""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'profileImage' not in data:
                logger.warning(f"Image upload failed for emp_no {emp_no}: No profileImage data found in the request body.")
                return JsonResponse({'status': 'error', 'message': 'No profileImage data found in the request body.'}, status=400)

            image_data = data['profileImage']
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]

            try:
                image_data = base64.b64decode(imgstr)
            except Exception as e:
                logger.error(f"Image upload failed for emp_no {emp_no}: Base64 decoding error: {str(e)}")
                return JsonResponse({'status': 'error', 'message': f'Base64 decoding error: {str(e)}'}, status=400)

            file_name = f"{uuid.uuid4()}.{ext}"
            image_file = ContentFile(image_data, name=file_name)

            try:
                employee = models.employee_details.objects.filter(emp_no=emp_no).order_by('-id').first()

                if employee:
                    if employee.profilepic and employee.profilepic.name:
                        storage = employee.profilepic.storage
                        if storage.exists(employee.profilepic.name):
                            try:
                                storage.delete(employee.profilepic.name)
                            except Exception as e:
                                logger.error(f"Image upload failed for emp_no {emp_no}: Failed to delete old image: {str(e)}")
                                return JsonResponse({'status': 'error', 'message': f'Failed to delete old image: {str(e)}'}, status=500)

                    try:
                        employee.profilepic.save(file_name, image_file, save=True)
                        employee.save()
                        logger.info(f"Successfully updated image for emp_no {emp_no}")
                        return JsonResponse({'status': 'success', 'message': 'Image updated successfully'})
                    except Exception as e:
                        logger.error(f"Image upload failed for emp_no {emp_no}: Failed to save new image: {str(e)}")
                        return JsonResponse({'status': 'error', 'message': f'Failed to save new image: {str(e)}'}, status=500)
                else:
                    logger.info(f"Creating new employee record for emp_no {emp_no}")
                    employee = models.employee_details(
                        type=data.get('type', ''),  
                        type_of_visit=data.get('type_of_visit', ''),
                        register=data.get('register', ''),
                        purpose=data.get('purpose', ''),
                        name=data.get('name', ''),
                        dob = validate_date(data.get('dob')) or datetime.today().date(),
                        sex=data.get('sex', ''),
                        aadhar=data.get('aadhar', ''),
                        bloodgrp=data.get('bloodgrp', ''),
                        identification_marks1=data.get('identification_marks1', ''),
                        identification_marks2=data.get('identification_marks2', ''),
                        marital_status=data.get('marital_status', ''),
                        emp_no=emp_no,
                        employer=data.get('employer', ''),
                        designation=data.get('designation', ''),
                        department=data.get('department', ''),
                        job_nature=data.get('job_nature', ''),
                        doj = validate_date(data.get('doj')) or datetime.today().date(),
                        moj = validate_date(data.get('moj')) or datetime.today().date(),
                        phone_Personal=data.get('phone_Personal', ''),
                        mail_id_Personal=data.get('mail_id_Personal', ''),
                        emergency_contact_person=data.get('emergency_contact_person', ''),
                        phone_Office=data.get('phone_Office', ''),
                        mail_id_Office=data.get('mail_id_Office', ''),
                        emergency_contact_relation=data.get('emergency_contact_relation', ''),
                        mail_id_Emergency_Contact_Person=data.get('mail_id_Emergency_Contact_Person', ''),
                        emergency_contact_phone=data.get('emergency_contact_phone', ''),
                        address=data.get('address', ''),
                        role=data.get('role', ''),
                        area=data.get('area', ''),
                        nationality=data.get('nationality', ''),
                        state=data.get('state', ''),
                    )
                    try:
                        employee.profilepic.save(file_name, image_file, save=True)
                        employee.save()
                        logger.info(f"Successfully created new employee record with image for emp_no {emp_no}")
                        return JsonResponse({'status': 'success', 'message': 'New record added with image successfully'})
                    except Exception as e:
                        logger.error(f"Image upload failed for emp_no {emp_no}: Failed to save new employee record with image: {str(e)}")
                        return JsonResponse({'status': 'error', 'message': f'Failed to save new employee record with image: {str(e)}'}, status=500)

            except models.employee_details.DoesNotExist:
                logger.warning(f"Image upload failed for emp_no {emp_no}: Employee not found.")
                return JsonResponse({'status': 'error', 'message': 'Employee not found'}, status=404)

        except json.JSONDecodeError as e:
            logger.error(f"Image upload failed for emp_no {emp_no}: Invalid JSON data in the request body. Error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data in the request body'}, status=400)
        except Exception as e:
            logger.exception(f"Image upload failed for emp_no {emp_no}: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    logger.warning("Image upload failed: Invalid request method. Only PUT allowed.")
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def fetchdata(request):
    """Fetches employee data and related information from various models."""
    if request.method == "POST":
        try:
            # Fetch Latest Employee Records
            latest_employees = (
                models.employee_details.objects
                .values("emp_no")
                .annotate(latest_id=Max("id"))
            )

            latest_employee_ids = [emp["latest_id"] for emp in latest_employees]
            employees = list(models.employee_details.objects.filter(id__in=latest_employee_ids).values())

            media_url = settings.MEDIA_URL

            for emp in employees:
                if emp["profilepic"]:
                    emp["profilepic_url"] = f"{request.scheme}://{request.get_host()}{settings.MEDIA_URL}{emp['profilepic']}"
                else:
                    emp["profilepic_url"] = None

            def get_latest_records(model):
                try:
                    print(model._meta.db_table)
                    records = list(model.objects.filter(emp_no__in=[emp["emp_no"] for emp in employees]).values())
                    if records:
                        all_keys = records[0].keys()
                        default_structure = {key: "" for key in all_keys}
                        return {record["emp_no"]: record for record in records}, default_structure
                    else:
                        try:
                            # Instantiate a model instance (not saved to the DB)
                            instance = model()
                            fields = model._meta.get_fields()  # Get all fields from the model

                            default_structure = {}
                            for field in fields:
                                if field.concrete and not field.is_relation:
                                    if isinstance(field, (CharField, TextField)):
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

            
            dashboard_dict, dashboard_default = get_latest_records(models.Dashboard)
            vitals_dict, vitals_default = get_latest_records(models.vitals)
            msphistory_dict, msphistory_default = get_latest_records(models.MedicalHistory)
            haematology_dict, haematology_default = get_latest_records(models.heamatalogy)
            routinesugartests_dict, routinesugartests_default = get_latest_records(models.RoutineSugarTests)
            renalfunctiontests_dict, renalfunctiontests_default = get_latest_records(models.RenalFunctionTest)
            lipidprofile_dict, lipidprofile_default = get_latest_records(models.LipidProfile)
            liverfunctiontest_dict, liverfunctiontest_default = get_latest_records(models.LiverFunctionTest)
            thyroidfunctiontest_dict, thyroidfunctiontest_default = get_latest_records(models.ThyroidFunctionTest)
            coagulationtest_dict, coagulationtest_default = get_latest_records(models.CoagulationTest)
            enzymesandcardiacprofile_dict, enzymesandcardiacprofile_default = get_latest_records(models.EnzymesCardiacProfile)
            urineroutine_dict, urineroutine_default = get_latest_records(models.UrineRoutineTest)
            serology_dict, serology_default = get_latest_records(models.SerologyTest)
            motion_dict, motion_default = get_latest_records(models.MotionTest)
            menspack_dict, menspack_default = get_latest_records(models.MensPack)
            opthalamicreport_dict, opthalamicreport_default = get_latest_records(models.OphthalmicReport)
            usg_dict, usg_default = get_latest_records(models.USGReport)
            mri_dict, mri_default = get_latest_records(models.MRIReport)
            fitnessassessment_dict, fitnessassessment_default = get_latest_records(models.FitnessAssessment)
            vaccination_dict, vaccination_default = get_latest_records(models.VaccinationRecord)
            consultation_dict, consultation_default = get_latest_records(models.Consultation)
            prescription_dict, prescription_default = get_latest_records(models.Prescription)
            significant_notes_dict, significant_notes_default = get_latest_records(models.SignificantNotes)
            form17_dict, form17_default = get_latest_records(models.Form17)
            form38_dict, form38_default = get_latest_records(models.Form38)
            form39_dict, form39_default = get_latest_records(models.Form39)
            form40_dict, form40_default = get_latest_records(models.Form40)
            form27_dict, form27_default = get_latest_records(models.Form27)
            if not employees:
                logger.info("No employee records found.")
                return JsonResponse({"data": []}, status=200)

            merged_data = []
            for emp in employees:
                emp_no = emp["emp_no"]
                emp["dashboard"] = dashboard_dict.get(emp_no, dashboard_default or {})
                emp["vitals"] = vitals_dict.get(emp_no, vitals_default or {})
                emp["haematology"] = haematology_dict.get(emp_no, haematology_default or {})
                emp["msphistory"] = msphistory_dict.get(emp_no, msphistory_default or {})
                emp["routinesugartests"] = routinesugartests_dict.get(emp_no, routinesugartests_default or {})
                emp["renalfunctiontests_and_electrolytes"] = renalfunctiontests_dict.get(emp_no, renalfunctiontests_default or {})
                emp["lipidprofile"] = lipidprofile_dict.get(emp_no, lipidprofile_default or {})
                emp["liverfunctiontest"] = liverfunctiontest_dict.get(emp_no, liverfunctiontest_default or {})
                emp["thyroidfunctiontest"] = thyroidfunctiontest_dict.get(emp_no, thyroidfunctiontest_default or {})
                emp["coagulationtest"] = coagulationtest_dict.get(emp_no, coagulationtest_default or {})
                emp["enzymesandcardiacprofile"] = enzymesandcardiacprofile_dict.get(emp_no, enzymesandcardiacprofile_default or {})
                emp["urineroutine"] = urineroutine_dict.get(emp_no, urineroutine_default or {})
                emp["serology"] = serology_dict.get(emp_no, serology_default or {})
                emp["motion"] = motion_dict.get(emp_no, motion_default or {})
                emp["menspack"] = menspack_dict.get(emp_no, menspack_default or {})
                emp["opthalamicreport"] = opthalamicreport_dict.get(emp_no, opthalamicreport_default or {})
                emp["usg"] = usg_dict.get(emp_no, usg_default or {})
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

import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import models  # Import your models

logger = logging.getLogger(__name__)

def parse_date(date_str):
    """Converts date string to YYYY-MM-DD format if valid, else returns None."""
    if not date_str:
        print("date_str is None")
        return date.today()
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()  # Ensure correct format
    except ValueError:
        logger.warning(f"Invalid date format received: {date_str}")
        return None  # Invalid format

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
# Import your models and the parse_date helper
from . import models # Adjust the import path if needed
# from .utils import parse_date # Or import from where you placed it
import logging

logger = logging.getLogger(__name__)

# Make sure parse_date is defined as shown above or imported

import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# Assuming your models are imported like this:
from . import models # Make sure models is imported correctly
# Assuming parse_date is defined elsewhere or replace with actual parsing logic
# from .utils import parse_date # Example import

logger = logging.getLogger(__name__)

# Dummy parse_date function for demonstration if not defined elsewhere
def parse_date(date_str):
    if not date_str:
        return None
    try:
        # Adjust the format '%Y-%m-%d' if your incoming date strings are different
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        logger.warning(f"Could not parse date: {date_str}")
        return None


@csrf_exempt
def dashboard_stats(request):
    """Calculates and returns dashboard statistics based on filters."""
    try:
        from_date_str = request.GET.get("fromDate")
        to_date_str = request.GET.get("toDate")
        visit_type_filter = request.GET.get("visitType")
        entity_filter = request.GET.get("entityType")

        today = date.today()
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else today
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else today

        queryset = models.Dashboard.objects.filter(date__range=[from_date, to_date])

        if visit_type_filter in ["Preventive", "Curative"]:
            queryset = queryset.filter(type_of_visit=visit_type_filter)

        if entity_filter == "Total Footfalls":
            type_counts = queryset.values("type").annotate(count=Count("type"))
        else:
            entity_mapping = {
                "Employee": {"type": "Employee"},
                "Contractor": {"type": "Contractor"},
                "Visitor": {"type": "Visitor"},
            }
            if entity_filter in entity_mapping:
                queryset = queryset.filter(**entity_mapping[entity_filter])

            type_counts = queryset.values("type").annotate(count=Count("type"))

        type_of_visit_counts = queryset.values("type_of_visit").annotate(count=Count("type_of_visit"))
        register_counts = queryset.values("register").annotate(count=Count("register"))
        purpose_counts = queryset.values("purpose").annotate(count=Count("purpose"))

        data = {
            "type_counts": list(type_counts),
            "type_of_visit_counts": list(type_of_visit_counts),
            "register_counts": list(register_counts),
            "purpose_counts": list(purpose_counts),
        }

        return JsonResponse(data, safe=False)

    except Exception as e:
        logger.exception("Error in dashboard_stats view: An unexpected error occurred.")
        return JsonResponse({"error": str(e)}, status=500)

import json
import logging
import base64
import uuid # For generating unique filenames
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile # For handling image data
from . import models # Assuming your models are in the same app's models.py

logger = logging.getLogger(__name__)

def parse_date(date_str):
    """Safely parses date strings, returning None if invalid."""
    if not date_str:
        return None
    try:
        # Attempt common formats, add more if needed
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        try:
            # Handle potential ISO format with time/timezone
            return datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
        except (ValueError, TypeError):
             logger.warning(f"Could not parse date: {date_str}")
             return None

import json
import base64
import uuid
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
# Assuming your models are in 'yourapp.models' and BaseModel/parse_date are available
# from . import models # Or wherever your models are
# from .utils import parse_date # Or wherever parse_date is
# Mock models and parse_date for demonstration if needed
from django.db import models as django_models # Using alias to avoid naming conflict
class BaseModel(django_models.Model): # Mock BaseModel
    entry_date = django_models.DateField(auto_now_add=True)
    class Meta:
        abstract = True

# --- Mock parse_date function ---
def parse_date(date_str):
    if not date_str:
        return None
    try:
        # Attempt common formats, add more as needed
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        try:
            return datetime.strptime(date_str, '%d-%m-%Y').date()
        except ValueError:
             try: # Handle cases where it might already be a date object (less likely from JSON)
                 if isinstance(date_str, datetime.date):
                     return date_str
             except:
                 logger.warning(f"Could not parse date: {date_str}")
                 return None

# --- Mock Models ---
class MockEmployeeDetailsManager(django_models.Manager):
    def filter(self, *args, **kwargs): return self # Chainable mock
    def exclude(self, *args, **kwargs): return self # Chainable mock
    def order_by(self, *args): return self # Chainable mock
    def last(self): return None # Mock last() result
    def values(self, *args): return self # Chainable mock
    def distinct(self): return self # Chainable mock
    def count(self): return 0 # Mock count
    def update_or_create(self, defaults=None, **kwargs): return (MockEmployeeDetails(**kwargs, **(defaults or {})), True) # Mock create
    def get_or_create(self, defaults=None, **kwargs): return (MockEmployeeDetails(**kwargs, **(defaults or {})), True) # Mock create

class MockImageField: # Mock ImageField enough for .save()
    def save(self, name, content, save=True):
        self.name = name # Store the name to simulate saving
        pass # No actual file saving in mock

class MockEmployeeDetails(BaseModel):
    EMPLOYEE_TYPES = [('Employee', 'Employee'), ('Contractor', 'Contractor'), ('Visitor', 'Visitor')]
    MARITAL_STATUS_CHOICES = [('Single', 'Single'), ('Married', 'Married'), ('Other', 'Other'), ('Divorced', 'Divorced'), ('Widowed', 'Widowed'), ('Separated', 'Separated')]
    type = django_models.CharField(max_length=50, choices=EMPLOYEE_TYPES, default='Employee')
    type_of_visit = django_models.CharField(max_length=255, blank=True, default='')
    register = django_models.CharField(max_length=255, blank=True, default='')
    purpose = django_models.CharField(max_length=255, blank=True, default='')
    name = django_models.CharField(max_length=225, default='')
    dob = django_models.DateField(null=True, blank=True)
    sex = django_models.CharField(max_length=50, blank=True, default='')
    aadhar = django_models.CharField(max_length=225, blank=True, default='')
    bloodgrp = django_models.CharField(max_length=225, blank=True, default='')
    identification_marks1 = django_models.CharField(max_length=225, blank=True, default='')
    identification_marks2 = django_models.CharField(max_length=225, blank=True, default='')
    marital_status = django_models.CharField(max_length=50, choices=MARITAL_STATUS_CHOICES, blank=True, default='')
    emp_no = django_models.CharField(max_length=200, blank=True, unique=True, default='') # Made unique for simplicity here
    employer = django_models.CharField(max_length=225, blank=True, default='')
    designation = django_models.CharField(max_length=225, blank=True, default='')
    department = django_models.CharField(max_length=225, blank=True, default='')
    job_nature = django_models.CharField(max_length=225, blank=True, default='')
    doj = django_models.DateField(null=True, blank=True)
    moj = django_models.CharField(max_length=225, blank=True, default='')
    phone_Personal = django_models.CharField(max_length=225, blank=True, default='')
    mail_id_Personal = django_models.EmailField(max_length=225, blank=True, default='')
    emergency_contact_person = django_models.CharField(max_length=225, blank=True, default='')
    phone_Office = django_models.CharField(max_length=225, blank=True, default='')
    mail_id_Office = django_models.EmailField(max_length=225, blank=True, default='')
    emergency_contact_relation = django_models.CharField(max_length=225, blank=True, default='')
    mail_id_Emergency_Contact_Person = django_models.EmailField(max_length=225, blank=True, default='')
    emergency_contact_phone = django_models.CharField(max_length=225, blank=True, default='')
    role = django_models.CharField(max_length=50, blank=True, default='')
    permanent_address = django_models.TextField(blank=True, default='')
    permanent_area = django_models.CharField(max_length=50, blank=True, default='')
    location = django_models.CharField(max_length=50, blank=True, default='')
    permanent_nationality = django_models.CharField(max_length=50, blank=True, default='')
    permanent_state = django_models.CharField(max_length=50, blank=True, default='')
    residential_address = django_models.TextField(blank=True, default='')
    residential_area = django_models.CharField(max_length=50, blank=True, default='')
    residential_nationality = django_models.CharField(max_length=50, blank=True, default='')
    residential_state = django_models.CharField(max_length=50, blank=True, default='')
    profilepic = MockImageField() # Mock field
    profilepic_url = django_models.URLField(max_length=255, blank=True, default='')
    country_id = django_models.CharField(max_length=255, blank=True, default='')
    other_site_id = django_models.CharField(max_length=255, blank=True, default='')
    organization = django_models.CharField(max_length=255, blank=True, default='')
    addressOrganization = django_models.CharField(max_length=255, blank=True, default='')
    visiting_department = django_models.CharField(max_length=255, blank=True, default='')
    visiting_date_from = django_models.DateField(null=True, blank=True)
    stay_in_guest_house = django_models.CharField(max_length=50, blank=True, default='')
    visiting_purpose = django_models.CharField(max_length=255, blank=True, default='')
    year = django_models.CharField(max_length=4, blank=True, default='')
    batch = django_models.CharField(max_length=255, blank=True, default='')
    hospitalName = django_models.CharField(max_length=255, blank=True, default='')
    campName = django_models.CharField(max_length=255, blank=True, default='')
    contractName = django_models.CharField(max_length=255, blank=True, default='')
    prevcontractName = django_models.CharField(max_length=255, blank=True, default='')
    old_emp_no = django_models.CharField(max_length=200, blank=True, default='')
    reason = django_models.CharField(max_length=255, blank=True, default='')
    status = django_models.CharField(max_length=255, blank=True, default='')
    employee_status = django_models.CharField(max_length=255, blank=True, default='')
    since_date = django_models.DateField(blank=True, null=True)
    transfer_details = django_models.TextField(blank=True, null=True)
    other_reason_details = django_models.TextField(blank=True, null=True)
    mrdNo = django_models.CharField(max_length=255, blank=True, default='')
    id = django_models.AutoField(primary_key=True) # Add explicitly for mock

    # Add a constructor for easy mocking
    def __init__(self, **kwargs):
        self._state = django_models.base.ModelState() # Required for Django model instances
        super().__init__()
        for field, value in kwargs.items():
            setattr(self, field, value)
        # Set default values for fields not provided in kwargs
        for field in self._meta.fields:
            if field.name not in kwargs and hasattr(field, 'default') and field.default != django_models.fields.NOT_PROVIDED:
                 setattr(self, field.name, field.default)
        # Ensure profilepic is initialized as the mock object
        self.profilepic = MockImageField()

    objects = MockEmployeeDetailsManager() # Use the mock manager

    def __str__(self):
        return self.emp_no if self.emp_no else f"Employee {self.id}"

    def save(self, *args, **kwargs):
        # Mock save behaviour
        if hasattr(self, 'profilepic') and not self.profilepic.name: # Check if name is set (simulates file not saved)
            self.profilepic_url = ''
        elif hasattr(self, 'profilepic') and self.profilepic.name:
             # In a real scenario, you'd generate the URL here
             self.profilepic_url = f'/media/profilepics/{self.profilepic.name}'
        super().save(*args, **kwargs) # Call parent save if needed, though it does nothing in this mock


class MockDashboardManager(django_models.Manager):
     def update_or_create(self, defaults=None, **kwargs):
        # Find existing or create new mock instance
        # This is simplified; a real mock might need more logic
        return (MockDashboard(**kwargs, **(defaults or {})), True)

class MockDashboard(BaseModel):
    emp_no = django_models.CharField(max_length=200)
    date = django_models.DateField()
    type = django_models.CharField(max_length=50, default='')
    type_of_visit = django_models.CharField(max_length=255, blank=True, default='')
    register = django_models.CharField(max_length=255, blank=True, default='')
    purpose = django_models.CharField(max_length=255, blank=True, default='')
    year = django_models.CharField(max_length=4, blank=True, default='')
    batch = django_models.CharField(max_length=255, blank=True, default='')
    hospitalName = django_models.CharField(max_length=255, blank=True, default='')
    campName = django_models.CharField(max_length=255, blank=True, default='')
    contractName = django_models.CharField(max_length=255, blank=True, default='')
    prevcontractName = django_models.CharField(max_length=255, blank=True, default='')
    old_emp_no = django_models.CharField(max_length=200, blank=True, default='')
    reason = django_models.CharField(max_length=255, blank=True, default='')
    status = django_models.CharField(max_length=255, blank=True, default='')
    mrdNo = django_models.CharField(max_length=255, blank=True, default='')
    id = django_models.AutoField(primary_key=True) # Add explicitly for mock

    objects = MockDashboardManager()

    # Add a constructor for easy mocking
    def __init__(self, **kwargs):
        self._state = django_models.base.ModelState() # Required for Django model instances
        super().__init__()
        for field, value in kwargs.items():
            setattr(self, field, value)

# Namespace the models for clarity
class models:
    employee_details = MockEmployeeDetails
    Dashboard = MockDashboard

# --- Logger Setup ---
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# --- Views ---

@csrf_exempt
def addEntries(request):
    """
    Adds or updates an employee_details record for a visit entry,
    assigns a unique MRD number on the first entry for an employee,
    and updates Dashboard records. Includes all fields from employee_details
    where applicable for an initial entry.
    """
    if request.method != "POST":
        logger.warning("addEntries failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    emp_no = None # Initialize emp_no for potential use in exception logging
    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for addEntries: {data}")

        emp_no = data.get('emp_no')
        if not emp_no:
            logger.warning("addEntries failed: Employee number (emp_no) is required")
            return JsonResponse({"error": "Employee number (emp_no) is required"}, status=400)

        entry_date = datetime.now().date()  # Use current date for the visit entry
        extra_data = data.get('extraData', {})
        dashboard_data = data.get('formDataDashboard', {})
        employee_data = data.get('formData', {})  # Basic details payload
        print(employee_data['profilepic'])
        register = dashboard_data.get('register', '') # Get register value

        # --- MRD Number Logic ---
        determined_mrd_no = None
        existing_entry_with_mrd = models.employee_details.objects.filter(
            emp_no=emp_no,
            mrdNo__isnull=False
        ).exclude(
            mrdNo=''
        ).order_by('-entry_date').first() # Get the absolute latest record with MRD

        if existing_entry_with_mrd:
            determined_mrd_no = existing_entry_with_mrd.mrdNo
            logger.info(f"Found existing MRD number {determined_mrd_no} for emp_no: {emp_no}")
        else:
            logger.info(f"No existing MRD found for emp_no: {emp_no}. Generating new MRD number.")
            # Count distinct employees who *already have* a valid MRD across all their entries
            # Note: This count could be slightly off if MRD generation isn't atomic, but usually okay.
            count_with_mrd = models.employee_details.objects.filter(
                mrdNo__isnull=False
            ).exclude(
                mrdNo=''
            ).values('emp_no').distinct().count()
            next_mrd_sequence = count_with_mrd + 1
            seq_part = f"{next_mrd_sequence:06d}" # Pad to 6 digits
            date_part = entry_date.strftime('%d%m%Y') # Use current entry date
            determined_mrd_no = f"{seq_part}{date_part}"
            logger.info(f"Generated new MRD number {determined_mrd_no} for emp_no: {emp_no}")
        # --- End MRD Number Logic ---

        # Prepare defaults for the employee_details model for *this specific visit entry*
        # Includes ALL fields, sourcing from appropriate data buckets.
        employee_defaults = {
            # Basic Details (from employee_data)
            'name': employee_data.get('name', ''),
            'dob': parse_date(employee_data.get('dob')),
            'sex': employee_data.get('sex', ''),
            'aadhar': employee_data.get('aadhar', ''),
            'bloodgrp': employee_data.get('bloodgrp', ''),
            'identification_marks1': employee_data.get('identification_marks1', ''),
            'identification_marks2': employee_data.get('identification_marks2', ''),
            'marital_status': employee_data.get('marital_status', ''),
            'employer': employee_data.get('employer', ''),
            'designation': employee_data.get('designation', ''),
            'department': employee_data.get('department', ''),
            'job_nature': employee_data.get('job_nature', ''),
            'doj': parse_date(employee_data.get('doj')),
            'moj': employee_data.get('moj', ''), # Assuming moj is not a date
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
            'profilepic': employee_data['profilepic'],
            'profilepic_url': employee_data.get('profilepic_url', ''), # URL if provided separately
            'employee_status': employee_data.get('employee_status', ''), # Overall employee status
            'since_date': parse_date(employee_data.get('since_date')), # Added
            'transfer_details': employee_data.get('transfer_details', ''), # Added
            'other_reason_details': employee_data.get('other_reason_details', ''), # Added

            # Visitor Specific Details (from employee_data) - Set if provided
            'other_site_id': employee_data.get('other_site_id', ''),
            'organization': employee_data.get('organization', ''),
            'addressOrganization': employee_data.get('addressOrganization', ''),
            'visiting_department': employee_data.get('visiting_department', ''),
            'visiting_date_from': parse_date(employee_data.get('visiting_date_from')),
            'stay_in_guest_house': employee_data.get('stay_in_guest_house', ''),
            'visiting_purpose': employee_data.get('visiting_purpose', ''), # Visitor form purpose

            # Visit Context Details (from dashboard_data)
            'type': dashboard_data.get('category', 'Employee'), # Maps to EMPLOYEE_TYPES
            'type_of_visit': dashboard_data.get('typeofVisit', ''),
            'register': register,
            'purpose': dashboard_data.get('purpose', ''), # The actual visit purpose

            # Extra Context Details (from extra_data)
            'year': extra_data.get('year', ''),
            'batch': extra_data.get('batch', ''),
            'hospitalName': extra_data.get('hospitalName', ''),
            'campName': extra_data.get('campName', ''),
            'contractName': extra_data.get('contractName', ''),
            'prevcontractName': extra_data.get('prevcontractName', ''),
            'old_emp_no': extra_data.get('old_emp_no', ''),
            'reason': extra_data.get('reason', extra_data.get('purpose', '')), # Prefer 'reason', fallback to extraData's 'purpose'
            'status': extra_data.get('status', ''),

            # Determined/System Fields
            'mrdNo': determined_mrd_no,

            # NOTE: 'profilepic' (ImageField) is not typically set here, handled by add_basic_details or another upload mechanism.
        }

        # Remove None values AND empty strings to avoid overwriting existing data unintentionally
        # during an update scenario if the incoming payload omits fields.
        # Keep if the field should explicitly be cleared by an empty string. For now, removing both.
        employee_defaults_filtered = {k: v for k, v in employee_defaults.items() if v is not None and v != ''}
        # If you NEED to allow setting fields to '', remove "and v != ''"


        # Update or create the employee_details entry for *this specific visit*
        employee_entry, created = models.employee_details.objects.update_or_create(
            emp_no=emp_no,
            entry_date=entry_date,
            defaults=employee_defaults_filtered # Use filtered defaults
        )

        # Prepare data for the Dashboard model for this visit using data from the saved employee_entry
        dashboard_defaults = {
            'type': employee_entry.type,
            'type_of_visit': employee_entry.type_of_visit,
            'register': employee_entry.register,
            'purpose': employee_entry.purpose, # Visit purpose
            'date': entry_date, # Explicitly set date for dashboard key
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
        }

        # Update or create the dashboard entry for this specific visit date
        dashboard_entry, dashboard_created = models.Dashboard.objects.update_or_create(
            emp_no=emp_no,
            date=entry_date, # Use date as part of the key
            defaults=dashboard_defaults
        )

        message = f"Visit Entry {'added' if created else 'updated'} (MRD: {employee_entry.mrdNo}) and Dashboard {'created' if dashboard_created else 'updated'} successfully"

        logger.info(f"addEntries successful for emp_no: {emp_no} on {entry_date}. VisitCreated: {created}, DashboardCreated: {dashboard_created}, MRD: {employee_entry.mrdNo}")
        return JsonResponse({"message": message, "mrdNo": employee_entry.mrdNo}, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"addEntries failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"addEntries failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing the entry."}, status=500)


@csrf_exempt
def add_basic_details(request):
    """
    Adds or updates basic employee details, targeting the record for the given
    emp_no and *today's date*. Includes profile picture handling and all
    relevant fields from employee_details model considered 'basic'.
    """
    if request.method != "POST":
        logger.warning("add_basic_details failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    emp_no = None # Initialize for logging
    try:
        # Assuming the request body contains the primary data dictionary
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_basic_details: {data}")

        emp_no = data.get('emp_no')
        if not emp_no:
            logger.warning("add_basic_details failed: Employee number is required")
            return JsonResponse({"error": "Employee number is required"}, status=400)

        # This view operates on TODAY's record.
        # Consider if you need a different strategy (e.g., update latest, or have a separate 'profile' model).
        entry_date = datetime.now().date()

        # Prepare defaults dictionary with ALL relevant fields for basic details update
        basic_defaults = {
            'name': data.get('name'),
            'dob': parse_date(data.get('dob')),
            'sex': data.get('sex'),
            'aadhar': data.get('aadhar'),
            'bloodgrp': data.get('bloodgrp'),
            'identification_marks1': data.get('identification_marks1'),
            'identification_marks2': data.get('identification_marks2'),
            'marital_status': data.get('marital_status'),
            'employer': data.get('employer'),
            'designation': data.get('designation'),
            'department': data.get('department'),
            'job_nature': data.get('job_nature'),
            'doj': parse_date(data.get('doj')),
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
            'profilepic_url': data.get('profilepic_url'), # Added explicitly
            'employee_status': data.get('employee_status'),
            'since_date': parse_date(data.get('since_date')),
            'transfer_details': data.get('transfer_details'),
            'other_reason_details': data.get('other_reason_details'),
            'mrdNo': data.get('mrdNo'), # Allow updating MRD if provided explicitly here

            # Visitor Fields (can be updated via basic details if needed)
            'other_site_id': data.get('other_site_id'),
            'organization': data.get('organization'),
            'addressOrganization': data.get('addressOrganization'),
            'visiting_department': data.get('visiting_department'),
            'visiting_date_from': parse_date(data.get('visiting_date_from')),
            'stay_in_guest_house': data.get('stay_in_guest_house'),
            'visiting_purpose': data.get('visiting_purpose'), # Purpose specific to visitor form

            # Set 'type' based on role, potentially overwriting if role changes
            'type': data.get('role', 'Employee'), # Defaulting to Employee if role is missing

            # Fields typically NOT set/updated via basic details:
            # type_of_visit, register, purpose (visit purpose),
            # year, batch, hospitalName, campName, contractName,
            # prevcontractName, old_emp_no, reason, status
            # These are generally context/visit specific.
        }

        # Remove None values from defaults to prevent accidental overwrites with null.
        # Decide if empty strings should also be removed or if they signify clearing a field.
        # Current implementation keeps empty strings, allowing fields to be cleared.
        basic_defaults_filtered = {k: v for k, v in basic_defaults.items() if v is not None}

        # Get or create the record for today using filtered defaults for creation
        employee, created = models.employee_details.objects.get_or_create(
            emp_no=emp_no,
            entry_date=entry_date,
            defaults=basic_defaults_filtered # Set defaults only if created
        )

        # If the record already existed, update it with the new filtered defaults
        if not created:
            update_fields_list = []
            for key, value in basic_defaults_filtered.items():
                if getattr(employee, key) != value: # Only update if value changed
                   setattr(employee, key, value)
                   update_fields_list.append(key)
            # Note: Image is handled separately below, then final save happens.

        # --- Handle Profile Picture Update ---
        profile_image_b64 = data.get('profilepic') # Renamed key for clarity
        image_updated = False
        if profile_image_b64:
            try:
                if ';base64,' in profile_image_b64:
                    header, encoded = profile_image_b64.split(';base64,', 1)
                    file_ext = header.split('/')[-1].split('+')[0] if header.startswith('data:image/') else 'jpg' # Handle image/svg+xml etc.
                else:
                    encoded = profile_image_b64
                    file_ext = 'jpg' # Assume jpg if no header

                # Basic validation of base64 data
                if not encoded or len(encoded) % 4 != 0:
                    raise ValueError("Invalid base64 string")

                image_data = base64.b64decode(encoded)
                filename = f"profilepics/{emp_no}_{uuid.uuid4().hex[:8]}.{file_ext}"
                employee.profilepic.save(filename, ContentFile(image_data), save=False) # save=False initially
                image_updated = True
                if not created: # Add profilepic to fields to be updated if updating
                    update_fields_list.append('profilepic')
                logger.info(f"Profile picture prepared for emp_no: {emp_no}")

            except (TypeError, ValueError, base64.binascii.Error) as img_err:
                logger.error(f"Failed to decode or save profile picture for emp_no {emp_no}: {img_err}")
                # Decide if this should be a fatal error or just logged
                # return JsonResponse({"error": f"Invalid profile picture data: {img_err}"}, status=400) # Optional: return error
            except Exception as img_ex:
                logger.exception(f"Unexpected error saving profile picture for emp_no {emp_no}")
                # return JsonResponse({"error": "Error processing profile picture."}, status=500) # Optional: return error
        elif 'profilepic' in data and data['profilepic'] is None:
             # Explicitly clear the image if 'profilepic' is sent as null or empty
             if employee.profilepic: # Check if there is an existing picture
                 employee.profilepic.delete(save=False) # Delete the file
                 image_updated = True
                 if not created:
                     update_fields_list.append('profilepic')
                 logger.info(f"Profile picture cleared for emp_no: {emp_no}")


        # Final save to commit all changes
        if not created:
            # Only save if there were updates or image changes
            if update_fields_list or image_updated:
                 # The model's save() method should handle updating profilepic_url based on profilepic field
                 employee.save(update_fields=update_fields_list if update_fields_list else None) # Pass specific fields for efficiency
                 logger.info(f"Updated fields for emp_no {emp_no}: {update_fields_list}")
            else:
                 logger.info(f"No changes detected for emp_no {emp_no}. Skipping save.")
        else:
            # For newly created records, save everything (including potential image set above)
            employee.save()


        message = "Basic Details added successfully" if created else "Basic Details updated successfully"
        return JsonResponse({
            "message": message,
            "emp_no": emp_no,
            "entry_date": entry_date.isoformat(),
            "profilepic_url": employee.profilepic_url # Return current URL
            }, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"add_basic_details failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except KeyError as e:
        # This might occur if data.get() expects a key that MUST exist, though .get() prevents this.
        # More likely if accessing nested dicts directly e.g., data['address']['street']
        logger.error(f"add_basic_details failed: Missing key in data structure - {str(e)}")
        return JsonResponse({"error": f"Missing expected data field: {str(e)}"}, status=400)
    except Exception as e:
        logger.exception(f"add_basic_details failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "An internal server error occurred while processing basic details."}, status=500)


@csrf_exempt
def add_vital_details(request):
    """Adds or updates vital details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')  # Crucial: Get emp_no from the data
            entry_date = datetime.now().date()

            if not emp_no:
                logger.warning("add_vital_details failed: Employee number is required")
                return JsonResponse({"error": "Employee number is required"}, status=400)

            # Filter out unexpected fields (as before)
            allowed_fields = {field.name for field in models.vitals._meta.fields}
            allowed_fields.remove('id')
            allowed_fields.remove('entry_date')# remove entrydate from allowed fields for updating it
            filtered_data = {key: value for key, value in data.items() if key in allowed_fields}
            

            vitals, created = models.vitals.objects.update_or_create(
                emp_no=emp_no,
                entry_date = entry_date,
                defaults=filtered_data
            )

            message = "Vital Details added successfully" if created else "Vital Details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_vital_details failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_vital_details failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_vital_details failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_motion_test(request):
    """Adds or updates motion test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            motion_test, created = models.MotionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Motion Test details added successfully" if created else "Motion Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_motion_test failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_motion_test failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_motion_test failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_culture_sensitivity_test(request):
    """Adds or updates culture sensitivity test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            culture_sensitivity_test, created = models.CultureSensitivityTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Culture Sensitivity Test details added successfully" if created else "Culture Sensitivity Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_culture_sensitivity_test failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_culture_sensitivity_test failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_culture_sensitivity_test failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_mens_pack(request):
    """Adds or updates Mens Pack details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            mens_pack, created = models.MensPack.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Mens Pack details added successfully" if created else "Mens Pack details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_mens_pack failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_mens_pack failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_mens_pack failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_opthalmic_report(request):
    """Adds or updates ophthalmic report details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            opthalmic_report, created = models.OphthalmicReport.objects.update_or_create(
                emp_no=emp_no,                entry_date=entry_date,
                defaults=data
            )

            message = "Ophthalmic Report details added successfully" if created else "Ophthalmic Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_opthalmic_report failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_opthalmic_report failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_opthalmic_report failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_usg_report(request):
    """Adds or updates USG report details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            usg_report, created = models.USGReport.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "USG Report details added successfully" if created else "USG Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_usg_report failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_usg_report failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_usg_report failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_mri_report(request):
    """Adds or updates MRI report details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            mri_report, created = models.MRIReport.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "MRI Report details added successfully" if created else "MRI Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_mri_report failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_mri_report failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_mri_report failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def insert_vaccination(request):
    """Inserts or updates vaccination record."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emp_no = data.get("emp_no")
            vaccination = data.get("vaccination")

            if not emp_no or not vaccination:
                logger.warning("insert_vaccination failed: emp_no and vaccination fields are required")
                return JsonResponse({"error": "emp_no and vaccination fields are required"}, status=400)

            entry_date = datetime.now().date()

            vaccination_record, created = VaccinationRecord.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults={'vaccination': vaccination}
            )

            if created:
                message = "Vaccination record saved successfully"
            else:
                message = "Vaccination record updated successfully"

            return JsonResponse({
                "message": message,
                "created": {
                    "id": vaccination_record.id,
                    "emp_no": vaccination_record.emp_no,
                    "vaccination": vaccination_record.vaccination,
                    "entry_date": vaccination_record.entry_date.strftime("%Y-%m-%d %H:%M:%S")
                }
            }, status=200 if not created else 201)

        except json.JSONDecodeError as e:
            logger.error(f"insert_vaccination failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.exception("insert_vaccination failed: An unexpected error occurred.")
            return JsonResponse({"error": "An error occurred: " + str(e)}, status=500)

    logger.warning("insert_vaccination failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_haem_report(request):
    """Adds or updates haematology report details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            haematology, created = models.heamatalogy.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Haematology details added successfully" if created else "Haematology details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_haem_report failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_haem_report failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_haem_report failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_routine_sugar(request):
    """Adds or updates routine sugar test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            routine_sugar, created = models.RoutineSugarTests.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Routine Sugar Test details added successfully" if created else "Routine Sugar Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_routine_sugar failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_routine_sugar failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_routine_sugar failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_renel_function(request):
    """Adds or updates renal function test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            renal_function, created = models.RenalFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Renal Function Test details added successfully" if created else "Renal Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_renel_function failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_renel_function failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_renel_function failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_lipid_profile(request):
    """Adds or updates lipid profile details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            lipid_profile, created = models.LipidProfile.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Lipid Profile details added successfully" if created else "Lipid Profile details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_lipid_profile failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_lipid_profile failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_lipid_profile failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_liver_function(request):
    """Adds or updates liver function test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            liver_function, created = models.LiverFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Liver Function Test details added successfully" if created else "Liver Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_liver_function failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_liver_function failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_liver_function failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_thyroid_function(request):
    """Adds or updates thyroid function test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            thyroid_function, created = models.ThyroidFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Thyroid Function Test details added successfully" if created else "Thyroid Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_thyroid_function failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_thyroid_function failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_thyroid_function failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_enzymes_cardiac(request):
    """Adds or updates enzymes cardiac profile details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            enzymes_cardiac, created = models.EnzymesCardiacProfile.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Enzymes Cardiac Profile details added successfully" if created else "Enzymes Cardiac Profile details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_enzymes_cardiac failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_enzymes_cardiac failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_enzymes_cardiac failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_urine_routine(request):
    """Adds or updates urine routine test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            urine_routine, created = models.UrineRoutineTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Urine Routine Test details added successfully" if created else "Urine Routine Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_urine_routine failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_urine_routine failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_urine_routine failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_serology(request):
    """Adds or updates serology test details."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            serology, created = models.SerologyTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Serology Test details added successfully" if created else "Serology Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"add_serology failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_serology failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("add_serology failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def BookAppointment(request):
    """Books a new appointment."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract data, providing defaults for optional fields
            role = data.get("role", None)
            name = data.get("name", None)
            employee_id = data.get("employeeId", None)
            organization_name = data.get("organization", None)
            aadhar_no = data.get("aadharNo", None)
            contractor_name = data.get("contractorName", None)
            purpose = data.get("purpose", None)
            appointment_date_str = data.get("appointmentDate", None)
            time = data.get("time", None)
            booked_by = data.get("bookedBy", None)
            submitted_by_nurse = data.get("submitted_by_nurse", None)
            submitted_Dr = data.get("submitted_Dr", None)
            consulted_Dr = data.get("consultedDoctor", None)

            if not appointment_date_str:
                logger.warning("BookAppointment failed: Appointment date is required.")
                return JsonResponse({"error": "Appointment date is required"}, status=400)

            try:
                appointment_date = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
            except ValueError as e:
                logger.error(f"BookAppointment failed: Invalid appointment date format. Error: {str(e)}")
                return JsonResponse({"error": "Invalid appointment date format. Use YYYY-MM-DD."}, status=400)

            existing_appointments = Appointment.objects.filter(date=appointment_date).count()
            next_appointment_number = existing_appointments + 1
            appointment_no = f"{next_appointment_number:04d}{appointment_date.strftime('%d%m%Y')}"

            # Create an Appointment instance
            appointment = Appointment.objects.create(
                appointment_no=appointment_no,
                booked_date=datetime.now().strftime("%Y-%m-%d"),
                role=role,
                emp_no=employee_id,
                aadhar_no=aadhar_no,
                name=name,
                organization_name=organization_name,
                contractor_name=contractor_name,
                purpose=purpose,
                date=appointment_date,
                time=time,
                booked_by=booked_by,
                submitted_by_nurse=submitted_by_nurse,
                submitted_Dr=submitted_Dr,
                consultated_Dr=consulted_Dr,
                employer=organization_name if role == "Employee" else contractor_name,
            )

            logger.info(f"Appointment booked successfully for {appointment.name} on {appointment.date}. Appointment No: {appointment.appointment_no}")
            return JsonResponse({"message": f"Appointment booked successfully for {appointment.name} on {appointment.date}. Appointment No: {appointment.appointment_no}"})

        except json.JSONDecodeError as e:
            logger.error(f"BookAppointment failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("BookAppointment failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("BookAppointment failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def get_appointments(request):
    """Retrieves appointments based on provided filters."""
    if request.method == "GET":
        from_date_str = request.GET.get('fromDate')
        to_date_str = request.GET.get('toDate')
        today = datetime.today().date()

        try:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else None
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else None
        except ValueError as e:
            logger.error(f"get_appointments failed: Invalid date format. Error: {str(e)}")
            return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        if from_date and to_date:
            appointments = Appointment.objects.filter(
                date__gte=from_date,
                date__lte=to_date
            ).order_by('date', 'time')
        elif from_date:
            appointments = Appointment.objects.filter(
                date__gte=from_date
            ).order_by('date', 'time')
        elif to_date:
            appointments = Appointment.objects.filter(
                date__lte=to_date
            ).order_by('date', 'time')
        else:
            appointments = Appointment.objects.filter(date=today).order_by('date', 'time')

        appointment_list = list(appointments.values())
        return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."}, safe=False)

    logger.warning("get_appointments failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def update_appointment_status(request):
    """Updates the status of an appointment."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            appointment_id = data.get("id")

            try:
                appointment = Appointment.objects.get(id=appointment_id)
            except Appointment.DoesNotExist:
                logger.warning(f"update_appointment_status failed: Appointment with ID {appointment_id} not found.")
                return JsonResponse({"success": False, "message": "Appointment not found"}, status=404)

            if appointment.status == Appointment.StatusChoices.INITIATE:
                appointment.status = Appointment.StatusChoices.IN_PROGRESS
            elif appointment.status == Appointment.StatusChoices.IN_PROGRESS:
                appointment.status = Appointment.StatusChoices.COMPLETED
            else:
                logger.warning(f"update_appointment_status failed: Cannot update status further for appointment ID {appointment_id}.")
                return JsonResponse({"success": False, "message": "Cannot update status further."})

            appointment.save()
            logger.info(f"Appointment status updated successfully for appointment ID {appointment_id}. New status: {appointment.status}")
            return JsonResponse({"success": True, "message": "Status updated", "status": appointment.status})

        except json.JSONDecodeError as e:
            logger.error(f"update_appointment_status failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"success": False, "message": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("update_appointment_status failed: An unexpected error occurred.")
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    logger.warning("update_appointment_status failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def uploadAppointment(request):
    """Uploads appointments from a JSON payload."""
    if request.method != "POST":
        logger.warning("uploadAppointment failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        appointments_data = data.get("appointments", [])
        print("appointment",appointments_data)

        if not appointments_data:
            logger.warning("uploadAppointment failed: No appointment data provided.")
            return JsonResponse({"error": "No appointment data provided."}, status=400)

        successful_appointments = 0

        for i, appointment_data in enumerate(appointments_data):
            if i == 0:  # Skip header row
                continue

            if len(appointment_data) < 7:
                logger.warning(f"uploadAppointment skipping appointment due to insufficient fields: {appointment_data}")
                continue

            try:
                role = str(appointment_data[1]).strip().lower()
                print(role)
                emp_no = str(appointment_data[3]).strip() if len(appointment_data) > 3 else None
                aadhar_no = str(appointment_data[5]).strip() if len(appointment_data) > 5 else None

                def parse_date(value):
                    if isinstance(value, int):  # Excel serial date handling
                        return (datetime(1899, 12, 30) + timedelta(days=value)).date()
                    try:
                        return datetime.strptime(str(value).strip(), "%Y-%m-%d").date()
                    except ValueError:
                         try:
                            return datetime.strptime(str(value).strip(), "%m/%d/%Y").date()
                         except ValueError:
                             raise ValueError(f"Invalid date format: {value}.  Use YYYY-MM-DD or MM/DD/YYYY")

                date = parse_date(appointment_data[8])
                time = str(appointment_data[9]).strip()

                booked_by = str(appointment_data[10]).strip() if len(appointment_data) > 10 else ""
                submitted_by_nurse = str(appointment_data[11]).strip() if len(appointment_data) > 13 else ""
                submitted_Dr = str(appointment_data[12]).strip() if len(appointment_data) > 10 else ""
                consulted_Dr = str(appointment_data[13]).strip() if len(appointment_data) > 13 else ""
                purpose = str(appointment_data[7]).strip()
                
                name = str(appointment_data[2]).strip() if len(appointment_data) > 2 else ""
                organization = str(appointment_data[4]).strip() if len(appointment_data) > 4 else ""
                contractor_name = "-"
                # organization = None

                if role == "contractor":
                    contractor_name = str(appointment_data[6]).strip() if len(appointment_data) > 6 else None
                # elif role == "visitor" or role =="employee":
                #     organization = str(appointment_data[6]).strip() if len(appointment_data) > 6 else None

                formatted_date = date.strftime("%d%m%Y")
                appointment_count = Appointment.objects.filter(date=date).count() + 1
                appointment_no = f"{appointment_count:04d}{formatted_date}"

                print(f"Role: {role}, Generated Appointment No: {appointment_no}")
            except (IndexError, ValueError) as e:
                logger.error(f"uploadAppointment error processing appointment data: {appointment_data}, Error: {str(e)}")
                return JsonResponse({"error": f"Error processing appointment data: {str(e)}"}, status=400)

            try:
                if role in ["contractor", "employee", "visitor"]:
                  Appointment.objects.create(
                      appointment_no=appointment_no,
                      booked_date = datetime.now().strftime("%Y-%m-%d"),
                      role=role,
                      emp_no=emp_no,
                      aadhar_no=aadhar_no,
                      name = name,
                      organization_name = organization,
                      contractor_name=contractor_name,
                      purpose=purpose,
                      date=date,
                      time=time,
                      booked_by=booked_by,
                      submitted_by_nurse=submitted_by_nurse,
                      submitted_Dr=submitted_Dr,
                      consultated_Dr=consulted_Dr,
                  )
                  successful_appointments += 1
                else:
                    logger.warning(f"uploadAppointment skipping appointment due to unknown role: {role}")

            except ValidationError as e:
                logger.error(f"uploadAppointment validation Error creating appointment: {str(e)}")
                return JsonResponse({"error": f"Data Validation Error: {str(e)}"}, status=400)

        if successful_appointments > 0:
            logger.info(f"{successful_appointments} appointments uploaded successfully.")
            return JsonResponse({"message": f"{successful_appointments} appointments uploaded successfully."})
        else:
            logger.info("No appointments were uploaded.  Check data for valid roles and formats.")
            return JsonResponse({"message": "No appointments were uploaded.  Check data for valid roles and formats."}, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"uploadAppointment JSON Decode Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    except Exception as e:
        logger.exception("uploadAppointment Unexpected error during appointment upload")
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)



@csrf_exempt
def create_users(request):
    """Creates default users (nurse, doctor, admin, pharmacy)."""
    try:
        users = [
            {'username': 'nurse', 'password': 'nurse123'},
            {'username': 'doctor', 'password': 'doctor123'},
            {'username': 'admin', 'password': 'admin123'},
            {'username': 'pharmacy', 'password': 'pharmacy123'}
        ]
        for user_data in users:
            User.objects.create_user(username=user_data['username'], password=user_data['password'])

        logger.info("Default users created successfully.")
        return JsonResponse({"message": "Default users created successfully!"}, status=201)
    except Exception as e:
        logger.exception("create_users failed: An unexpected error occurred.")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def save_mockdrills(request):
    """Saves mock drill data."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            mock_drill = mockdrills.objects.create(
                date=data.get("date"),
                time=data.get("time"),
                department=data.get("department"),
                location=data.get("location"),
                scenario=data.get("scenario"),
                ambulance_timing=data.get("ambulance_timing"),
                departure_from_OHC=data.get("departure_from_OHC"),
                return_to_OHC=data.get("return_to_OHC"),
                emp_no=data.get("emp_no"),
                victim_department=data.get("victim_department"),
                victim_name=data.get("victim_name"),
                nature_of_job=data.get("nature_of_job"),
                age=data.get("age"),
                mobile_no=data.get("mobile_no"),
                gender=data.get("gender"),
                vitals=data.get("vitals"),
                complaints=data.get("complaints"),
                treatment=data.get("treatment"),
                referal=data.get("referal"),
                ambulance_driver=data.get("ambulance_driver"),
                staff_name=data.get("staff_name"),
                OHC_doctor=data.get("OHC_doctor"),
                staff_nurse=data.get("staff_nurse"),
                action_completion=data.get("Action_Completion"),
                responsible=data.get("Responsible"),
            )
            logger.info(f"Mock drill saved successfully with ID: {mock_drill.id}")
            return JsonResponse({"message": f"Mock drill saved successfully with ID: {mock_drill.id}"}, status=201)
        except json.JSONDecodeError as e:
            logger.error(f"save_mockdrills failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("save_mockdrills failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("save_mockdrills failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def insert_vaccination(request):
    """Inserts vaccination data (duplicate of the previous one - consider removing one)."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emp_no = data.get("emp_no")
            vaccination = data.get("vaccination")

            if not emp_no or not vaccination:
                logger.warning("insert_vaccination failed: emp_no and vaccination fields are required")
                return JsonResponse({"error": "emp_no and vaccination fields are required"}, status=400)

            created_record = VaccinationRecord.objects.create(
                emp_no=emp_no,
                vaccination=vaccination
            )

            logger.info(f"Vaccination record saved successfully for emp_no: {created_record.emp_no}")
            return JsonResponse({
                "message": "Vaccination record saved successfully",
                "created": {
                    "id": created_record.id,
                    "emp_no": created_record.emp_no,
                    "vaccination": created_record.vaccination,
                    "entry_date": created_record.entry_date.strftime("%Y-%m-%d %H:%M:%S")
                }
            }, status=201)

        except json.JSONDecodeError as e:
            logger.error(f"insert_vaccination failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.exception("insert_vaccination failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("insert_vaccination failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

def fetch_vaccinations(request):
    """Fetches vaccination records."""
    if request.method == "GET":
        emp_no = request.GET.get("emp_no")  # Optional filter by emp_no

        try:
            if emp_no:
                records = VaccinationRecord.objects.filter(emp_no=emp_no).values()
            else:
                records = VaccinationRecord.objects.all().values()

            return JsonResponse(list(records), safe=False)

        except Exception as e:
            logger.exception("fetch_vaccinations failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("fetch_vaccinations failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

# views.py (in your Django app)

import json
import logging
from datetime import datetime, date # Ensure date is imported
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import models # Or wherever your models are defined
from .models import FitnessAssessment # Import specific model

logger = logging.getLogger(__name__)

@csrf_exempt
def fitness_test(request, pk=None):
    """Adds or updates fitness assessment data for a specific date."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date() # Use today's date for the lookup/update

            if not emp_no:
                logger.warning("fitness_test failed: emp_no is missing from request data.")
                return JsonResponse({"error": "Employee number (emp_no) is required"}, status=400)

            # --- Safely parse JSON fields ---
            job_nature = []
            try:
                # Frontend should send stringified JSON or already parsed array
                raw_job_nature = data.get("job_nature", "[]")
                if isinstance(raw_job_nature, str):
                    job_nature = json.loads(raw_job_nature)
                elif isinstance(raw_job_nature, list):
                     job_nature = raw_job_nature # Already a list
                if not isinstance(job_nature, list): # Validate type after parsing/assignment
                    raise ValueError("Parsed job_nature is not a list")
            except (TypeError, json.JSONDecodeError, ValueError) as e:
                logger.warning(f"fitness_test for emp_no {emp_no}: Invalid job_nature, defaulting to []. Error: {str(e)}")
                job_nature = []

            conditional_fit_fields = [] # Note potential typo 'feilds' vs 'fields'
            try:
                # Frontend sends 'conditional_fit_feilds' based on React state
                raw_conditional = data.get("conditional_fit_feilds", "[]") # Match key from frontend
                if isinstance(raw_conditional, str):
                    conditional_fit_fields = json.loads(raw_conditional)
                elif isinstance(raw_conditional, list):
                    conditional_fit_fields = raw_conditional
                if not isinstance(conditional_fit_fields, list):
                     raise ValueError("Parsed conditional_fit_feilds is not a list")
            except (TypeError, json.JSONDecodeError, ValueError) as e:
                logger.warning(f"fitness_test for emp_no {emp_no}: Invalid conditional_fit_feilds, defaulting to []. Error: {str(e)}")
                conditional_fit_fields = []

            # --- Update Dashboard (optional side effect) ---
            try:
                # Use filter().first() or get() with exception handling
                outcome_entry = models.Dashboard.objects.filter(emp_no=emp_no, entry_date=entry_date).first()
                if outcome_entry:
                    overall_fitness_status = data.get("overall_fitness") # Get status before defaults
                    if overall_fitness_status: # Only update if provided
                        outcome_entry.visitOutcome = overall_fitness_status
                        outcome_entry.save()
                        logger.info(f"Dashboard visitOutcome updated for emp_no: {emp_no} on {entry_date}")
                else:
                     logger.info(f"No matching Dashboard entry found for emp_no: {emp_no} on {entry_date} to update outcome.")
            except Exception as e:
                 logger.error(f"Error updating Dashboard outcome for emp_no {emp_no}: {str(e)}")
                 # Decide if this error should stop the fitness assessment save

            # --- Create or Update Fitness Assessment ---
            fitness_test_instance, created = FitnessAssessment.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date, # Use today's date as the key
                defaults={
                    # Basic Tests
                    'tremors': data.get("tremors"), # Assumes frontend sends keys matching model fields
                    'romberg_test': data.get("romberg_test"),
                    'acrophobia': data.get("acrophobia"),
                    'trendelenberg_test': data.get("trendelenberg_test"),
                    # Job & Fitness
                    'job_nature': job_nature, # Use parsed list
                    'overall_fitness': data.get("overall_fitness"), # Use get with None default if you want optional
                    'conditional_fit_feilds': conditional_fit_fields, # Use parsed list, match model field name
                    # Examinations (NEW)
                    'general_examination': data.get("general_examination"),
                    'systematic_examination': data.get("systematic_examination"),
                    'eye_exam_result': data.get("eye_exam_result"),
                    'eye_exam_fit_status': data.get("eye_exam_fit_status"),
                    # Comments, Validity, Employer
                    'validity': data.get("validity") or None, # Handle empty string -> None for DateField
                    'comments': data.get("comments"),
                    'employer': data.get("employer"),
                    # Note: entry_date is NOT in defaults, it's a lookup key
                    # Note: updated_at is handled automatically by auto_now=True
                }
            )

            message = "Fitness test details added successfully" if created else "Fitness test details updated successfully"
            logger.info(f"{message} for emp_no: {emp_no} on date: {entry_date}")
            return JsonResponse({"message": message}, status=200 if created else 200) # 201 for created, 200 for updated is common

        except json.JSONDecodeError as e:
            logger.error(f"fitness_test failed: Invalid JSON data received. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Log the full traceback for unexpected errors
            logger.exception(f"fitness_test failed for emp_no {data.get('emp_no', 'UNKNOWN')}: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)

    logger.warning("fitness_test called with invalid request method: %s", request.method)
    return JsonResponse({"error": "Invalid request method. Only POST allowed."}, status=405)



def get_categories(request):
    """Retrieves review categories."""
    try:
        categories = list(ReviewCategory.objects.values("id", "name"))
        return JsonResponse({"categories": categories}, safe=False)
    except Exception as e:
        logger.exception("get_categories failed: An unexpected error occurred.")
        return JsonResponse({"error": str(e)}, status=500)

def get_reviews(request, status):
    """Retrieves reviews based on status."""
    try:
        reviews = list(Review.objects.filter(status=status).values("id", "pid", "name", "gender", "appointment_date", "category__name"))
        return JsonResponse({"reviews": reviews}, safe=False)
    except Exception as e:
        logger.exception("get_reviews failed: An unexpected error occurred.")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_review(request):
    """Adds a new review."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            category, created = ReviewCategory.objects.get_or_create(name=data["category"])
            review = Review.objects.create(
                category=category,
                pid=data["pid"],
                name=data["name"],
                gender=data["gender"],
                appointment_date=datetime.strptime(data["appointment_date"], "%Y-%m-%d").date(),
                status=data["status"]
            )
            logger.info(f"Review saved successfully with ID: {review.id}")
            return JsonResponse({"message": "Review added successfully", "id": review.id}, status=201)
        except json.JSONDecodeError as e:
            logger.error(f"add_review failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_review failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)
    logger.warning("add_review failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

# views.py (Django)
import json
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from .models import Member # Make sure to import your Member model
import logging
import bcrypt # Keep for add_member password generation
from datetime import datetime # Keep for add_member entry_date

logger = logging.getLogger(__name__)

# --- find_member_by_email (No changes needed) ---
@csrf_exempt
def find_member_by_email(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            return JsonResponse({'found': False, 'message': 'Email parameter is required'}, status=400)
        try:
            member = Member.objects.filter(email__iexact=email).first()
            if member:
                member_type = 'ohc' if member.employee_number else 'external'
                member_data = {
                    'id': member.id, # Important: Send the ID back!
                    'employee_number': member.employee_number,
                    'name': member.name,
                    'designation': member.designation,
                    'email': member.email,
                    'role': member.role.split(',') if member.role else [],
                    'doj': member.doj,
                    'date_exited': member.date_exited,
                    'job_nature': member.job_nature,
                    'phone_number': member.phone_number,
                    'hospital_name': member.hospital_name,
                    'aadhar': member.aadhar,
                    # Add 'do_access' if it exists in your model
                    # 'do_access': member.do_access,
                    'memberTypeDetermined': member_type
                }
                logger.info(f"Member found for email: {email} with ID: {member.id}")
                return JsonResponse({'found': True, 'member': member_data}, status=200)
            else:
                logger.info(f"Member not found for email: {email}")
                return JsonResponse({'found': False, 'message': 'Member not found'}, status=200)
        except Exception as e:
            logger.exception(f"Error finding member by email ({email}): {str(e)}")
            return JsonResponse({'found': False, 'message': 'An error occurred during search'}, status=500)
    else:
        return JsonResponse({'found': False, 'message': 'Only GET method is allowed'}, status=405)


# --- add_member (Minor adjustment maybe for logging) ---
@csrf_exempt
def add_member(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            member_type = data.get('memberType')

            # Basic validation: Check if required fields exist for the type
            required_fields = ['name', 'designation', 'email', 'role']
            if member_type == 'ohc':
                required_fields.extend(['employee_number', 'doj', 'phone_number'])
            elif member_type == 'external':
                 required_fields.extend(['hospital_name', 'aadhar', 'phone_number'])
            else:
                logger.warning("add_member failed: Invalid memberType received")
                return JsonResponse({'message': 'Invalid memberType'}, status=400)

            if not all(field in data and data[field] for field in required_fields):
                 logger.warning(f"add_member failed: Missing required fields for type {member_type}. Received: {data.keys()}")
                 return JsonResponse({'message': 'Missing required fields for the selected member type'}, status=400)

            # Check if email already exists before creating
            if Member.objects.filter(email__iexact=data.get('email')).exists():
                 logger.warning(f"add_member failed: Email '{data.get('email')}' already exists.")
                 return JsonResponse({'message': f"A member with email '{data.get('email')}' already exists."}, status=400)

            # Password generation (only for new members)
            password = "DefaultPassword123" # Default or generate securely
            if data.get('role'): # Use first role if available
                 password = data['role'][0] + "123"
            hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode('utf-8')

            role_str = ','.join(data.get('role', [])) # Ensure roles are joined correctly

            if member_type == 'ohc':
                member = Member.objects.create(
                    employee_number=data.get('employee_number'),
                    name=data.get('name'),
                    designation=data.get('designation'),
                    email=data.get('email'),
                    role=role_str,
                    doj=data.get('doj', None), # Handle potential null/empty dates
                    date_exited=data.get('date_exited') if data.get('date_exited') else None,
                    job_nature=data.get('job_nature'),
                    phone_number=data.get('phone_number'),
                    password=hashed_password,
                    entry_date=datetime.now().date()
                )
            elif member_type == 'external':
                member = Member.objects.create(
                    name=data.get('name'),
                    designation=data.get('designation'),
                    email=data.get('email'),
                    role=role_str,
                    hospital_name=data.get('hospital_name'),
                    aadhar=data.get('aadhar'),
                    phone_number=data.get('phone_number'),
                    date_exited=data.get('date_exited') if data.get('date_exited') else None,
                    job_nature=data.get('job_nature'),
                    # do_access=data.get('do_access') if data.get('do_access') else None, # Add if field exists
                    password=hashed_password,
                    entry_date=datetime.now().date()
                )

            logger.info(f"Member added successfully with ID: {member.id} and Type: {member_type}")
            return JsonResponse({'message': 'Member added successfully', 'memberId': member.id}, status=201)

        except json.JSONDecodeError as e:
            logger.error(f"add_member failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("add_member failed: An unexpected error occurred.")
            # Provide a more generic error message to the frontend for unexpected errors
            return JsonResponse({'message': 'An internal server error occurred.'}, status=500)
    else:
        logger.warning("add_member failed: Invalid request method. Only POST allowed.")
        return JsonResponse({'message': 'Only POST method is allowed'}, status=405)


# --- NEW: update_member View ---
@csrf_exempt
def update_member(request, member_id):
    if request.method == 'PUT': # Or PATCH if you allow partial updates
        try:
            member = Member.objects.get(pk=member_id)
        except Member.DoesNotExist:
            logger.warning(f"update_member failed: Member with ID {member_id} not found.")
            # raise Http404("Member not found") # Or return JsonResponse
            return JsonResponse({'message': 'Member not found'}, status=404)

        try:
            data = json.loads(request.body)
            member_type = data.get('memberType') # Get type from request data

            # Basic validation (similar to add, but maybe less strict if patching)
            required_fields = ['name', 'designation', 'role'] # Email usually not updated
            if member_type == 'ohc':
                required_fields.extend(['employee_number', 'doj', 'phone_number'])
            elif member_type == 'external':
                 required_fields.extend(['hospital_name', 'aadhar', 'phone_number'])
            else:
                logger.warning(f"update_member failed (ID: {member_id}): Invalid memberType received")
                return JsonResponse({'message': 'Invalid memberType'}, status=400)

            # Note: Email is usually NOT updated. If you need to update email,
            # add extra checks (e.g., ensure the new email isn't already taken by another user).
            # For simplicity, we'll skip updating email here. If you update it, remove readOnly from frontend.
            # member.email = data.get('email', member.email) # Example if updating email

            # Update fields based on type
            member.name = data.get('name', member.name)
            member.designation = data.get('designation', member.designation)
            member.role = ','.join(data.get('role', [])) # Update roles
            member.date_exited = data.get('date_exited') if data.get('date_exited') else None
            member.job_nature = data.get('job_nature', member.job_nature)
            member.phone_number = data.get('phone_number', member.phone_number)


            if member_type == 'ohc':
                # Ensure we are updating an OHC member (check existing type if necessary)
                if not member.employee_number:
                    logger.warning(f"update_member failed (ID: {member_id}): Type mismatch. Trying to update non-OHC as OHC.")
                    return JsonResponse({'message': 'Cannot change member type during update.'}, status=400)
                member.employee_number = data.get('employee_number', member.employee_number) # Usually not updated
                member.doj = data.get('doj', member.doj) # Maybe update DOJ? Depends on rules.
            elif member_type == 'external':
                 # Ensure we are updating an External member
                if member.employee_number:
                    logger.warning(f"update_member failed (ID: {member_id}): Type mismatch. Trying to update OHC as External.")
                    return JsonResponse({'message': 'Cannot change member type during update.'}, status=400)
                member.hospital_name = data.get('hospital_name', member.hospital_name)
                member.aadhar = data.get('aadhar', member.aadhar)
                # member.do_access = data.get('do_access') if data.get('do_access') else None # Update if exists


            # DO NOT UPDATE PASSWORD HERE without specific logic/request
            # Password updates should ideally be a separate process.

            member.save() # Save the changes to the database

            logger.info(f"Member updated successfully: ID {member_id}")
            return JsonResponse({'message': 'Member updated successfully'}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"update_member failed (ID: {member_id}): Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception(f"update_member failed (ID: {member_id}): An unexpected error occurred.")
            return JsonResponse({'message': 'An internal server error occurred during update.'}, status=500)
    else:
        logger.warning(f"update_member failed (ID: {member_id}): Invalid request method. Only PUT allowed.")
        return JsonResponse({'message': 'Only PUT method is allowed for updates'}, status=405)


# urls.py (Django)
# Make sure to add a path for this view
# from django.urls import path
# from . import views
#
# urlpatterns = [
#     # ... other urls
#     path('find_member_by_email/', views.find_member_by_email, name='find_member_by_email'),
#     path('members/add/', views.add_member, name='add_member'),
# ]

import os

ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt']

@csrf_exempt
def add_camp(request):
    """Adds a new event or camp."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            start_date_str = data.get("start_date")
            end_date_str = data.get("end_date")

            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError as e:
                logger.error(f"add_camp failed: Invalid date format. Error: {str(e)}")
                return JsonResponse({"error": f"Invalid date format: {e}"}, status=400)

            camp = eventsandcamps.objects.create(
                camp_name=data.get("camp_name"),
                hospital_name=data.get("hospital_name"),
                start_date=start_date,
                end_date=end_date,
                camp_details=data.get("camp_details"),
            )
            logger.info(f"Camp saved successfully with ID: {camp.id}")
            return JsonResponse({"message": "Camp added successfully!", "id": camp.id}, status=201)

        except json.JSONDecodeError as e:
            logger.error(f"add_camp failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("add_camp failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("add_camp failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

def get_camps(request):
    """Retrieves events and camps based on filters."""
    if request.method == "GET":
        try:
            search_term = request.GET.get("searchTerm", "")
            filter_status = request.GET.get("filterStatus", "")
            date_from_str = request.GET.get("dateFrom", None)
            date_to_str = request.GET.get("dateTo", None)
            today = date.today()

            camps = eventsandcamps.objects.all()

            if search_term:
                camps = camps.filter(camp_name__icontains=search_term)

            if filter_status == "Live":
                camps = camps.filter(
                    start_date__lte=today,
                    end_date__gte=today
                )
            elif filter_status:
                try:
                    camps = camps.filter(camp_type=filter_status)
                except ValueError as e:
                    logger.warning(f"get_camps failed: Invalid camp_type. Error: {str(e)}")
                    return JsonResponse({"error": "Invalid camp_type value"}, status=400)

            if date_from_str:
                try:
                    date_from = datetime.strptime(date_from_str, "%Y-%m-%d").date()
                    camps = camps.filter(start_date__gte=date_from)
                except ValueError as e:
                    logger.warning(f"get_camps failed: Invalid dateFrom format. Error: {str(e)}")
                    return JsonResponse({"error": "Invalid dateFrom format"}, status=400)

            if date_to_str:
                try:
                    date_to = datetime.strptime(date_to_str, "%Y-%m-%d").date()
                    camps = camps.filter(end_date__lte=date_to)
                except ValueError as e:
                    logger.warning(f"get_camps failed: Invalid dateTo format. Error: {str(e)}")
                    return JsonResponse({"error": "Invalid dateTo format"}, status=400)

            data = []
            for camp in camps:
                camp_data = {
                    'id': camp.id,
                    'camp_name': camp.camp_name,
                    'hospital_name': camp.hospital_name,
                    'start_date': str(camp.start_date),
                    'end_date': str(camp.end_date),
                    'camp_details': camp.camp_details,
                    'camp_type': camp.camp_type,
                    'report1': camp.report1.url if camp.report1 else None,
                    'report2': camp.report2.url if camp.report2 else None,
                    'photos': camp.photos.url if camp.photos else None,
                    'ppt': camp.ppt.url if camp.ppt else None,
                }
                data.append(camp_data)

            return JsonResponse(data, safe=False)

        except Exception as e:
            logger.exception("get_camps failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("get_camps failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def upload_files(request):
    """Uploads files associated with an event or camp."""
    if request.method == 'POST':
        try:
            camp_id = request.POST.get('campId')
            file_type = request.POST.get('fileType')

            try:
                camp = eventsandcamps.objects.get(pk=camp_id)
            except eventsandcamps.DoesNotExist as e:
                logger.warning(f"upload_files failed: Camp with ID {camp_id} not found. Error: {str(e)}")
                return JsonResponse({'error': 'Camp not found'}, status=404)

            file = request.FILES.get('files')

            if not file:
                logger.warning("upload_files failed: No file uploaded.")
                return JsonResponse({'error': 'No file uploaded'}, status=400)

            file_extension = file.name.split('.')[-1].lower()
            if file_extension not in ALLOWED_FILE_TYPES:
                logger.warning(f"upload_files failed: Invalid file type: {file_extension}")
                return JsonResponse({'error': 'Invalid file type'}, status=400)

            old_file = None
            file_url = None

            if file_type == 'report1':
                old_file = camp.report1
                camp.report1 = file
            elif file_type == 'report2':
                old_file = camp.report2
                camp.report2 = file
            elif file_type == 'photos':
                old_file = camp.photos
                camp.photos = file
            elif file_type == 'ppt':
                old_file = camp.ppt
                camp.ppt = file
            else:
                logger.warning("upload_files failed: Invalid file type.")
                return JsonResponse({'error': 'Invalid file type'}, status=400)

            camp.save()

            file_field = getattr(camp, file_type, None)
            if file_field:
                file_url = file_field.url
            else:
                file_url = None

            if old_file:
                try:
                    if default_storage.exists(old_file.name):
                        default_storage.delete(old_file.name)
                except Exception as e:
                    logger.error(f"upload_files failed: Error deleting old file: {str(e)}")

            logger.info(f"File uploaded successfully for camp ID: {camp_id}, file_type: {file_type}")
            return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url}, status=200)

        except Exception as e:
            logger.exception("upload_files failed: An unexpected error occurred.")

            if file and hasattr(file, 'name'):
                try:
                     if default_storage.exists(file.name):
                         default_storage.delete(file.name)
                except Exception as delete_error:
                     logger.error(f"upload_files failed: Error deleting problematic new file: {str(delete_error)}")

            return JsonResponse({'error': str(e)}, status=500)

    else:
        logger.warning("upload_files failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=400)

def download_file(request):
    """Downloads a file associated with an event or camp."""
    if request.method == "GET":
        try:
            camp_id = request.GET.get('campId')
            file_type = request.GET.get('fileType')

            camp = get_object_or_404(eventsandcamps, pk=camp_id)

            file_field = None
            if file_type == 'report1':
                file_field = camp.report1
            elif file_type == 'report2':
                file_field = camp.report2
            elif file_type == 'photos':
                file_field = camp.photos
            elif file_type == 'ppt':
                file_field = camp.ppt
            else:
                logger.warning("download_file failed: Invalid file type.")
                return JsonResponse({"error": "Invalid file type"}, status=400)

            if not file_field:
                logger.warning("download_file failed: File not found.")
                return JsonResponse({"error": "File not found"}, status=404)

            try:
                with open(file_field.path, 'rb') as f:
                    response = HttpResponse(f.read(), content_type="application/force-download")
                    response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_field.name)
                    return response

            except FileNotFoundError:
                logger.warning("download_file failed: File not found on server.")
                return JsonResponse({"error": "File not found on server"}, status=404)
            except Exception as e:
                logger.exception("download_file failed: An unexpected error occurred.")
                return JsonResponse({"error": "Error during download"}, status=500)

        except Exception as e:
            logger.exception("download_file failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("download_file failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def delete_file(request):
    """Deletes a file associated with an event or camp."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            camp_id = data.get('campId')
            file_type = data.get('fileType')

            camp = eventsandcamps.objects.get(pk=camp_id)

            file_field = None
            if file_type == 'report1':
                file_field = camp.report1
                camp.report1 = None
            elif file_type == 'report2':
                file_field = camp.report2
                camp.report2 = None
            elif file_type == 'photos':
                file_field = camp.photos
                camp.photos = None
            elif file_type == 'ppt':
                file_field = camp.ppt
                camp.ppt = None
            else:
                logger.warning("delete_file failed: Invalid file type.")
                return JsonResponse({'error': 'Invalid file type'}, status=400)

            if file_field:
                try:
                    default_storage.delete(file_field.name)
                except Exception as e:
                    logger.error(f"delete_file failed: Error deleting file from storage: {str(e)}")

            camp.save()
            logger.info(f"File deleted successfully for camp ID: {camp_id}, file_type: {file_type}")
            return JsonResponse({'message': 'File deleted successfully'}, status=200)

        except eventsandcamps.DoesNotExist as e:
            logger.warning(f"delete_file failed: Camp with ID {camp_id} not found. Error: {str(e)}")
            return JsonResponse({'error': 'Camp not found'}, status=404)
        except json.JSONDecodeError as e:
            logger.error(f"delete_file failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.exception("delete_file failed: An unexpected error occurred.")
            return JsonResponse({'error': str(e)}, status=500)

    logger.warning("delete_file failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Invalid request"}, status=400)

def get_mockdrills(request):
    """Retrieves all mock drill records."""
    if request.method == "GET":
        try:
            mock_drills = list(mockdrills.objects.values())
            return JsonResponse(mock_drills, safe=False)
        except Exception as e:
            logger.exception("get_mockdrills failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.warning("get_mockdrills failed: Invalid request method. Only GET allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def create_medical_history(request):
    """Creates or updates a medical history record."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            required_fields = ['emp_no',  'personalHistory', 'medicalData', 'femaleWorker',
                              'surgicalHistory', 'familyHistory', 'healthConditions', 
                              'allergyFields', 'allergyComments', 'childrenData', 'conditions']
            for field in required_fields:
                if field not in data:
                    logger.warning(f"create_medical_history failed: Missing required field: {field}")
                    return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

            emp_no = data['emp_no']
            entry_date = datetime.now().date()

            medical_history, created = models.MedicalHistory.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults={
                    'personal_history': data['personalHistory'],
                    'medical_data': data['medicalData'],
                    'female_worker': data['femaleWorker'],
                    'surgical_history': data['surgicalHistory'],
                    'family_history': data['familyHistory'],
                    'health_conditions': data['healthConditions'],
                    'allergy_fields': data['allergyFields'],
                    'allergy_comments': data['allergyComments'],
                    'children_data': data['childrenData'],
                    'conditions': data['conditions']
                }
            )

            message = "Medical history created successfully" if created else "Medical history updated successfully"

            logger.info(f"Medical history created/updated successfully for emp_no: {data['emp_no']}")
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"create_medical_history failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except ValidationError as e:
            logger.error(f"create_medical_history failed: Validation error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            logger.exception("create_medical_history failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
    else:
        logger.warning("create_medical_history failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

@csrf_exempt
def fetchVisitdata(request, emp_no):
    """Fetches visit data for a specific employee."""
    if request.method == "POST":
        try:
            data = list(models.Dashboard.objects.filter(emp_no=emp_no).values())
            return JsonResponse({"message": "Visit data fetched successfully", "data":data}, status=200)
        except Exception as e:
            logger.exception(f"fetchVisitdata failed for emp_no {emp_no}: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.warning("fetchVisitdata failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def fetchVisitdataAll(request):
    """Fetches all visit data."""
    if request.method == "POST":
        try:
            data = list(models.Dashboard.objects.values())
            return JsonResponse({"message": "Visit data fetched successfully", "data":data}, status=200)
        except Exception as e:
            logger.exception("fetchVisitdataAll failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.warning("fetchVisitdataAll failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def fetchFitnessData(request):
    """Fetches all fitness assessment data."""
    if request.method == "POST":
        try:
            data = list(models.FitnessAssessment.objects.values())
            return JsonResponse({"message": "Fitness data fetched successfully", "data":data}, status=200)
        except Exception as e:
            logger.exception("fetchFitnessData failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        logger.warning("fetchFitnessData failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

import logging
from datetime import datetime
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.utils.timezone import make_aware
from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.files import FieldFile # Import FieldFile
from . import models # Assuming your models are in models.py

logger = logging.getLogger(__name__) # Use Django's logging

import logging
from datetime import datetime
from django.http import JsonResponse
from django.forms.models import model_to_dict
# from django.utils.timezone import make_aware # Not needed if comparing dates only
from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.files import FieldFile # Import FieldFile
from . import models # Assuming your models are in models.py

logger = logging.getLogger(__name__)

# Helper function to serialize model instances, handling file/image fields
def serialize_model_instance(instance):
    """
    Converts a model instance to a dictionary, replacing FileField/ImageField
    objects with their URLs. Returns an empty dict if instance is None.
    """
    if instance is None:
        return {}

    data = model_to_dict(instance)
    for field_name, value in data.items():
        if isinstance(value, FieldFile):
            try:
                data[field_name] = value.url if value else None
            except Exception as e:
                 logger.error(f"Error getting URL for field {field_name}: {e}")
                 data[field_name] = None
        # Add handling for other non-serializable types if necessary
        # elif isinstance(value, (datetime.date, datetime.datetime)):
        #     data[field_name] = value.isoformat()

    return data

@csrf_exempt
def fetchVisitDataWithDate(request, emp_no, date):
    """Fetches visit data for a specific employee on a specific date."""
    if request.method == "GET":
        try:
            try:
                # Parse the date string into a date object
                target_date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError as e:
                logger.warning(f"fetchVisitDataWithDate failed: Invalid date format. Error: {str(e)}")
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            # --- CORRECTED FILTERS: Removed '__date' lookup ---
            employee_data = {
                "employee": serialize_model_instance(models.employee_details.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "dashboard": serialize_model_instance(models.Dashboard.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "vitals": serialize_model_instance(models.vitals.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "msphistory": serialize_model_instance(models.MedicalHistory.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "haematology": serialize_model_instance(models.heamatalogy.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "routinesugartests": serialize_model_instance(models.RoutineSugarTests.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "renalfunctiontests": serialize_model_instance(models.RenalFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "lipidprofile": serialize_model_instance(models.LipidProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "liverfunctiontest": serialize_model_instance(models.LiverFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "thyroidfunctiontest": serialize_model_instance(models.ThyroidFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "coagulationtest": serialize_model_instance(models.CoagulationTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "enzymesandcardiacprofile": serialize_model_instance(models.EnzymesCardiacProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "urineroutine": serialize_model_instance(models.UrineRoutineTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "serology": serialize_model_instance(models.SerologyTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "motion": serialize_model_instance(models.MotionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "menspack": serialize_model_instance(models.MensPack.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "opthalamicreport": serialize_model_instance(models.OphthalmicReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "usg": serialize_model_instance(models.USGReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "mri": serialize_model_instance(models.MRIReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "fitnessassessment": serialize_model_instance(models.FitnessAssessment.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "vaccination": serialize_model_instance(models.VaccinationRecord.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "significant_notes": serialize_model_instance(models.SignificantNotes.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "consultation": serialize_model_instance(models.Consultation.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                "prescription": serialize_model_instance(models.Prescription.objects.filter(emp_no=emp_no, entry_date__lte=target_date_obj).last()),
                # Add any other models here following the same pattern
            }

            return JsonResponse({"data": employee_data}, safe=False, status=200)

        except Exception as e:
            logger.exception("fetchVisitDataWithDate failed: An unexpected error occurred.")
            return JsonResponse({"error": "An internal server error occurred."}, status=500)

    logger.warning("fetchVisitDataWithDate failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)


# views.py (or wherever your add_consultation view is defined)
import json
import logging
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import models # Make sure this points to your models file

logger = logging.getLogger(__name__)

# Utility function (can be placed elsewhere and imported)
def parse_date(date_str):
    """Safely parses date strings (YYYY-MM-DD), returning None if invalid."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        logger.warning(f"Could not parse date: {date_str}")
        return None

@csrf_exempt
def add_consultation(request):
    """Adds or updates consultation data for a specific employee and date."""
    if request.method != 'POST':
        logger.warning("add_consultation failed: Invalid request method. Only POST allowed.")
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405) # Use 405 for Method Not Allowed

    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_consultation: {data}") # Log received data

        emp_no = data.get('emp_no')
        # Use current server date as the entry date for the consultation record
        entry_date = datetime.now().date()

        if not emp_no:
            logger.warning("add_consultation failed: Employee number (emp_no) is required")
            return JsonResponse({'status': 'error', 'message': 'Employee number (emp_no) is required'}, status=400)

        # Prepare defaults dictionary, getting data safely using .get()
        consultation_defaults = {
            'complaints': data.get('complaints'),
            'examination': data.get('examination'),
            'lexamination': data.get('lexamination'),
            'diagnosis': data.get('diagnosis'),
            'obsnotes': data.get('obsnotes'),
            'investigation_details': data.get('investigation_details'),
            'advice_details': data.get('advice_details'), # Get the new field (frontend needs to send this!)
            'case_type': data.get('case_type'),
            'illness_or_injury': data.get('illness_or_injury'), # Get the new field
            'other_case_details': data.get('other_case_details'),
            'referral': data.get('referral'),
            'hospital_name': data.get('hospital_name'),
            'speaciality': data.get('speaciality'), # Match frontend key 'speaciality'
            'doctor_name': data.get('doctor_name'),
            'follow_up_date': parse_date(data.get('follow_up_date')), # Use parse_date
            'submitted_by_doctor': data.get('submitted_by_doctor'),
            'submitted_by_nurse': data.get('submitted_by_nurse'),
            'notifiable_remarks': data.get('notifiable_remarks'),
            # emp_no and entry_date are used as identifiers, not defaults
        }

        # Filter out None values to avoid overwriting existing data with None
        # if a field is not sent in a particular update request.
        # Keep empty strings '' if sent, as they might indicate clearing a field.
        filtered_defaults = {k: v for k, v in consultation_defaults.items() if v is not None}

        consultation, created = models.Consultation.objects.update_or_create(
            emp_no=emp_no,
            entry_date=entry_date, # Use entry_date from BaseModel or added field
            defaults=filtered_defaults
        )

        message = "Consultation added successfully" if created else "Consultation updated successfully"
        logger.info(f"{message} for emp_no: {emp_no} on {entry_date}. ID: {consultation.id}")
        return JsonResponse({
            'status': 'success',
            'message': message,
            'consultation_id': consultation.id,
            'created': created # Optionally indicate if it was created or updated
            }, status=200) # Use 200 for successful update/create

    except json.JSONDecodeError as e:
        logger.error(f"add_consultation failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': f'Invalid JSON format: {str(e)}'}, status=400)
    except Exception as e:
        logger.exception(f"add_consultation failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        # Avoid leaking detailed errors in production
        return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.'}, status=500)

    def get_mockdrills(request):
        """Retrieves all mock drill records."""
        if request.method == "GET":
            try:
                mock_drills = list(mockdrills.objects.values())
                return JsonResponse(mock_drills, safe=False)
            except Exception as e:
                logger.exception("get_mockdrills failed: An unexpected error occurred.")
                return JsonResponse({"error": str(e)}, status=500)
        else:
            logger.warning("get_mockdrills failed: Invalid request method. Only GET allowed.")
            return JsonResponse({"error": "Invalid request method"}, status=405)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from . import models # Adjust import path as necessary
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def add_significant_notes(request):
    """Adds or updates significant notes for an employee on a specific date."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            logger.debug(f"Received data for add_significant_notes: {data}")

            emp_no = data.get('emp_no')
            # Determine entry_date - Use today's date as the default
            entry_date = datetime.now().date()
            # Optionally allow overriding date from payload if needed:
            # entry_date_str = data.get('entry_date')
            # if entry_date_str:
            #    try:
            #        entry_date = datetime.strptime(entry_date_str, '%Y-%m-%d').date()
            #    except (ValueError, TypeError):
            #        logger.warning(f"Invalid entry_date format received: {entry_date_str}. Using today's date.")
            #        entry_date = datetime.now().date()


            if not emp_no:
                logger.warning("add_significant_notes failed: Employee number is required")
                return JsonResponse({'status': 'error', 'message': 'Employee number is required'}, status=400)

            # Extract data using snake_case keys expected from the React component's handleSubmit
            healthsummary = data.get('healthsummary') # Note: key name matches payload
            remarks = data.get('remarks')
            communicable_disease = data.get('communicable_disease')
            incident_type = data.get('incident_type')
            incident = data.get('incident')
            illness_type = data.get('illness_type')
            visit_outcome = data.get('visit_outcome')

            outcome = models.Dashboard.objects.filter(emp_no=emp_no, entry_date=entry_date).first()
            if outcome:
                outcome.visitOutcome = healthsummary
                outcome.save()

            # Prepare defaults dictionary mapping payload keys to model field names
            note_defaults = {
                'healthsummary': healthsummary,           # model field: variable from payload
                'remarks': remarks,
                'communicable_disease': communicable_disease,
                'incident_type': incident_type,
                'incident': incident,
                'illness_type': illness_type,
                # Add any other fields like 'submitted_by' if needed
                # 'submitted_by': data.get('submitted_by'),
            }

            # Use update_or_create to either create a new note or update an existing one
            # for the same employee on the same date.
            significant_note, created = models.SignificantNotes.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date, # Assumes notes are per-day per-employee
                healthsummary=healthsummary,
                defaults=note_defaults
            )

            message = "Significant Notes added successfully" if created else "Significant Notes updated successfully"
            logger.info(f"SignificantNotes saved for emp_no {emp_no} on {entry_date}. Created: {created}. ID: {significant_note.id}")
            return JsonResponse({
                'status': 'success',
                'message': message,
                'significant_note_id': significant_note.id # Return the ID
            }, status=200 if not created else 201) # Use 201 for Created

        except json.JSONDecodeError as e:
            logger.error(f"add_significant_notes failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format: ' + str(e)}, status=400)
        except Exception as e:
            # Catch any other unexpected errors during processing or DB interaction
            logger.exception(f"add_significant_notes failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
            # Provide a generic error message to the client
            return JsonResponse({'status': 'error', 'message': 'An internal server error occurred.'}, status=500)

    else:
        # Handle incorrect HTTP methods (e.g., GET, PUT)
        logger.warning(f"add_significant_notes failed: Invalid request method ({request.method}). Only POST allowed.")
        return JsonResponse({'status': 'error', 'message': 'Invalid request method. Only POST is allowed.'}, status=405) # 405 Method Not Allowed



        
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Form17, Form38, Form39, Form40, Form27
from django.core.exceptions import ValidationError
import json
from django.views.decorators.csrf import csrf_exempt # only for testing purposes



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from datetime import datetime
from .models import Form17  # Ensure your model import is correct

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
    except ValueError:
        return None

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from datetime import datetime
from .models import Form17, Form38, Form39, Form40, Form27  # Ensure correct model imports

# Utility function for date parsing
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
    except ValueError:
        return None

# Utility function to convert age safely
def parse_age(age_str):
    return int(age_str) if age_str and age_str.isdigit() else None

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from datetime import datetime
from .models import Form17, Form38, Form39, Form40, Form27  # Ensure correct model imports

# Utility function for date parsing
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
    except ValueError:
        return None

# Utility function to safely convert age
def parse_age(age_str):
    return int(age_str) if age_str and age_str.isdigit() else None


### 🔹 Form 17 View
@csrf_exempt  # Only for testing; remove in production
def create_form17(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Form 17 Data:", data)
            entry_date = datetime.now().date()
            form = Form17(
                emp_no=data.get('emp_no'),
                dept=data.get('dept', ''),
                entry_date=entry_date,
                worksNumber=data.get('worksNumber', ''),
                workerName=data.get('workerName', ''),
                sex=data.get('sex', 'male'),
                dob=parse_date(data.get('dob')),
                age=parse_age(data.get('age')),
                employmentDate=parse_date(data.get('employmentDate')),
                leavingDate=parse_date(data.get('leavingDate')),
                reason=data.get('reason', ''),
                transferredTo=data.get('transferredTo', ''),
                jobNature=data.get('jobNature', ''),
                rawMaterial=data.get('rawMaterial', ''),
                medicalExamDate=parse_date(data.get('medicalExamDate')),
                medicalExamResult=data.get('medicalExamResult', ''),
                suspensionDetails=data.get('suspensionDetails', ''),
                recertifiedDate=parse_date(data.get('recertifiedDate')),
                unfitnessCertificate=data.get('unfitnessCertificate', ''),
                surgeonSignature=data.get('surgeonSignature', ''),
                fmoSignature=data.get('fmoSignature', '')
            )

            form.full_clean()  
            form.save()
            return JsonResponse({'message': 'Form 17 created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


### 🔹 Form 38 View
@csrf_exempt
def create_form38(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Form 38 Data:", data)
            entry_date = datetime.now().date()
            form = Form38(
                emp_no=data.get('emp_no'),
                entry_date=entry_date,
                serialNumber=data.get('serialNumber', ''),
                department=data.get('department', ''),
                workerName=data.get('workerName', ''),
                sex=data.get('sex', 'male'),
                age=parse_age(data.get('age')),
                jobNature=data.get('jobNature', ''),
                employmentDate=parse_date(data.get('employmentDate')),
                eyeExamDate=parse_date(data.get('eyeExamDate')),
                result=data.get('result', ''),
                opthamologistSignature=data.get('opthamologistSignature', ''),
                fmoSignature=data.get('fmoSignature', ''),
                remarks=data.get('remarks', '')
            )

            form.full_clean()
            form.save()
            return JsonResponse({'message': 'Form 38 created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


### 🔹 Form 39 View
@csrf_exempt
def create_form39(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Form 39 Data:", data)   
            entry_date = datetime.now().date()
            form = Form39(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
                entry_date=entry_date,
                workerName=data.get('workerName', ''),
                sex=data.get('sex', 'male'),
                age=parse_age(data.get('age')),
                proposedEmploymentDate=parse_date(data.get('proposedEmploymentDate')),
                jobOccupation=data.get('jobOccupation', ''),
                rawMaterialHandled=data.get('rawMaterialHandled', ''),
                medicalExamDate=parse_date(data.get('medicalExamDate')),
                medicalExamResult=data.get('medicalExamResult', ''),
                certifiedFit=data.get('certifiedFit', ''),
                certifyingSurgeonSignature=data.get('certifyingSurgeonSignature', ''),
                departmentSection=data.get('departmentSection', '')
            )

            form.full_clean()
            form.save()
            return JsonResponse({'message': 'Form 39 created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


### 🔹 Form 40 View
@csrf_exempt
def create_form40(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Form 40 Data:", data)
            entry_date = datetime.now().date()
            form = Form40(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
                entry_date=entry_date,
                dateOfEmployment=parse_date(data.get('dateOfEmployment')),
                workerName=data.get('workerName', ''),
                sex=data.get('sex', 'male'),
                age=parse_age(data.get('age')),
                sonWifeDaughterOf=data.get('sonWifeDaughterOf', ''),
                natureOfJob=data.get('natureOfJob', ''),
                urineResult=data.get('urineResult', ''),
                bloodResult=data.get('bloodResult', ''),
                fecesResult=data.get('fecesResult', ''),
                xrayResult=data.get('xrayResult', ''),
                otherExamResult=data.get('otherExamResult', ''),
                deworming=data.get('deworming', ''),
                typhoidVaccinationDate=parse_date(data.get('typhoidVaccinationDate')),
                signatureOfFMO=data.get('signatureOfFMO', ''),
                remarks=data.get('remarks', '')
            )

            form.full_clean()
            form.save()
            return JsonResponse({'message': 'Form 40 created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


### 🔹 Form 27 View
@csrf_exempt
def create_form27(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received Form 27 Data:", data)
            entry_date = datetime.now().date()
            form = Form27(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
                entry_date=entry_date,
                date=parse_date(data.get('date')),
                department=data.get('department', ''),
                nameOfWorks=data.get('nameOfWorks', ''),
                sex=data.get('sex', 'male'),
                dateOfBirth=parse_date(data.get('dateOfBirth')),
                age=parse_age(data.get('age')),
                nameOfTheFather=data.get('nameOfTheFather', ''),
                natureOfJobOrOccupation=data.get('natureOfJobOrOccupation', ''),
                signatureOfFMO=data.get('signatureOfFMO', ''),
                descriptiveMarks=data.get('descriptiveMarks', ''),
                signatureOfCertifyingSurgeon=data.get('signatureOfCertifyingSurgeon', '')
            )

            form.full_clean()
            form.save()
            return JsonResponse({'message': 'Form 27 created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as e:
            return JsonResponse({'error': 'Validation Error', 'details': e.message_dict}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)



@csrf_exempt
def add_stock(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Received Data:", data)

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            quantity = data.get("quantity")
            expiry_date = data.get("expiry_date")

            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity, expiry_date]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            expiry_date = datetime.strptime(expiry_date + "-01", "%Y-%m-%d").date()
            entry_date = date.today()

            # Check if brand_name and chemical_name exist in PharmacyMedicine
            medicine_entry = PharmacyMedicine.objects.filter(
                brand_name=brand_name,
                chemical_name=chemical_name,
                medicine_form=medicine_form
            ).first()

            if medicine_entry:
                # Check if the dose_volume exists for the same brand_name and chemical_name
                existing_dose = PharmacyMedicine.objects.filter(
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    medicine_form=medicine_form,
                    dose_volume=dose_volume
                ).exists()

                if not existing_dose:
                    # Add new entry with the different dose_volume
                    PharmacyMedicine.objects.create(
                        entry_date=entry_date,
                        medicine_form=medicine_form,
                        brand_name=brand_name,
                        chemical_name=chemical_name,
                        dose_volume=dose_volume
                    )
                    print(f"New dose entry added to PharmacyMedicine: {brand_name} - {chemical_name} - {dose_volume}")
            else:
                # If brand_name and chemical_name do not exist together, create a new entry
                PharmacyMedicine.objects.create(
                    entry_date=entry_date,
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume
                )
                print(f"New entry added to PharmacyMedicine: {brand_name} - {chemical_name} - {dose_volume}")

            # Add to PharmacyStock
            PharmacyStock.objects.create(
                entry_date=entry_date,
                medicine_form=medicine_form,
                brand_name=brand_name,
                chemical_name=chemical_name,
                dose_volume=dose_volume,
                quantity=quantity,
                expiry_date=expiry_date,
                total_quantity=quantity,  # Assuming this should be initialized with quantity
            )

            return JsonResponse({"message": "Stock added successfully"}, status=201)

        except Exception as e:
            print("Error Traceback:", traceback.format_exc())
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_brand_names(request):
    try:
        chemical_name = request.GET.get("chemical_name", "").strip()
        medicine_form = request.GET.get("medicine_form", "").strip()

        if not chemical_name or not medicine_form:
            return JsonResponse({"suggestions": []})

        suggestions = (
            PharmacyMedicine.objects.filter(chemical_name__iexact=chemical_name, medicine_form__iexact=medicine_form)
            .values_list("brand_name", flat=True)
            .distinct()
        )

        print(f"Brand Found for {chemical_name}, {medicine_form}: {suggestions}")
        return JsonResponse({"suggestions": list(suggestions)})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_dose_volume(request):
    try:
        brand_name = request.GET.get("brand_name", "").strip()
        chemical_name = request.GET.get("chemical_name", "").strip()
        medicine_form = request.GET.get("medicine_form", "").strip()

        if not brand_name or not chemical_name or not medicine_form:
            return JsonResponse({"suggestions": []})

        # Fetch dose volumes based on the given brand name, chemical name, and medicine form
        dose_suggestions = list(
            PharmacyMedicine.objects.filter(
                brand_name__iexact=brand_name, 
                chemical_name__iexact=chemical_name, 
                medicine_form__iexact=medicine_form
            )
            .values_list("dose_volume", flat=True)
            .distinct()
        )

        # Debugging: Print found doses
        print(f"Dose Volumes Found for {brand_name}, {chemical_name}, {medicine_form}: {dose_suggestions}")

        return JsonResponse({"suggestions": dose_suggestions})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_chemical_name_by_brand(request):
    try:
        brand_name = request.GET.get("brand_name", "").strip()
        medicine_form = request.GET.get("medicine_form", "").strip()

        if not brand_name or not medicine_form:
            return JsonResponse({"suggestions": []})

        # Get the chemical name associated with the brand and medicine form
        suggestions = (
            PharmacyMedicine.objects.filter(brand_name__iexact=brand_name, medicine_form__iexact=medicine_form)
            .values_list("chemical_name", flat=True)
            .distinct()
        )

        return JsonResponse({"suggestions": list(suggestions)})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def get_chemical_name(request):
    try:
        brand_name = request.GET.get("brand_name", "").strip()
        if not brand_name:
            return JsonResponse({"chemical_name": None})

        chemical_name = (
            PharmacyMedicine.objects.filter(brand_name__iexact=brand_name)
            .values_list("chemical_name", flat=True)
            .first()
        )

        return JsonResponse({"chemical_name": chemical_name if chemical_name else None})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


from django.db.models import Sum

@csrf_exempt
def get_current_stock(request):
    """
    Fetch current stock grouped by Medicine Form, Brand Name, Chemical Name, Dose/Volume, and Expiry Date.
    Combine quantities for duplicate entries.
    """
    try:
        stock_data = (
            PharmacyStock.objects
            .values("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
            .annotate(
                total_quantity_sum=Sum("total_quantity"),
                quantity_sum=Sum("quantity")
            )
            .order_by("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
        )

        data = [
            {
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


@csrf_exempt
def get_current_expiry(request):
    """
    Fetch medicines that will expire next month or are already expired.
    Move them to ExpiryRegister if not already moved.
    """
    try:
        today = datetime.today()
        current_month = today.month
        current_year = today.year
        next_month = current_month + 1 if current_month < 12 else 1
        next_year = current_year if current_month < 12 else current_year + 1

        # Get medicines expiring this month or next month, only for the current year
        expiry_medicines = PharmacyStock.objects.filter(
            expiry_date__year__lte=current_year,  # Ensure only past/current year medicines are considered
            expiry_date__month__lte=next_month  # Expiring this or next month
        )

        for medicine in expiry_medicines:
            # Move to ExpiryRegister if not already moved
            if not ExpiryRegister.objects.filter(
                brand_name=medicine.brand_name,
                chemical_name=medicine.chemical_name,
                dose_volume=medicine.dose_volume,
                expiry_date=medicine.expiry_date
            ).exists():
                ExpiryRegister.objects.create(
                    medicine_form=medicine.medicine_form,
                    brand_name=medicine.brand_name,
                    chemical_name=medicine.chemical_name,
                    dose_volume=medicine.dose_volume,
                    quantity=medicine.quantity,
                    expiry_date=medicine.expiry_date
                    # removed_date will automatically be set to NULL (null=True in model)
                )

            # Remove from PharmacyStock
            medicine.delete()

        # Fetch medicines from ExpiryRegister where removed_date is NULL (not removed)
        expired_data = ExpiryRegister.objects.filter(
            removed_date__isnull=True  # Only show items that haven't been removed yet
        ).values(
            "id", "medicine_form", "brand_name", "chemical_name", "dose_volume", "quantity", "expiry_date"
        )

        data = [
            {
                "id": entry["id"],
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": entry["expiry_date"].strftime("%b-%y"),
            }
            for entry in expired_data
        ]

        return JsonResponse({"expiry_stock": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def remove_expired_medicine(request):
    """
    Mark expired medicine as removed by setting removed_date.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            medicine_id = data.get("id")
            
            medicine = ExpiryRegister.objects.get(id=medicine_id)

            if medicine.removed_date is not None:
                return JsonResponse({"error": "Medicine already removed"}, status=400)

            # Set removed_date to today's date when medicine is removed
            medicine.removed_date = datetime.today()
            medicine.save()

            return JsonResponse({"message": "Medicine removed successfully", "success": True})

        except ExpiryRegister.DoesNotExist:
            return JsonResponse({"error": "Medicine not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def get_expiry_register(request):
    """
    Fetch medicines from Expiry Register where removed_date is NOT NULL.
    """
    try:
        expired_medicines = ExpiryRegister.objects.filter(
            removed_date__isnull=False  # Only show items that have been removed
        ).values(
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
                "expiry_date": entry["expiry_date"].strftime("%b-%y"),
                "removed_date": entry["removed_date"].strftime("%b-%y"),
            }
            for entry in expired_medicines
        ]

        return JsonResponse({"expiry_register": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_discarded_medicines(request):
    """
    Fetch discarded/damaged medicines.
    """
    try:
        discarded_medicines = DiscardedMedicine.objects.all().values(
            "id", "medicine_form", "brand_name", "chemical_name", "dose_volume", "quantity", "expiry_date", "reason", "discarded_date"
        )

        data = [
            {
                "id": entry["id"],
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": entry["expiry_date"].strftime("%b-%y"),
                "reason": entry["reason"],
            }
            for entry in discarded_medicines
        ]

        return JsonResponse({"discarded_medicines": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def add_discarded_medicine(request):
    """
    Add a new discarded/damaged medicine entry, and update PharmacyStock.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Check if a matching medicine exists in PharmacyStock
            matching_medicine = PharmacyStock.objects.filter(
                medicine_form=data.get("medicine_form"),
                brand_name=data.get("brand_name"),
                chemical_name=data.get("chemical_name"),
                dose_volume=data.get("dose_volume"),
                expiry_date=data.get("expiry_date")
            ).first()

            if not matching_medicine:
                return JsonResponse({"error": "Matching medicine not found in PharmacyStock."}, status=400)

            # Check if sufficient quantity is available in PharmacyStock
            if matching_medicine.quantity < int(data.get("quantity")):
                return JsonResponse({"error": "Not enough quantity available in PharmacyStock."}, status=400)

            # Reduce quantity in PharmacyStock
            matching_medicine.quantity -= int(data.get("quantity"))
            matching_medicine.save()

            # Add to DiscardedMedicine
            DiscardedMedicine.objects.create(
                medicine_form=data.get("medicine_form"),
                brand_name=data.get("brand_name"),
                chemical_name=data.get("chemical_name"),
                dose_volume=data.get("dose_volume"),
                quantity=data.get("quantity"),
                expiry_date=datetime.strptime(data.get("expiry_date"), "%Y-%m-%d").date(),
                reason=data.get("reason"),
            )

            return JsonResponse({"message": "Discarded medicine added successfully", "success": True})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)




from django.db import transaction 

@csrf_exempt
def get_ward_consumables(request):
    """
    Fetch ward consumables.
    (Modified slightly for consistency and better date handling)
    """
    try:
        # Order by entry_date descending to show recent ones first
        ward_consumables = WardConsumables.objects.all().order_by('-entry_date').values(
            "id", "entry_date", "medicine_form", "brand_name", "chemical_name",
            "dose_volume", "quantity", "expiry_date", "consumed_date"
        )

        data = []
        for entry in ward_consumables:
            # Safely format dates, handling potential None values if fields allow null
            expiry_date_str = entry["expiry_date"].strftime("%b-%y") if entry.get("expiry_date") else None
            consumed_date_str = entry["consumed_date"].strftime("%Y-%m-%d") if entry.get("consumed_date") else None
            entry_date_str = entry["entry_date"].strftime("%Y-%m-%d %H:%M:%S") if entry.get("entry_date") else None # Or just date if preferred

            data.append({
                "id": entry["id"],
                # Decide if you want full datetime or just date for entry_date
                "entry_date": entry_date_str,
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": expiry_date_str,
                "consumed_date": consumed_date_str,
            })

        # It's generally better practice to return the list under a key
        return JsonResponse({"ward_consumables": data}, safe=False)

    except Exception as e:
        # Log the exception for debugging
        print(f"Error in get_ward_consumables: {e}")
        return JsonResponse({"error": "An internal server error occurred while fetching consumables.", "detail": str(e)}, status=500)

@csrf_exempt
def add_ward_consumable(request):
    """
    Add a new ward consumable entry, and update PharmacyStock.
    Mirrors the logic of add_discarded_medicine.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date = data.get("expiry_date") # Expecting YYYY-MM-DD string
            consumed_date = data.get("consumed_date") # Expecting YYYY-MM-DD string
            try:
                # Parse expiry_date as a month-year string
                expiry_date_obj = datetime.strptime(expiry_date, "%Y-%m")
                expiry_date = expiry_date_obj.replace(day=1).date()  # Set day to 1st
            except ValueError:
                return JsonResponse({"error": "Invalid expiry date format. Expected YYYY-MM.", "success": False}, status=400)


            try:
                quantity_to_consume = int(data.get("quantity", 0))
            except (ValueError, TypeError):
                 return JsonResponse({"error": "Invalid quantity provided.", "success": False}, status=400)
            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity_to_consume > 0, consumed_date]):
                 return JsonResponse({"error": "Missing required consumable information.", "success": False}, status=400)

            
            with transaction.atomic():
                matching_medicine = PharmacyStock.objects.filter(
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    expiry_date=expiry_date # Match the exact expiry date
                ).first()

                if not matching_medicine:
                    return JsonResponse({"error": "Matching medicine batch not found in PharmacyStock.", "success": False}, status=404) # 404 Not Found is appropriate

                # Check if sufficient quantity is available in PharmacyStock
                if matching_medicine.quantity < quantity_to_consume:
                    return JsonResponse({
                        "error": f"Not enough quantity available in PharmacyStock. Available: {matching_medicine.quantity}, Requested: {quantity_to_consume}.",
                        "success": False
                    }, status=400) # 400 Bad Request is appropriate

                # Reduce quantity in PharmacyStock
                matching_medicine.quantity -= quantity_to_consume
                # Optional: Remove the stock record if quantity becomes zero
                if matching_medicine.quantity <= 0:
                    matching_medicine.delete()
                else:
                    matching_medicine.save()

                WardConsumables.objects.create(
                    entry_date=timezone.now(), # Set entry date to now
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    quantity=quantity_to_consume,
                    expiry_date=expiry_date,
                    consumed_date=consumed_date, # Use date sent from frontend
                )

            # If transaction completes without error
            return JsonResponse({"message": "Ward consumable added and stock updated successfully", "success": True})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format.", "success": False}, status=400)
        except Exception as e:
            # Log the exception for debugging
            print(f"Error in add_ward_consumable: {e}")
            # Provide a more user-friendly generic error
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid request method. Only POST is allowed.", "success": False}, status=405) # 405 Method Not Allowed



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
        calibrated_instruments = InstrumentCalibration.objects.filter(
            calibration_status=True
        ).order_by("-calibration_date")

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
            next_due_date = data.get("next_due_date")

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
            next_due_date=data["next_due_date"],
            calibration_status=bool(int(data["calibration_status"]))
        )

        return JsonResponse({"message": "Instrument added successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def add_prescription(request):
    """Adds or updates prescription data based on emp_no and current date.""" # Updated docstring
    if request.method == "POST":
        data = None # Initialize for broader scope in exception logging
        try:
            data = json.loads(request.body.decode('utf-8'))

            emp_no = data.get('emp_no')
            name = data.get('name')

            # --- Keep existing validations ---
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
            # --- End Validations ---

            # --- Extract other data ---
            tablets = data.get('tablets', [])
            syrups = data.get('syrups', [])
            injections = data.get('injections', [])
            creams = data.get('creams', [])
            drops = data.get('drops', [])
            fluids = data.get('fluids', [])
            lotions = data.get('lotions', [])
            respules = data.get('respules', [])
            suture_procedure = data.get('suture_procedure', [])
            dressing = data.get('dressing', [])
            powder = data.get('powder', [])
            others = data.get('others', [])
            nurse_notes = data.get('nurse_notes')
            # Get the issued_status from the request, default to 0 if not provided
            # IMPORTANT: Make sure your frontend sends 'issued_status' when updating/issuing
            issued_status = data.get('issued_status', 0)
            # --- End Data Extraction ---

            # --- *** CORRECTED DATE FOR LOOKUP *** ---
            # Use only the DATE part for matching today's prescription
            current_entry_date = timezone.now().date()
            # --- *** END CORRECTION *** ---

            # --- Use update_or_create for atomicity ---
            prescription, created = Prescription.objects.update_or_create(
                emp_no=emp_no,
                entry_date=current_entry_date,  # Use DATE object for matching
                defaults={
                    'name': name,
                    'tablets': tablets,
                    'syrups': syrups,
                    'injections': injections,
                    'creams': creams,
                    'drops': drops,
                    'fluids': fluids,
                    'lotions': lotions,
                    'respules': respules,
                    'suture_procedure': suture_procedure,
                    'dressing': dressing,
                    'powder': powder,
                    'others': others,
                    'submitted_by': submitted_by,
                    'issued_by': issued_by, # This might be updated during the 'issue' step
                    'nurse_notes': nurse_notes,
                    'issued_status': issued_status # Use status from request payload
                    # entry_date is handled by the lookup key, don't put it in defaults
                }
            )

            # print("DROPS : ", prescription.drops) # Debugging

            message = "Prescription details added successfully" if created else "Prescription details updated successfully"
            logger.info(f"{message} for emp_no {emp_no} on {current_entry_date}. ID: {prescription.id}")
            # Include 'created' status in response, useful for frontend logic
            return JsonResponse({
                "message": message,
                "prescription_id": prescription.id,
                "id": prescription.id,
                "created": created # Send back whether it was created or updated
            }, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error("add_prescription failed: Invalid JSON data.")
            return JsonResponse({"error": "Invalid JSON data in request body"}, status=400)
        except Exception as e:
            emp_no_for_log = data.get('emp_no', 'N/A') if data else 'N/A (data parsing failed)'
            logger.exception(f"add_prescription failed for emp_no '{emp_no_for_log}': An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    else:
        logger.warning("add_prescription failed: Invalid request method. Only POST allowed.")
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST' # Good practice to include Allow header
        return response

@csrf_exempt
def view_prescriptions(request):
    
    if request.method == 'GET':
        prescriptions = Prescription.objects.all()
        data = []
        for prescription in prescriptions:
            print(prescription.issued_status)
            data.append({
                'id': prescription.id,
                'emp_no': prescription.emp_no,
                'name': prescription.name,  # Concatenate names
                'entry_date': prescription.entry_date.strftime('%Y-%m-%d'), # Format date,
                'issued_status': prescription.issued_status,  # Replace the status for view
                'prescription':{
                    'id': prescription.id,
                    'emp_no': prescription.emp_no,
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

        print(data)

        return JsonResponse({'prescriptions': data})
    else:
        return JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)


# views.py

from django.shortcuts import get_object_or_404 # Import this

# ... other imports ...

@csrf_exempt
def view_prescriptions_emp(request, emp_no):
    if request.method == 'GET':
        # ... your existing GET logic ...
        # (Consider simplifying the response as suggested before)
        pass # Placeholder for GET logic

    elif request.method == 'PUT':
        print(f"PUT request received for emp_no: {emp_no}") # Log start
        try:
            data = json.loads(request.body.decode('utf-8'))

            # --- Fetch the SPECIFIC instance to update ---
            # Option A: Update the LATEST PENDING prescription
            # prescription_instance = Prescription.objects.filter(
            #     emp_no=emp_no,
            #     issued_status=0
            # ).order_by('-entry_date', '-id').first() # Get latest by date then ID

            # Option B: Update based on ID sent from frontend (requires frontend change)
            prescription_id = data.get('id') or data.get('prescription_id')
            if not prescription_id:
                 return JsonResponse({'error': 'Missing prescription ID in PUT request data'}, status=400)
            print(f"Attempting to update prescription with ID: {prescription_id}")
            # Use get_object_or_404 for cleaner handling of not found
            prescription_instance = get_object_or_404(Prescription, pk=prescription_id, emp_no=emp_no) # Ensure it matches emp_no too

            # --- Now update the fetched instance ---
            print(f"Found Prescription ID: {prescription_instance.id} for update.")

            # Update fields using data.get()
            prescription_instance.tablets = data.get('tablets', prescription_instance.tablets)
            prescription_instance.syrups = data.get('syrups', prescription_instance.syrups)
            prescription_instance.injections = data.get('injections', prescription_instance.injections)
            prescription_instance.creams = data.get('creams', prescription_instance.creams)
            prescription_instance.drops = data.get('drops', prescription_instance.drops)
            prescription_instance.fluids = data.get('fluids', prescription_instance.fluids)
            prescription_instance.lotions = data.get('lotions', prescription_instance.lotions)
            prescription_instance.respules = data.get('respules', prescription_instance.respules)
            prescription_instance.dressing = data.get('dressing', prescription_instance.dressing)
            prescription_instance.powder = data.get('powder', prescription_instance.powder)
            prescription_instance.suture_procedure = data.get('suture_procedure', prescription_instance.suture_procedure)
            prescription_instance.others = data.get('others', prescription_instance.others)

            # Update meta fields - BE CAREFUL what you allow to be updated here
            # prescription_instance.name = data.get('name', prescription_instance.name) # Should name be updatable here?
            # prescription_instance.submitted_by = data.get('submitted_by', prescription_instance.submitted_by) # Probably not updatable on issue
            prescription_instance.issued_by = data.get('issued_by', prescription_instance.issued_by) # This makes sense to update
            prescription_instance.nurse_notes = data.get('nurse_notes', prescription_instance.nurse_notes) # This makes sense to update

            # Mark as issued
            prescription_instance.issued_status = 1

            # Save the single updated object
            prescription_instance.save()
            print(f"Successfully saved Prescription ID: {prescription_instance.id}")

            return JsonResponse({'message': f'Prescription {prescription_instance.id} updated/issued successfully'})

        except Prescription.DoesNotExist: # Caught by get_object_or_404 if using Option B
             print(f"Prescription not found for ID: {prescription_id} or emp_no: {emp_no}")
             return JsonResponse({'error': 'Prescription not found'}, status=404)
        except json.JSONDecodeError:
            print("Invalid JSON received in PUT request")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            # Log the exception for better debugging
            import logging
            logger = logging.getLogger(_name_)
            logger.exception(f"Error updating prescription for emp_no {emp_no} (PUT): {e}")
            print(f"Unexpected error during PUT: {e}")
            return JsonResponse({'error': 'An unexpected error occurred.', 'detail': str(e)}, status=500)
    else:
        response = JsonResponse({'error': 'Invalid request method. Only GET or PUT allowed.'}, status=405)
        response['Allow'] = 'GET, PUT'
        return response

@csrf_exempt # Keep if necessary, but consider session/token auth
def view_prescription_by_id(request, prescription_id):
    """
    Retrieves a single prescription by its specific ID.
    """
    if request.method != 'GET':
        logger.warning(f"view_prescription_by_id failed for ID {prescription_id}: Invalid request method.")
        response = JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)
        response['Allow'] = 'GET'
        return response

    try:
        # Use get_object_or_404 for cleaner handling of DoesNotExist
        prescription = get_object_or_404(Prescription, pk=prescription_id)

        # Serialize the single object (flattened)
        prescription_data = {
            'id': prescription.id,
            'emp_no': prescription.emp_no,
            'name': prescription.name, # Employee who received it
            'entry_date': prescription.entry_date.strftime('%Y-%m-%d %H:%M:%S'), # Or just date
            'issued_status': prescription.issued_status,
            'tablets': prescription.tablets,
            'syrups': prescription.syrups,
            'injections': prescription.injections,
            'creams': prescription.creams,
            'drops': prescription.drops,
            'fluids': prescription.fluids,
            'lotions': prescription.lotions,
            'powder': prescription.powder,
            'respules': prescription.respules,
            'suture_procedure': prescription.suture_procedure,
            'others': prescription.others,
            'dressing': prescription.dressing,
            'submitted_by': prescription.submitted_by, # Person who submitted request
            'issued_by': prescription.issued_by,       # Person who marked as issued (Pharmacist/Nurse?)
            'nurse_notes': prescription.nurse_notes,
        }
        return JsonResponse(prescription_data)

    except Exception as e:
        logger.exception(f"view_prescription_by_id failed for ID {prescription_id}: An unexpected error occurred.")
        return JsonResponse({'error': 'Internal Server Error', 'detail': str(e)}, status=500)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Prescription

@csrf_exempt
def update_prescription(request, prescription_id):  # Note the prescription_id argument
    if request.method =='PUT':
        try:
            prescription = Prescription.objects.get(pk=prescription_id) # use it to find object!
            data = json.loads(request.body)

            # Update fields based on data
            prescription.tablets = data.get('tablets', prescription.tablets)
            prescription.syrups = data.get('syrups', prescription.syrups)
            prescription.injections = data.get('injections', prescription.injections)
            prescription.creams = data.get('creams', prescription.creams)
            prescription.drops = data.get('drops', prescription.drops)
            prescription.fluids = data.get('fluids', prescription.fluids)
            prescription.others = data.get('others', prescription.others)
            prescription.lotions = data.get('lotions', prescription.lotions)
            prescription.respules = data.get('respules', prescription.respules)
            prescription.dressing = data.get('dressing', prescription.dressing)
            prescription.powder = data.get('powder', prescription.powder)
            prescription.suture_procedure = data.get('suture_procedure', prescription.suture_procedure)
            # ... other fields ...

            prescription.save()
            return JsonResponse({'message': 'Prescription updated successfully'})

        except Prescription.DoesNotExist:
            return JsonResponse({'error': 'Prescription not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    else:
        return JsonResponse({'error': 'Only PUT requests are allowed'}, status=405)


@csrf_exempt
def get_notes(request, emp_no):
    if request.method == 'POST':
        notes = list(models.SignificantNotes.objects.filter(emp_no=emp_no).values())
        emp_status = list(models.employee_details.objects.values('employee_status', 'since_date', 'transfer_details', 'other_reason_details').distinct())
        print(notes)
        return JsonResponse({'data': notes, 'status': emp_status})
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)


@csrf_exempt
def get_notes_all(request):
    if request.method == 'POST':
        notes = list(models.SignificantNotes.objects.all().values())
        consultation = list(models.Consultation.objects.all().values())
        print(notes)
        return JsonResponse({'data': notes, 'consultation': consultation})
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)
    

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from . import models

@csrf_exempt
def update_employee_status(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        employee_status = data.get('employee_status')
        date_since = data.get('date_since')
        emp_no = data.get('emp_no')
        transfer_details = data.get('transfer_details' ,'')
        other_reason_details = data.get('other_reason_details', '')

        if employee_status and date_since and emp_no:
            last_entry = models.employee_details.objects.filter(emp_no=emp_no).order_by('-entry_date').first()

            if last_entry:
                # Create a copy of the last entry and update fields
                last_entry.pk = None  # This makes Django treat it as a new object
                last_entry.employee_status = employee_status
                last_entry.since_date = date_since
                last_entry.transfer_details = transfer_details
                last_entry.other_reason_details = other_reason_details
                last_entry.save()

                return JsonResponse({'success': True, 'message': 'New status entry created successfully.'})
            else:
                return JsonResponse({'success': False, 'message': 'No matching employee found.'})
        else:
            return JsonResponse({'success': False, 'message': 'Please provide emp_no, employee_status and date_since.'})
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)



@csrf_exempt
def delete_member(request, member_id):
    if request.method == 'POST':
        member = models.member.objects.get(id=member_id)
        if member:
            member.delete()
            return JsonResponse({'success': True, 'message': 'Member deleted successfully.'})
        else:
            return JsonResponse({'success': False, 'message': 'No matching member found.'})
    else:
        return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)