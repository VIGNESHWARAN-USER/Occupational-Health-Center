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

@csrf_exempt
def login(request):
    """Handles user login and authentication."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                logger.warning("Login failed: Missing username or password.")
                return JsonResponse({"message": "Username and password are required."}, status=400)

            user = authenticate(username=username, password=password)
            if user is not None:
                logger.info(f"User {username} logged in successfully.")
                return JsonResponse({
                    "username": user.username,
                    "accessLevel": user.username,  # Modify based on roles later
                    "message": "Login successful!"
                }, status=200)
            else:
                logger.warning(f"Login failed: User {username} not found or invalid credentials.")
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
                .values("emp_no", "profilepic")
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
                                        # Special handling for JSONField, especially nested structures
                                        if field.name == "normal_doses" or field.name == "booster_doses":
                                            default_structure[field.name] = {"dates": [], "dose_names": []}
                                        elif field.name == "surgical_history":
                                            default_structure[field.name] = {"comments":"" ,"children": []}
                                        elif field.name == "vaccination":
                                            default_structure[field.name] = {"vaccination": []}
                                        elif field.name == "job_nature":
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

@csrf_exempt
def addEntries(request):
    """Adds or updates an employee_details record and updates Dashboard records for a visit entry."""
    if request.method != "POST":
        logger.warning("addEntries failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for addEntries: {data}")

        emp_no = data.get('emp_no')
        if not emp_no:
            logger.warning("addEntries failed: Employee number is required")
            return JsonResponse({"error": "Employee number is required"}, status=400)

        entry_date = datetime.now().date()  # Use current date for the entry
        extra_data = data.get('extraData', {})
        dashboard_data = data.get('formDataDashboard', {})
        employee_data = data.get('formData', {})  # Basic details payload
        print(extra_data)
        register = dashboard_data.get('register', '')  # Get register value

        # Prepare defaults for the employee_details model
        employee_defaults = {
            'name': employee_data.get('name', ''),
            'dob': parse_date(employee_data.get('dob')),
            'sex': employee_data.get('sex', ''),
            'aadhar': employee_data.get('aadhar', ''),
            'role': employee_data.get('role', ''),
            'bloodgrp': employee_data.get('bloodgrp', ''),
            'identification_marks1': employee_data.get('identification_marks1', ''),
            'identification_marks2': employee_data.get('identification_marks2', ''),
            'marital_status': employee_data.get('marital_status', ''),
            'employer': employee_data.get('employer', ''),
            'designation': employee_data.get('designation', ''),
            'department': employee_data.get('department', ''),
            'job_nature': employee_data.get('job_nature', ''),
            'doj': parse_date(employee_data.get('doj')),
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
            'permanent_nationality': employee_data.get('permanent_nationality', ''),
            'residential_address': employee_data.get('residential_address', ''),
            'residential_area': employee_data.get('residential_area', ''),
            'residential_state': employee_data.get('residential_state', ''),
            'residential_nationality': employee_data.get('residential_nationality', ''),
            'other_site_id': employee_data.get('other_site_id', ''),
            'organization': employee_data.get('organization', ''),
            'addressOrganization': employee_data.get('addressOrganization', ''),
            'visiting_department': employee_data.get('visiting_department', ''),
            'visiting_date_from': parse_date(employee_data.get('visiting_date_from')),
            'stay_in_guest_house': employee_data.get('stay_in_guest_house', ''),
            'visiting_purpose': employee_data.get('visiting_purpose', ''),
            'type': dashboard_data.get('category', 'Employee'),
            'type_of_visit': dashboard_data.get('typeofVisit', ''),
            'register': register,
            'purpose': dashboard_data.get('purpose', ''),
            'year': extra_data.get('year', ''),
            'batch': extra_data.get('batch', ''),
            'hospitalName': extra_data.get('hospitalName', ''),
            'campName': extra_data.get('campName', ''),
            'contractName': extra_data.get('contractName', ''),
            'prevcontractName': extra_data.get('prevcontractName', ''),
            'old_emp_no': extra_data.get('old_emp_no', ''),
            'reason': extra_data.get('purpose', ''),
            'status': extra_data.get('status', ''),
        }
        print(employee_defaults)

        # Update or create the employee entry
        employee_entry, created = models.employee_details.objects.update_or_create(
            emp_no=emp_no,
            entry_date=entry_date,
            defaults=employee_defaults
        )

        # Prepare data for the Dashboard model
        dashboard_defaults = {
            'type': employee_defaults['type'],
            'type_of_visit': employee_defaults['type_of_visit'],
            'register': employee_defaults['register'],
            'purpose': employee_defaults['purpose'],
            'date': entry_date,
            'year': employee_defaults['year'],
            'batch': employee_defaults['batch'],
            'hospitalName': employee_defaults['hospitalName'],
            'campName': employee_defaults['campName'],
            'contractName': employee_defaults['contractName'],
            'prevcontractName': employee_defaults['prevcontractName'],
            'old_emp_no': employee_defaults['old_emp_no'],
            'reason': employee_defaults['reason'],
            'status': employee_defaults['status'],
        }

        # Update or create the dashboard entry
        dashboard_entry, dashboard_created = models.Dashboard.objects.update_or_create(
            emp_no=emp_no,
            date=entry_date,
            defaults=dashboard_defaults
        )

        message = "Visit Entry added and Dashboard updated successfully" if created else "Visit Entry and Dashboard updated successfully"
        logger.info(f"addEntries successful for emp_no: {emp_no} on {entry_date}. Created: {created}, Dashboard Created: {dashboard_created}")
        return JsonResponse({"message": message}, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"addEntries failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        logger.exception(f"addEntries failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)

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

# ... (imports remain the same: json, JsonResponse, csrf_exempt, datetime, models, parse_date, logging)

@csrf_exempt
def add_basic_details(request):
    """Adds or updates basic employee details for a specific date."""
    if request.method != "POST":
        logger.warning("add_basic_details failed: Invalid request method. Only POST allowed.")
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        logger.debug(f"Received data for add_basic_details: {data}")

        emp_no = data.get('emp_no')
        if not emp_no:
            logger.warning("add_basic_details failed: Employee number is required")
            return JsonResponse({"error": "Employee number is required"}, status=400)

        # Decide if basic details update should also be tied to date or update the single canonical record
        entry_date = datetime.now().date() # Creates/updates today's record
        # OR: If you want to update THE single record for the employee, don't use entry_date as identifier below.

        basic_defaults = {
            'name': data.get('name', ''),
            'dob': parse_date(data.get('dob')),
            'sex': data.get('sex', ''),
            'aadhar': data.get('aadhar', ''),
            'role': data.get('role', ''), # Employee/Contractor/Visitor role
            'bloodgrp': data.get('bloodgrp', ''),
            'identification_marks1': data.get('identification_marks1', ''),
            'identification_marks2': data.get('identification_marks2', ''),
            'marital_status': data.get('marital_status', ''),
            'employer': data.get('employer', ''),
            'designation': data.get('designation', ''),
            'department': data.get('department', ''),
            'job_nature': data.get('job_nature', ''),
            'doj': parse_date(data.get('doj')),
            'moj': data.get('moj', ''), # Corrected from parse_date
            'phone_Personal': data.get('phone_Personal', ''),
            'mail_id_Personal': data.get('mail_id_Personal', ''),
            'emergency_contact_person': data.get('emergency_contact_person', ''),
            'phone_Office': data.get('phone_Office', ''),
            'mail_id_Office': data.get('mail_id_Office', ''),
            'emergency_contact_relation': data.get('emergency_contact_relation', ''),
            'mail_id_Emergency_Contact_Person': data.get('mail_id_Emergency_Contact_Person', ''),
            'emergency_contact_phone': data.get('emergency_contact_phone', ''),
            'location': data.get('location', ''),

            # New Address Fields
            'permanent_address': data.get('permanent_address', ''),
            'permanent_area': data.get('permanent_area', ''),
            'permanent_state': data.get('permanent_state', ''),
            'permanent_nationality': data.get('permanent_nationality', ''),
            'residential_address': data.get('residential_address', ''),
            'residential_area': data.get('residential_area', ''),
            'residential_state': data.get('residential_state', ''),
            'residential_nationality': data.get('residential_nationality', ''),

            # Visitor Fields (if applicable, sent with basic details)
            'other_site_id': data.get('other_site_id', ''),
            'organization': data.get('organization', ''),
            'addressOrganization': data.get('addressOrganization', ''),
            'visiting_department': data.get('visiting_department', ''),
            'visiting_date_from': parse_date(data.get('visiting_date_from')),
            'stay_in_guest_house': data.get('stay_in_guest_house', ''),
            'visiting_purpose': data.get('visiting_purpose', ''), # Purpose specific to visitor form

            # Set the 'type' based on role if not already set or if basic details update should set it
            'type': data.get('role', 'Employee'), # Defaulting to Employee if role is missing

            # We typically don't set visit-specific fields like register, type_of_visit, purpose here
            # unless the basic details save implies a default visit type.
        }

        # Handle potential profile image update if sent via this endpoint
        # profile_image_b64 = data.get('profileImage')
        # if profile_image_b64:
        #    # Logic to decode and save to basic_defaults['profilepic']
        #    pass


        # Create or update the record
        employee, created = models.employee_details.objects.update_or_create(
            emp_no=emp_no,
            # Use entry_date here if basic details updates are also per-date snapshots
            entry_date=entry_date,
            # If you want only ONE record per employee updated by this view, remove entry_date:
            # emp_no=emp_no,
            defaults=basic_defaults
        )

        message = "Basic Details added successfully" if created else "Basic Details updated successfully"
        logger.info(f"add_basic_details successful for emp_no: {emp_no} on {entry_date}. Created: {created}")
        return JsonResponse({"message": message}, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"add_basic_details failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except KeyError as e:
        logger.error(f"add_basic_details failed: Missing key in data - {str(e)}")
        return JsonResponse({"error": f"Missing expected data field: {str(e)}"}, status=400)
    except Exception as e:
        logger.exception(f"add_basic_details failed for emp_no {emp_no or 'Unknown'}: An unexpected error occurred.")
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)

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
            consulted_by = data.get("consultedDoctor", None)

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
                name=name,
                emp_no=employee_id,
                organization_name=organization_name,
                aadhar_no=aadhar_no,
                contractor_name=contractor_name,
                purpose=purpose,
                date=appointment_date,
                time=time,
                booked_by=booked_by,
                consultated_by=consulted_by,
                employer=organization_name if role == "Employee" else contractor_name,
                doctor_name=consulted_by
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
                consulted_by = booked_by
                purpose = str(appointment_data[7]).strip()
                name = str(appointment_data[2]).strip() if len(appointment_data) > 2 else ""
                organization = str(appointment_data[4]).strip() if len(appointment_data) > 4 else ""
                contractor_name = None
                organization = None

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
                      role=role,
                      emp_no=emp_no,
                      aadhar_no=aadhar_no,
                      contractor_name=contractor_name,
                      booked_date = datetime.now().strftime("%Y-%m-%d"),
                      purpose=purpose,
                      date=date,
                      time=time,
                      booked_by=booked_by,
                      doctor_name=consulted_by,
                      name = name,
                      organization = organization,
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

@csrf_exempt
def fitness_test(request, pk=None):
    """Adds or updates fitness assessment data."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            try:
                job_nature = json.loads(data.get("job_nature", "[]"))
            except (TypeError, json.JSONDecodeError) as e:
                logger.warning(f"fitness_test failed: Invalid job_nature JSON, defaulting to []. Error: {str(e)}")
                job_nature = []

            fitness_test, created = FitnessAssessment.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults={
                    'tremors': data.get("tremors"),
                    'romberg_test': data.get("romberg_test"),
                    'acrophobia': data.get("acrophobia"),
                    'trendelenberg_test': data.get("trendelenberg_test"),
                    'job_nature': job_nature,
                    'overall_fitness': data.get("overall_fitness", ""),
                    'conditional_fit_feilds' : data.get("conditional_fit_feilds", []),
                    'validity' : data.get("validity"),
                    'comments': data.get("comments", ""),
                    'employer': data.get("employer", "")
                }
            )

            message = "Fitness test details added successfully" if created else "Fitness test details updated successfully"
            logger.info(f"Fitness test saved successfully for emp_no: {emp_no}")
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"fitness_test failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("fitness_test failed: An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    logger.warning("fitness_test failed: Invalid request method. Only POST allowed.")
    return JsonResponse({"error": "Request method is wrong"}, status=405)

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

@csrf_exempt
def add_member(request):
    """Adds a new member."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            member_type = data.get('memberType')

            if member_type == 'ohc':
                employee_number = data.get('employee_number', None)
                name = data.get('name')
                designation = data.get('designation')
                email = data.get('email')
                role = ','.join(data.get('role', []))
                doj = data.get('doj', None)
                date_exited = data.get('date_exited', None)
                job_nature = data.get('job_nature', None)

                member = Member.objects.create(
                    employee_number=employee_number,
                    name=name,
                    designation=designation,
                    email=email,
                    role=role,
                    doj=doj,
                    date_exited=date_exited,
                    job_nature = job_nature
                )

            elif member_type == 'external':
                name = data.get('name')
                designation = data.get('designation')
                email = data.get('email')
                role = ','.join(data.get('role', []))
                hospital_name = data.get('hospital_name')
                aadhar = data.get('aadhar', None)
                phone_number = data.get('phone_number', None)
                date_exited = data.get('date_exited', None)
                job_nature = data.get('job_nature', None)

                member = Member.objects.create(
                    name=name,
                    designation=designation,
                    email=email,
                    role=role,
                    hospital_name=hospital_name,
                    aadhar=aadhar,
                    phone_number=phone_number,
                    date_exited=date_exited,
                    job_nature = job_nature
                )
            else:
                logger.warning("add_member failed: Invalid memberType")
                return JsonResponse({'message': 'Invalid memberType'}, status=400)

            logger.info(f"Member saved successfully with ID: {member.id}")
            return JsonResponse({'message': 'Member added successfully'}, status=201)

        except json.JSONDecodeError as e:
            logger.error(f"add_member failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.exception("add_member failed: An unexpected error occurred.")
            return JsonResponse({'message': str(e)}, status=500)
    else:
        logger.warning("add_member failed: Invalid request method. Only POST allowed.")
        return JsonResponse({'message': 'Only POST method is allowed'}, status=405)

@csrf_exempt
def member_detail(request, pk):
    """Retrieves, updates, or deletes a single member."""
    try:
        member = get_object_or_404(Member, pk=pk)

        if request.method == 'GET':
            return JsonResponse({
                'employee_number': member.employee_number,
                'name': member.name,
                'designation': member.designation,
                'email': member.email,
                'role': member.role,
                'date_exited': member.date_exited
            })

        elif request.method == 'PUT':
            data = json.loads(request.body)
            member.name = data.get('name', member.name)
            member.designation = data.get('designation', member.designation)
            member.email = data.get('email', member.email)
            member.role = data.get('role', member.role)
            member.date_exited = data.get('date_exited', member.date_exited)
            member.save()
            logger.info(f"Member updated successfully with ID: {member.id}")
            return JsonResponse({'message': 'Member updated successfully'})

        elif request.method == 'DELETE':
            member.delete()
            logger.info(f"Member deleted successfully with ID: {pk}")
            return JsonResponse({'message': 'Member deleted successfully'})

    except json.JSONDecodeError as e:
        logger.error(f"member_detail failed: Invalid JSON data. Error: {str(e)}")
        return JsonResponse({'message': 'Invalid JSON format'}, status=400)
    except Exception as e:
        logger.exception("member_detail failed: An unexpected error occurred.")
        return JsonResponse({'message': str(e)}, status=500)

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

@csrf_exempt
def fetchVisitDataWithDate(request, emp_no, date):
    """Fetches visit data for a specific employee on a specific date."""
    if request.method == "GET":
        try:
            try:
                target_date = make_aware(datetime.strptime(date, "%Y-%m-%d"))
            except ValueError as e:
                logger.warning(f"fetchVisitDataWithDate failed: Invalid date format. Error: {str(e)}")
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            latest_employee = (
                models.employee_details.objects
                .filter(emp_no=emp_no, entry_date__lte=target_date)
                .last()
            )

            employee_data = {
                "employee": model_to_dict(latest_employee) if latest_employee else {},
                "dashboard": model_to_dict(models.Dashboard.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.Dashboard.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "vitals":  model_to_dict(models.vitals.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.vitals.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "msphistory":  model_to_dict(models.MedicalHistory.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.MedicalHistory.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "haematology":  model_to_dict(models.heamatalogy.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.heamatalogy.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "routinesugartests":  model_to_dict(models.RoutineSugarTests.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.RoutineSugarTests.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "renalfunctiontests":  model_to_dict(models.RenalFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.RenalFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "lipidprofile": model_to_dict(models.LipidProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.LipidProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "liverfunctiontest":  model_to_dict(models.LiverFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.LiverFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "thyroidfunctiontest":  model_to_dict(models.ThyroidFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.ThyroidFunctionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "coagulationtest": model_to_dict(models.CoagulationTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if  models.CoagulationTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "enzymesandcardiacprofile":  model_to_dict(models.EnzymesCardiacProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.EnzymesCardiacProfile.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "urineroutine":  model_to_dict(models.UrineRoutineTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.UrineRoutineTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "serology":  model_to_dict(models.SerologyTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.SerologyTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "motion": model_to_dict(models.MotionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.MotionTest.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "menspack":  model_to_dict(models.MensPack.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.MensPack.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "opthalamicreport":  model_to_dict(models.OphthalmicReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.OphthalmicReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "usg":  model_to_dict(models.USGReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.USGReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "mri":  model_to_dict(models.MRIReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.MRIReport.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "fitnessassessment":  model_to_dict(models.FitnessAssessment.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.FitnessAssessment.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "vaccination":  model_to_dict(models.VaccinationRecord.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.VaccinationRecord.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "significant_notes":  model_to_dict(models.SignificantNotes.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.SignificantNotes.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "consultation":  model_to_dict(models.Consultation.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.Consultation.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
                "prescription":  model_to_dict(models.Prescription.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last()) if models.Prescription.objects.filter(emp_no=emp_no, entry_date__lte=target_date).last() else {},
            }

            return JsonResponse({"data": employee_data},  safe=False, status=200)

        except Exception as e:
            logger.exception("fetchVisitDataWithDate failed: An unexpected error occurred.")
            return JsonResponse({"error": str(e)}, status=500)

    logger.warning("fetchVisitDataWithDate failed: Invalid request method. Only GET allowed.")
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_consultation(request):
    """Adds or updates consultation data."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            if not emp_no:
                logger.warning("add_consultation failed: Employee number is required")
                return JsonResponse({'status': 'error', 'message': 'Employee number is required'}, status=400)

            complaints = data.get('complaints')
            diagnosis = data.get('diagnosis')
            notifiable_remarks = data.get('notifiable_remarks')
            examination = data.get('examination')
            lexamination = data.get('lexamination')
            obsnotes = data.get('obsnotes')
            case_type = data.get('case_type')
            other_case_details = data.get('other_case_details')
            investigation_details = data.get('investigation_details')
            referral = data.get('referral')
            hospital_name = data.get('hospital_name')
            doctor_name = data.get('doctor_name')
            submitted_by_doctor = data.get('submitted_by_doctor')
            submitted_by_nurse = data.get('submitted_by_nurse')
            follow_up_date = data.get('follow_up_date')
            speaciality = data.get('speaciality')

            consultation, created = models.Consultation.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults={
                    'complaints': complaints,
                    'diagnosis': diagnosis,
                    'notifiable_remarks': notifiable_remarks,
                    'examination': examination,
                    'lexamination': lexamination,
                    'obsnotes': obsnotes,
                    'case_type': case_type,
                    'other_case_details': other_case_details,
                    'investigation_details': investigation_details,
                    'referral': referral,
                    'hospital_name': hospital_name,
                    'doctor_name': doctor_name,
                    'submitted_by_doctor': submitted_by_doctor,
                    'submitted_by_nurse': submitted_by_nurse,
                    'follow_up_date': follow_up_date,
                    'speaciality' : speaciality
                }
            )

            message = "Consultation added successfully" if created else "Consultation updated successfully"
            logger.info(f"Consultation saved successfully! ID: {consultation.id}")
            return JsonResponse({'status': 'success', 'message': message, 'consultation_id': consultation.id})

        except json.JSONDecodeError as e:
            logger.error(f"add_consultation failed: Invalid JSON data. Error: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format: ' + str(e)}, status=400)
        except Exception as e:
            logger.exception("add_consultation failed: An unexpected error occurred.")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    else:
        logger.warning("add_consultation failed: Invalid request method. Only POST allowed.")
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


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
            health_summary = data.get('health_summary') # Note: key name matches payload
            remarks = data.get('remarks')
            communicable_disease = data.get('communicable_disease')
            incident_type = data.get('incident_type')
            incident = data.get('incident')
            illness_type = data.get('illness_type')

            # Prepare defaults dictionary mapping payload keys to model field names
            note_defaults = {
                'healthsummary': health_summary,           # model field: variable from payload
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

            form = Form17(
                emp_no=data.get('emp_no'),
                dept=data.get('dept', ''),
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

            form = Form38(
                emp_no=data.get('emp_no'),
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

            form = Form39(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
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

            form = Form40(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
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

            form = Form27(
                emp_no=data.get('emp_no'),
                serialNumber=data.get('serialNumber', ''),
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
            print("Received Data:", data) # Keep for debugging if needed

            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            quantity_str = data.get("quantity") # Get as string first
            expiry_date_str = data.get("expiry_date")

            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity_str, expiry_date_str]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # --- Validate and Convert ---
            try:
                quantity = int(quantity_str)
                if quantity <= 0:
                     return JsonResponse({"error": "Quantity must be positive"}, status=400)
            except (ValueError, TypeError):
                return JsonResponse({"error": "Invalid quantity format"}, status=400)

            try:
                expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d").date()
            except ValueError:
                return JsonResponse({"error": "Invalid expiry date format. Use YYYY-MM-DD"}, status=400)

            entry_date = date.today() # Use date.today() for DateField

            # --- Logic for PharmacyMedicine (Get or Create Pattern) ---
            # Use get_or_create for simplicity if appropriate, ensures atomicity
            medicine_entry, created = PharmacyMedicine.objects.get_or_create(
                brand_name=brand_name,
                chemical_name=chemical_name,
                medicine_form=medicine_form,
                dose_volume=dose_volume,
                defaults={'entry_date': entry_date} # Set entry_date only if created
            )
            if created:
                 print(f"New entry added/found in PharmacyMedicine: {brand_name} - {chemical_name} - {dose_volume}")


            # --- Logic for PharmacyStock (Create New Batch) ---
            # Consider if you should *add* to existing stock quantity for the same batch
            # This code currently creates a *new* stock record every time.
            # If you want to ADD quantity to an existing batch (same med + expiry),
            # you'd use get_or_create or update_or_create here too.
            # Assuming creating a new batch record is intended:
            PharmacyStock.objects.create(
                entry_date=entry_date,
                medicine_form=medicine_form,
                brand_name=brand_name,
                chemical_name=chemical_name,
                dose_volume=dose_volume,
                quantity=quantity,
                expiry_date=expiry_date,
                # total_quantity=quantity, # If PharmacyStock model doesn't have total_quantity, remove this
            )

            return JsonResponse({"message": "Stock added successfully"}, status=201)

        except json.JSONDecodeError:
             return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("Error in add_stock") # Log full traceback
            print("Error Traceback:", traceback.format_exc()) # Keep if useful during dev
            # Avoid exposing raw error in production
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method. Only POST allowed."}, status=405)

@csrf_exempt
def get_brand_names(request):
    try:
        chemical_name = request.GET.get("chemical_name", "").strip()
        medicine_form = request.GET.get("medicine_form", "").strip()
        print(chemical_name, medicine_form)
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
            PharmacyMedicine.objects.filter(brand_name_iexact=brand_name, medicine_form_iexact=medicine_form)
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
    


@csrf_exempt
def get_current_stock(request):
    """ Fetch current stock grouped by Medicine Form, Brand Name, Chemical Name, Dose/Volume, and Expiry Date. """
    try:
        stock_data = (
            PharmacyStock.objects
            .values("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
            .annotate(total_quantity=Sum("quantity"))
            .filter(total_quantity__gt=0) # Only show items with stock > 0
            .order_by("medicine_form", "brand_name", "chemical_name", "dose_volume", "expiry_date")
        )

        data = []
        for entry in stock_data:
             try:
                 # Check if expiry_date exists and format, otherwise provide default
                 expiry_date_str = entry["expiry_date"].strftime("%b-%y") if entry.get("expiry_date") else "N/A"
             except AttributeError:
                 # Handle case where entry['expiry_date'] is not None but doesn't have strftime (unlikely for DateField)
                 expiry_date_str = "Invalid Date"

             data.append({
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "total_quantity": entry["total_quantity"],
                # "quantity_expiry": entry["total_quantity"], # Removed, seems redundant
                "expiry_date": expiry_date_str,
            })

        return JsonResponse({"stock": data}, safe=False) # safe=False needed for list response

    except Exception as e:
        logger.exception("Error in get_current_stock")
        return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

@csrf_exempt
def get_current_expiry(request):
    """
    Fetch medicines expiring soon or already expired.
    Move them to ExpiryRegister if not already moved.
    """
    try:
        today = date.today() # Use date.today() for comparing with DateField
        # Calculate the first day of the month *after* next month
        # This defines the upper bound (exclusive) for expiry dates we care about
        first_day_current_month = today.replace(day=1)
        # Calculate first day of next month
        if today.month == 12:
            first_day_next_month = first_day_current_month.replace(year=today.year + 1, month=1)
        else:
            first_day_next_month = first_day_current_month.replace(month=today.month + 1)

        # Calculate first day of the month *after* next month
        if first_day_next_month.month == 12:
             first_day_after_next_month = first_day_next_month.replace(year=first_day_next_month.year + 1, month=1)
        else:
             first_day_after_next_month = first_day_next_month.replace(month=first_day_next_month.month + 1)


        # Find stock items expiring *before* the first day of the month after next month
        # This includes items expiring this month, next month, or already expired.
        expiring_soon_stock = PharmacyStock.objects.filter(
            expiry_date__lt=first_day_after_next_month
        )

        moved_count = 0
        deleted_count = 0
        with transaction.atomic(): # Ensure move and delete happen together
            for medicine in expiring_soon_stock:
                # Check if it's already in the register *for this specific batch*
                already_registered = ExpiryRegister.objects.filter(
                    brand_name=medicine.brand_name,
                    chemical_name=medicine.chemical_name,
                    dose_volume=medicine.dose_volume,
                    expiry_date=medicine.expiry_date,
                    medicine_form=medicine.medicine_form, # Add form for uniqueness
                    # Maybe add a link back to the original stock ID if needed?
                ).exists()

                if not already_registered:
                    ExpiryRegister.objects.create(
                        medicine_form=medicine.medicine_form,
                        brand_name=medicine.brand_name,
                        chemical_name=medicine.chemical_name,
                        dose_volume=medicine.dose_volume,
                        quantity=medicine.quantity, # Store the quantity that expired
                        expiry_date=medicine.expiry_date,
                        # removed_date is null by default
                    )
                    moved_count += 1
                    # Delete the original stock record after moving
                    medicine.delete()
                    deleted_count += 1
                else:
                    # If already registered (e.g., from a previous run), just delete the stock
                    medicine.delete()
                    deleted_count += 1


        logger.info(f"Expiry check: Moved {moved_count} items to ExpiryRegister, deleted {deleted_count} from PharmacyStock.")

        # Fetch medicines from ExpiryRegister where removed_date is NULL (not yet marked as physically removed)
        expired_data_qs = ExpiryRegister.objects.filter(
            removed_date__isnull=True
        ).values(
            "id", "medicine_form", "brand_name", "chemical_name", "dose_volume", "quantity", "expiry_date"
        ).order_by('expiry_date') # Order them

        data = []
        for entry in expired_data_qs:
             expiry_date_str = entry["expiry_date"].strftime("%b-%y") if entry.get("expiry_date") else "N/A"
             data.append({
                "id": entry["id"],
                "medicine_form": entry["medicine_form"],
                "brand_name": entry["brand_name"],
                "chemical_name": entry["chemical_name"],
                "dose_volume": entry["dose_volume"],
                "quantity": entry["quantity"],
                "expiry_date": expiry_date_str,
            })

        return JsonResponse({"expiry_stock": data}, safe=False)

    except Exception as e:
        logger.exception("Error in get_current_expiry")
        return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)

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
                "expiry_date": entry["expiry_date"].strftime("%Y-%m-%d"),
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
                expiry_date=data.get("expiry_date"),
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
            expiry_date_str = entry["expiry_date"].strftime("%Y-%m-%d") if entry.get("expiry_date") else None
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

from django.utils import timezone # Add this import at the top

@csrf_exempt
def add_ward_consumable(request):
    """
    Add a new ward consumable entry, and update PharmacyStock.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            medicine_form = data.get("medicine_form")
            brand_name = data.get("brand_name")
            chemical_name = data.get("chemical_name")
            dose_volume = data.get("dose_volume")
            expiry_date_str = data.get("expiry_date") # Expecting YYYY-MM-DD string
            consumed_date_str = data.get("consumed_date") # Expecting YYYY-MM-DD string
            quantity_str = data.get("quantity")

            # --- Validation ---
            if not all([medicine_form, brand_name, chemical_name, dose_volume, quantity_str, expiry_date_str, consumed_date_str]):
                 return JsonResponse({"error": "Missing required consumable information.", "success": False}, status=400)

            try:
                quantity_to_consume = int(quantity_str)
                if quantity_to_consume <= 0:
                     return JsonResponse({"error": "Quantity must be positive.", "success": False}, status=400)
            except (ValueError, TypeError):
                 return JsonResponse({"error": "Invalid quantity provided.", "success": False}, status=400)

            try:
                # Ensure dates are valid before proceeding
                expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d").date()
                consumed_date = datetime.strptime(consumed_date_str, "%Y-%m-%d").date()
            except ValueError:
                 return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD.", "success": False}, status=400)

            # --- Transaction ---
            with transaction.atomic():
                # Use select_for_update to lock the row during transaction
                matching_medicine = PharmacyStock.objects.select_for_update().filter(
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    expiry_date=expiry_date # Match the exact expiry date
                ).first()

                if not matching_medicine:
                    return JsonResponse({"error": "Matching medicine batch not found in PharmacyStock.", "success": False}, status=404)

                if matching_medicine.quantity < quantity_to_consume:
                    return JsonResponse({
                        "error": f"Not enough quantity available in PharmacyStock. Available: {matching_medicine.quantity}, Requested: {quantity_to_consume}.",
                        "success": False
                    }, status=400)

                # Reduce quantity or delete if zero
                matching_medicine.quantity -= quantity_to_consume
                if matching_medicine.quantity <= 0:
                    matching_medicine.delete()
                    logger.info(f"Deleted stock record for {brand_name} {dose_volume} exp {expiry_date_str} as quantity reached zero.")
                else:
                    matching_medicine.save()
                    logger.info(f"Updated stock quantity for {brand_name} {dose_volume} exp {expiry_date_str} to {matching_medicine.quantity}.")


                # Create the consumable record
                WardConsumables.objects.create(
                    entry_date=timezone.now(), # Record *when* it was logged as consumed
                    medicine_form=medicine_form,
                    brand_name=brand_name,
                    chemical_name=chemical_name,
                    dose_volume=dose_volume,
                    quantity=quantity_to_consume,
                    expiry_date=expiry_date,
                    consumed_date=consumed_date, # Record the date it was actually consumed
                )

            return JsonResponse({"message": "Ward consumable added and stock updated successfully", "success": True}, status=201) # 201 Created is suitable

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format.", "success": False}, status=400)
        except PharmacyStock.DoesNotExist: # Should be caught by .first() but good practice
             logger.warning("Concurrency issue? PharmacyStock vanished during transaction.")
             return JsonResponse({"error": "Stock item not found, possibly due to concurrent update.", "success": False}, status=404)
        except Exception as e:
            logger.exception("Error in add_ward_consumable")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e), "success": False}, status=500)

    return JsonResponse({"error": "Invalid request method. Only POST is allowed.", "success": False}, status=405)


@csrf_exempt
def get_pending_calibrations(request):
    try:
        today = date.today()
        # Calculate the date range: anything due on or before the last day of next month
        first_day_current_month = today.replace(day=1)
        # Calculate first day of the month *after* next month (upper bound exclusive)
        if today.month == 11: # If November, next month is Dec, month after is Jan next year
             first_day_after_next_month = first_day_current_month.replace(year=today.year + 1, month=1)
        elif today.month == 12: # If December, next month is Jan next year, month after is Feb next year
             first_day_after_next_month = first_day_current_month.replace(year=today.year + 1, month=2)
        else: # Otherwise, just add 2 months
             first_day_after_next_month = first_day_current_month.replace(month=today.month + 2)


        pending_calibrations_qs = InstrumentCalibration.objects.filter(
            calibration_status=False,
            calibration_date__lt=first_day_after_next_month # Due before start of month after next
        ).values(
            "id", "instrument_name", "numbers", "make", "model_number", "calibration_date"
        ).order_by('calibration_date')

        data = []
        for entry in pending_calibrations_qs:
            cal_date_str = entry["calibration_date"].strftime("%d-%m-%Y") if entry.get("calibration_date") else "N/A"
            data.append({
                "id": entry["id"],
                "instrument_name": entry["instrument_name"],
                "numbers": entry["numbers"],
                "make": entry["make"],
                "model_number": entry["model_number"],
                "calibration_date": cal_date_str,
            })
        return JsonResponse({"pending_calibrations": data})

    except Exception as e:
        logger.exception("Error in get_pending_calibrations")
        return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)


@csrf_exempt
def get_calibration_history(request):
    try:
        calibrated_instruments = InstrumentCalibration.objects.filter(
            calibration_status=True
        ).values(
            "instrument_name", "numbers", "make", "model_number", "calibration_date"
        )

        data = [
            {
                "instrument_name": entry["instrument_name"],
                "numbers": entry["numbers"],
                "make": entry["make"],
                "model_number": entry["model_number"],
                "calibration_date": entry["calibration_date"].strftime("%d-%m-%Y"),
            }
            for entry in calibrated_instruments
        ]
        return JsonResponse({"calibration_history": data})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def complete_calibration(request):
    try:
        data = json.loads(request.body)
        instrument_id = data.get("id")

        if not instrument_id:
            return JsonResponse({"error": "Instrument ID is required"}, status=400)

        instrument = InstrumentCalibration.objects.get(id=instrument_id)
        instrument.calibration_status = True
        instrument.save()

        return JsonResponse({"message": "Calibration completed successfully"})

    except InstrumentCalibration.DoesNotExist:
        return JsonResponse({"error": "Instrument not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def add_instrument(request):
    if request.method == "POST": # Check method
        try:
            data = json.loads(request.body)

            # --- Validation ---
            required_fields = ["instrument_name", "numbers", "calibration_date", "calibration_status"]
            if any(field not in data for field in required_fields): # Check presence first
                return JsonResponse({"error": "Missing required fields: instrument_name, numbers, calibration_date, calibration_status"}, status=400)

            # More specific validation
            instrument_name = data.get("instrument_name")
            numbers = data.get("numbers")
            calibration_date_str = data.get("calibration_date")
            calibration_status_val = data.get("calibration_status") # Can be 0, 1, "0", "1", true, false etc.

            if not instrument_name or not numbers or not calibration_date_str or calibration_status_val is None:
                 return JsonResponse({"error": "Required fields cannot be empty."}, status=400)

            try:
                # Flexible boolean conversion
                if str(calibration_status_val).lower() in ['true', '1']:
                    calibration_status = True
                elif str(calibration_status_val).lower() in ['false', '0']:
                    calibration_status = False
                else:
                    raise ValueError("Invalid calibration_status value")
            except ValueError:
                return JsonResponse({"error": "Invalid calibration_status value. Use true/false or 1/0."}, status=400)

            try:
                calibration_date = datetime.strptime(calibration_date_str, "%Y-%m-%d").date() # Assuming YYYY-MM-DD
            except ValueError:
                return JsonResponse({"error": "Invalid calibration_date format. Use YYYY-MM-DD"}, status=400)


            # --- Database Operation ---
            with transaction.atomic():
                # Create the main record
                instrument = InstrumentCalibration.objects.create(
                    instrument_name=instrument_name,
                    numbers=numbers,
                    certificate_number=data.get("certificate_number"), # Use .get for optional fields
                    make=data.get("make"),
                    model_number=data.get("model_number"),
                    equipment_sl_no=data.get("equipment_sl_no"),
                    calibration_date=calibration_date,
                    calibration_status=calibration_status # Use the validated boolean
                )
                logger.info(f"Created InstrumentCalibration record ID {instrument.id} with status {calibration_status}")


                # If it was just calibrated (status=True), create the *next* scheduled calibration
                if instrument.calibration_status:
                    try:
                        next_calibration_date = instrument.calibration_date.replace(year=instrument.calibration_date.year + 1)
                    except ValueError:
                         # Handle leap year case for Feb 29th if necessary, though replace usually handles this ok
                         # For simplicity, assume replace works or add more robust date logic if needed
                         next_calibration_date = (instrument.calibration_date + timedelta(days=366)).replace(day=instrument.calibration_date.day)


                    # Create the placeholder for the next calibration
                    next_cal = InstrumentCalibration.objects.create(
                        instrument_name=instrument.instrument_name,
                        numbers=instrument.numbers,
                        # Carry over identifying info, but certificate will be new next time
                        make=instrument.make,
                        model_number=instrument.model_number,
                        equipment_sl_no=instrument.equipment_sl_no,
                        calibration_date=next_calibration_date,
                        calibration_status=False # Next one is pending
                    )
                    logger.info(f"Created next scheduled calibration record ID {next_cal.id} for {next_calibration_date}")


            return JsonResponse({"message": "Instrument added successfully", "instrument_id": instrument.id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.exception("Error in add_instrument")
            return JsonResponse({"error": "An internal server error occurred.", "detail": str(e)}, status=500)
    else:
         return JsonResponse({"error": "Invalid request method. Only POST allowed."}, status=405)
    

# Assuming 'logger' is configured (see imports step)

@csrf_exempt
def add_prescription(request):
    """Adds or updates prescription data based on emp_no."""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))

            emp_no = data.get('emp_no')
            if not emp_no:
                logger.warning("add_prescription failed: emp_no is required")
                return JsonResponse({"error": "Employee number (emp_no) is required"}, status=400)

            # --- Extract other data ---
            tablets = data.get('tablets', [])
            syrups = data.get('syrups', [])
            injections = data.get('injections', [])
            creams = data.get('creams', [])
            drops = data.get('drops', [])
            fluids = data.get('fluids', [])
            others = data.get('others', [])
            submitted_by = data.get('submitted_by')
            issued_by = data.get('issued_by')
            nurse_notes = data.get('nurse_notes')
            # entry_date_str = data.get('entry_date') # Usually you want server time for updates

            if not submitted_by or not issued_by:
                logger.warning("add_prescription failed: submitted_by and issued_by are required fields")
                return JsonResponse({"error": "submitted_by and issued_by are required fields"}, status=400)

            # --- Use update_or_create for atomicity ---
            # This assumes emp_no should have ONE active prescription record.
            # If multiple prescriptions per emp_no are allowed, this needs different logic.
            prescription, created = Prescription.objects.update_or_create(
                emp_no=emp_no,
                defaults={
                    'tablets': tablets,
                    'syrups': syrups,
                    'injections': injections,
                    'creams': creams,
                    'drops': drops,
                    'fluids': fluids,
                    'others': others,
                    'submitted_by': submitted_by,
                    'issued_by': issued_by,
                    'nurse_notes': nurse_notes,
                    'entry_date': timezone.now() # Always update timestamp on modification
                    # If you MUST preserve original entry_date, handle differently in defaults
                    # 'entry_date': timezone.now() if created else F('entry_date') # Needs F import
                }
            )

            message = "Prescription details added successfully" if created else "Prescription details updated successfully"
            logger.info(f"{message} for emp_no {emp_no}. ID: {prescription.id}")
            return JsonResponse({"message": message, "prescription_id": prescription.id}, status=201 if created else 200)

        except json.JSONDecodeError:
            logger.error("add_prescription failed: Invalid JSON data.")
            return JsonResponse({"error": "Invalid JSON data in request body"}, status=400)
        except Exception as e:
            logger.exception(f"add_prescription failed for emp_no '{data.get('emp_no', 'N/A')}': An unexpected error occurred.")
            return JsonResponse({"error": "Internal Server Error.", "detail": str(e)}, status=500)
    else:
        logger.warning("add_prescription failed: Invalid request method. Only POST allowed.")
        response = JsonResponse({"error": "Request method must be POST"}, status=405)
        response['Allow'] = 'POST'
        return response
        
def view_prescriptions(request):
    if request.method == 'GET':
        prescriptions = Prescription.objects.all()
        # Extract the fields you want to display in the table
        data = []
        for prescription in prescriptions:
            data.append({
                'id': prescription.id,
                'emp_no': prescription.emp_no,
                'name': f"{prescription.submitted_by} / {prescription.issued_by}",  # Concatenate names
                'entry_date': prescription.entry_date.strftime('%Y-%m-%d'), # Format date,
                'status': 0,  # Replace the status for view
            })

        return JsonResponse({'prescriptions': data})
    else:
        return JsonResponse({'error': 'Invalid request method. Only GET allowed.'}, status=405)