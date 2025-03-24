from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import models
import logging
from datetime import datetime
import json
from .models import user  # Replace with your actual model
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


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(username=username, password=password)  # Authenticate user
            print(user)  # Debugging

            if user is not None:
                # Return user info (convert object to JSON-compatible format)
                return JsonResponse({
                    "username": user.username,
                    "accessLevel": user.username,  # You can modify this based on roles later
                    "message": "Login successful!"
                }, status=200)
            else:
                return JsonResponse({"message": "User not found"}, status=404)

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)




import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Max  # Import Max
from django.db.models import CharField, TextField, IntegerField, FloatField, BooleanField, DateField, DateTimeField, JSONField
from . import models  # Import all models from the current app (adjust if needed)
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
def fetchdata(request):
    if request.method == "POST":
        try:
            latest_employees = (
                models.employee_details.objects.values("emp_no")
                    .annotate(latest_id=Max("id"))  # Ensure latest record
            )

            latest_employee_ids = [emp["latest_id"] for emp in latest_employees]
            employees = list(models.employee_details.objects.filter(id__in=latest_employee_ids).values())

            # Fetch latest records for other tables using emp_no
            def get_latest_records(model):
                print(model._meta.db_table)
                records = list(model.objects.filter(emp_no__in=[emp["emp_no"] for emp in employees]).values())
                if records:
                    all_keys = records[0].keys()  # Get keys from the first record
                    default_structure = {key: "" for key in all_keys}  # Default empty structure
                    return {record["emp_no"]: record for record in records}, default_structure
                else:
                    # When no records exist, provide a default structure
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
                                    else:
                                        default_structure[field.name] = {}  # Default empty JSON object
                                else:
                                    default_structure[field.name] = None  # Default to None for other types
                        return {}, default_structure  # Ensure two values are returned even if no data
                    except Exception as e:
                        print(e)
                        return {}, {}

            # Fetch all data with proper structure
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
            if not employees:
                return JsonResponse({"data": []}, status=200)

            # Merge data with empty structures where necessary
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
                merged_data.append(emp)

            return JsonResponse({"data": merged_data}, status=200)

        except Exception as e:
            logger.error(f"Error in fetchdata view: {str(e)}")  # Log the error for debugging
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def addEntries(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))

            if not data.get('emp_no'):
                return JsonResponse({"error": "Employee number is required"}, status=400)

            emp_no = data['emp_no']
            entry_date = datetime.now().date()  # Use date only for comparison

            try:
                # Attempt to get the existing record for the given emp_no and date
                dashboard, created = models.Dashboard.objects.update_or_create(
                    emp_no=emp_no,
                    date=entry_date, # Use entry date field
                    defaults={
                        'type_of_visit': data['formDataDashboard']['typeofVisit'],
                        'type': data['formDataDashboard']['category'],
                        'register': data['formDataDashboard']['register'],
                        'purpose': data['formDataDashboard']['purpose']
                    }
                )

                if created:
                    message = "Entry added successfully"
                else:
                    message = "Entry updated successfully" # record exits, the data is updated

                return JsonResponse({"message": message}, status=200)

            except Exception as e:
                print("Error:", e)
                return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)  # Return detailed error

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def dashboard_stats(request):
    try:
        # Get filters from request
        from_date_str = request.GET.get("fromDate")
        to_date_str = request.GET.get("toDate")
        visit_type_filter = request.GET.get("visitType")  # Preventive / Curative
        entity_filter = request.GET.get("entityType")  # Total Footfalls / Employee / Contractor / Visitor

        # Default to today's date if filters are cleared
        today = date.today()
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else today
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else today

        # Base queryset
        queryset = models.Dashboard.objects.filter(date__range=[from_date, to_date])

        # Apply first group filter (Preventive / Curative)
        if visit_type_filter in ["Preventive", "Curative"]:
            queryset = queryset.filter(type_of_visit=visit_type_filter)

        # Apply second group filter (Total Footfalls, Employee, Contractor, Visitor)
        if entity_filter == "Total Footfalls":
            # Count separately for Employee, Contractor, and Visitor
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

        # Aggregate filtered data
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
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def add_basic_details(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data['emp_no']
        entry_date = datetime.now().date()

        try:
            # Attempt to get the existing record for the given emp_no and date
            employee, created = models.employee_details.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date, #Check with date, this will ensure there is only entry in a particular date

                defaults={
                    'name': data['name'],
                    'dob': data['dob'],
                    'sex': data['sex'],
                    'aadhar': data['aadhar'],
                    'role': data['role'],
                    'bloodgrp': data['bloodgrp'],
                    'identification_marks1': data['identification_marks1'],
                    'identification_marks2': data['identification_marks2'],
                    'marital_status': data['marital_status'],
                    'employer': data['employer'],
                    'designation': data['designation'],
                    'department': data['department'],
                    'job_nature': data['job_nature'],
                    'doj': data['doj'],
                    'moj': data['moj'],
                    'phone_Personal': data['phone_Personal'],
                    'mail_id_Personal': data['mail_id_Personal'],
                    'emergency_contact_person': data['emergency_contact_person'],
                    'phone_Office': data['phone_Office'],
                    'mail_id_Office': data['mail_id_Office'],
                    'emergency_contact_relation': data['emergency_contact_relation'],
                    'mail_id_Emergency_Contact_Person': data['mail_id_Emergency_Contact_Person'],
                    'emergency_contact_phone': data['emergency_contact_phone'],
                    'state': data['state'],
                    'nationality': data['nationality'],
                    'area': data['area'],
                    'address': data['address'],
                }
            )

            if created:
                message = "Basic Details added successfully"
            else:
                message = "Basic Details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    else:
        return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_vital_details(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')  # Crucial: Get emp_no from the data
        entry_date = datetime.now().date() # Date now
        if not emp_no:
            return JsonResponse({"error": "Employee number is required"}, status=400)

        # Filter out unexpected fields (as before)
        allowed_fields = {field.name for field in models.vitals._meta.fields}
        allowed_fields.remove('id')
        allowed_fields.remove('entry_date')# remove entrydate from allowed fields for updating it
        filtered_data = {key: value for key, value in data.items() if key in allowed_fields}

        try:
            vitals, created = models.vitals.objects.update_or_create(
                emp_no=emp_no,
                entry_date = entry_date,
                defaults=filtered_data
            )

            if created:
                message = "Vital Details added successfully"
            else:
                message = "Vital Details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)

    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_motion_test(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            motion_test, created = models.MotionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Motion Test details added successfully" if created else "Motion Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_culture_sensitivity_test(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            culture_sensitivity_test, created = models.CultureSensitivityTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Culture Sensitivity Test details added successfully" if created else "Culture Sensitivity Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_mens_pack(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            mens_pack, created = models.MensPack.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Mens Pack details added successfully" if created else "Mens Pack details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_opthalmic_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            opthalmic_report, created = models.OphthalmicReport.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Ophthalmic Report details added successfully" if created else "Ophthalmic Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_usg_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            usg_report, created = models.USGReport.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "USG Report details added successfully" if created else "USG Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_mri_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            mri_report, created = models.MRIReport.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "MRI Report details added successfully" if created else "MRI Report details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def insert_vaccination(request):
    if request.method == "POST":
        try:
            print("Hii")
            data = json.loads(request.body)  # Parse JSON request body
            print(data)
            emp_no = data.get("emp_no")
            vaccination = data.get("vaccination")

            if not emp_no or not vaccination:
                return JsonResponse({"error": "emp_no and vaccination fields are required"}, status=400)
            entry_date = datetime.now().date()

            # Try to update if exists, otherwise create
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

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "An error occurred: " + str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def add_haem_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            haematology, created = models.heamatalogy.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Haematology details added successfully" if created else "Haematology details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_routine_sugar(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            routine_sugar, created = models.RoutineSugarTests.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Routine Sugar Test details added successfully" if created else "Routine Sugar Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_renel_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            renal_function, created = models.RenalFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Renal Function Test details added successfully" if created else "Renal Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_lipid_profile(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            lipid_profile, created = models.LipidProfile.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Lipid Profile details added successfully" if created else "Lipid Profile details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_liver_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            liver_function, created = models.LiverFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Liver Function Test details added successfully" if created else "Liver Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_thyroid_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            thyroid_function, created = models.ThyroidFunctionTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Thyroid Function Test details added successfully" if created else "Thyroid Function Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)



@csrf_exempt
def add_enzymes_cardiac(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            enzymes_cardiac, created = models.EnzymesCardiacProfile.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Enzymes Cardiac Profile details added successfully" if created else "Enzymes Cardiac Profile details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_urine_routine(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            urine_routine, created = models.UrineRoutineTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Urine Routine Test details added successfully" if created else "Urine Routine Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_serology(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            serology, created = models.SerologyTest.objects.update_or_create(
                emp_no=emp_no,
                entry_date=entry_date,
                defaults=data
            )

            message = "Serology Test details added successfully" if created else "Serology Test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


import json
from datetime import datetime, timedelta
from .models import Appointment

from datetime import datetime

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime
from .models import Appointment  # Import your Appointment model

@csrf_exempt
def BookAppointment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            # Extract data, providing defaults for optional fields
            role = data.get("role", None)
            name = data.get("name", None)
            employee_id = data.get("employeeId", None)
            organization_name = data.get("organization", None)
            aadhar_no = data.get("aadharNo", None)
            contractor_name = data.get("contractorName", None)
            purpose = data.get("purpose", None)
            appointment_date_str = data.get("appointmentDate", None)  # Corrected field name
            time = data.get("time", None)
            booked_by = data.get("bookedBy", None)
            consulted_by = data.get("consultedDoctor", None)

            # Convert appointment_date string to date object
            if appointment_date_str:
                appointment_date = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
                print(appointment_date)
                print(datetime.now().strftime("%Y-%m-%d"))
            else:
                return JsonResponse({"error": "Appointment date is required"}, status=400)

            # Get the count of existing appointments for the given date
            existing_appointments = Appointment.objects.filter(date=appointment_date).count()
            next_appointment_number = existing_appointments + 1  # Start from 1

            # Format appointment number: XXXXDDMMYYYY
            appointment_no = f"{next_appointment_number:04d}{appointment_date.strftime('%d%m%Y')}"
            print(appointment_no)
            # Create an Appointment instance
            appointment = Appointment.objects.create(
                appointment_no=appointment_no,
                booked_date = datetime.now().strftime("%Y-%m-%d"),
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

            return JsonResponse({"message": f"Appointment booked successfully for {appointment.name} on {appointment.date}. Appointment No: {appointment.appointment_no}"})

        except Exception as e:
            print(e)  # Log the exception for debugging
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def get_appointments(request):
    if request.method == "GET":
        from_date_str = request.GET.get('fromDate')
        to_date_str = request.GET.get('toDate')
        print(from_date_str, to_date_str)  # Debugging
        today = datetime.today().date()

        # Convert string to date format safely
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else None
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else None

        # Fetch appointments based on provided filters using `date`
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

        # Convert QuerySet to JSON format
        appointment_list = list(appointments.values())
        print(appointment_list)  # Debugging
        return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."})

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def update_appointment_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            appointment_id = data.get("id")
            appointment = Appointment.objects.get(id=appointment_id)

            if appointment.status == Appointment.StatusChoices.INITIATE:
                appointment.status = Appointment.StatusChoices.IN_PROGRESS
            elif appointment.status == Appointment.StatusChoices.IN_PROGRESS:
                appointment.status = Appointment.StatusChoices.COMPLETED
            else:
                return JsonResponse({"success": False, "message": "Cannot update status further."})

            appointment.save()
            return JsonResponse({"success": True, "message": "Status updated", "status": appointment.status})

        except Appointment.DoesNotExist:
            return JsonResponse({"success": False, "message": "Appointment not found"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from django.forms.models import model_to_dict
from .models import Appointment  # Make sure to import your Appointment model
import json
from django.utils.timezone import make_aware
import logging
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

@csrf_exempt
def uploadAppointment(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        appointments_data = data.get("appointments", [])

        if not appointments_data:
            return JsonResponse({"error": "No appointment data provided."}, status=400)

        successful_appointments = 0  # Track successful appointments

        for i, appointment_data in enumerate(appointments_data):
            if i == 0:  # Skip header row
                continue

            # Ensure there are enough fields (adjust based on maximum fields expected)
            max_expected_fields = 11  # Assumes max fields across all types
            if len(appointment_data) < 7:  # Ensure at least basic fields are present
                logger.warning(f"Skipping appointment due to insufficient fields: {appointment_data}")
                continue # skip to next appointment
                #return JsonResponse({"error": "Missing required fields in appointment row."}, status=400)

            try:
                role = str(appointment_data[1]).strip().lower() # Role is in the second column

                # Extract common fields
                emp_no = str(appointment_data[3]).strip() if len(appointment_data) > 3 else None
                aadhar_no = str(appointment_data[5]).strip() if len(appointment_data) > 5 else None

                # Date Parsing (Handles Excel Serial Dates & Strings)
                def parse_date(value):
                    if isinstance(value, int):  # Excel serial date handling
                        return (datetime(1899, 12, 30) + timedelta(days=value)).date()
                    try:
                        return datetime.strptime(str(value).strip(), "%Y-%m-%d").date()
                    except ValueError:
                         try: # Attempt to use a different format to parse the Date
                            return datetime.strptime(str(value).strip(), "%m/%d/%Y").date()
                         except ValueError:
                             raise ValueError(f"Invalid date format: {value}.  Use YYYY-MM-DD or MM/DD/YYYY")

                date = parse_date(appointment_data[8])  # Ensure only date is stored
                time = str(appointment_data[9]).strip()
                booked_by = str(appointment_data[10]).strip() if len(appointment_data) > 10 else ""
                consulted_by = booked_by  # Assumed same as booked_by
                purpose = str(appointment_data[7]).strip()

                # -- Role-Specific Data --
                contractor_name = None
                organization = None

                if role == "contractor":
                    contractor_name = str(appointment_data[6]).strip() if len(appointment_data) > 6 else None

                elif role == "visitor" or role =="employee":
                    organization = str(appointment_data[6]).strip() if len(appointment_data) > 6 else None

                # Generate appointment number
                formatted_date = date.strftime("%d%m%Y")
                appointment_count = Appointment.objects.filter(date=date).count() + 1
                appointment_no = f"{appointment_count:04d}{formatted_date}"

                print(f"Role: {role}, Generated Appointment No: {appointment_no}")
            except (IndexError, ValueError) as e:
                logger.error(f"Error processing appointment data: {appointment_data}, Error: {str(e)}")
                return JsonResponse({"error": f"Error processing appointment data: {str(e)}"}, status=400)
            # -- Validate and Create based on role --
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
                      organization = organization
                  )
                  successful_appointments += 1
                else:
                    logger.warning(f"Skipping appointment due to unknown role: {role}")

            except ValidationError as e:
                logger.error(f"Validation Error creating appointment: {str(e)}")
                return JsonResponse({"error": f"Data Validation Error: {str(e)}"}, status=400)

        if successful_appointments > 0:
            return JsonResponse({"message": f"{successful_appointments} appointments uploaded successfully."})
        else:
            return JsonResponse({"message": "No appointments were uploaded.  Check data for valid roles and formats."}, status=200) # OK but no records created

    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    except Exception as e:
        logger.exception("Unexpected error during appointment upload") # Log full exception
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

@csrf_exempt
def create_users(request):
    users = [
        {'username': 'nurse', 'password': 'nurse123'},
        {'username': 'doctor', 'password': 'doctor123'},
        {'username': 'admin', 'password': 'admin123'}
    ]
    for user_data in users:
        user = User.objects.get(username=user_data['username'])
        user.set_password(user_data['password'])
        user.save()

    print("Users created successfully.")
    return JsonResponse({"message": "Password updated successfully!"})


@csrf_exempt
def save_mockdrills(request):

    if request.method == "POST":
        try:
            print("Hi hello")
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
            return JsonResponse({"message": "Mock drill saved successfully{}".format(mock_drill.id)}, status=201)
        except Exception as e:
            print("error occured")


            return JsonResponse({"error": str(e) + "This error"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

from .models import VaccinationRecord

@csrf_exempt
def insert_vaccination(request):
    if request.method == "POST":
        try:
            print("Hii")
            data = json.loads(request.body)  # Parse JSON request body
            print(data)
            emp_no = data.get("emp_no")
            vaccination = data.get("vaccination")

            if not emp_no or not vaccination:
                return JsonResponse({"error": "emp_no and vaccination fields are required"}, status=400)

            # Insert into database
            created_record = VaccinationRecord.objects.create(
                emp_no=emp_no,
                vaccination=vaccination
            )

            return JsonResponse({
                "message": "Vaccination record saved successfully",
                "created": {
                    "id": created_record.id,
                    "emp_no": created_record.emp_no,
                    "vaccination": created_record.vaccination,
                    "entry_date": created_record.entry_date.strftime("%Y-%m-%d %H:%M:%S")
                }
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def fetch_vaccinations(request):
    if request.method == "GET":
        emp_no = request.GET.get("emp_no")  # Optional filter by emp_no
        
        if emp_no:
            records = VaccinationRecord.objects.filter(emp_no=emp_no).values()
        else:
            records = VaccinationRecord.objects.all().values()

        return JsonResponse(list(records), safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def fitness_test(request, pk=None):

    if request.method == "POST":
        # Create a new record
        data = json.loads(request.body)
        print(data)
        emp_no = data.get('emp_no')
        entry_date = datetime.now().date()

        try:
            job_nature = json.loads(data.get("job_nature", "[]"))  # Try parsing, default to empty list
        except (TypeError, json.JSONDecodeError):
            job_nature = []  # If parsing fails, use an empty list

        try:
            fitness_test, created = FitnessAssessment.objects.update_or_create(
                emp_no=emp_no,
                entry_date = entry_date,
                defaults={
                    'tremors': data.get("tremors"),
                    'romberg_test': data.get("romberg_test"),
                    'acrophobia': data.get("acrophobia"),
                    'trendelenberg_test': data.get("trendelenberg_test"),
                    'job_nature': job_nature, #Assign Parsed list
                    'overall_fitness': data.get("overall_fitness", ""),
                    'conditional_fit_feilds' : data.get("conditional_fit_feilds", []),
                    'validity' : data.get("validity"),
                    'comments': data.get("comments", ""),
                    'employer': data.get("employer", "")
                    }
            )

            message = "Fitness test details added successfully" if created else "Fitness test details updated successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error:" + str(e)}, status=500)
    return JsonResponse({"error": "Request method is wrong"}, status=405)

from .models import mockdrills,ReviewCategory, Review

def get_categories(request):
    categories = list(ReviewCategory.objects.values("id", "name"))
    return JsonResponse({"categories": categories}, safe=False)


def get_reviews(request, status):
    reviews = list(Review.objects.filter(status=status).values("id", "pid", "name", "gender", "appointment_date", "category__name"))
    return JsonResponse({"reviews": reviews}, safe=False)


@csrf_exempt
def add_review(request):
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
            return JsonResponse({"message": "Review added successfully", "id": review.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Add a new member
@csrf_exempt
def add_member(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        member = models.Member.objects.create(
            employee_number=data['employee_number'],
            name=data['name'],
            designation=data['designation'],
            email=data['email'],
            role=data['role'],
            date_exited=data.get('date_exited')
        )
        return JsonResponse({'message': 'Member added successfully', 'id': member.id})
    
# Get, Update, Delete a single member
@csrf_exempt
def member_detail(request, pk):
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
        return JsonResponse({'message': 'Member updated successfully'})
    
    elif request.method == 'DELETE':
        member.delete()
        return JsonResponse({'message': 'Member deleted successfully'})
    
import json
from datetime import datetime, date
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import eventsandcamps # Import your model
from django.core.files.storage import default_storage

ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt']

@csrf_exempt
def add_camp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Data received by backend:", data)

            # Date parsing
            start_date_str = data.get("start_date")
            end_date_str = data.get("end_date")

            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError as e:
                return JsonResponse({"error": f"Invalid date format: {e}"}, status=400)

            camp = eventsandcamps.objects.create(
                camp_name=data.get("camp_name"),
                start_date=start_date,
                end_date=end_date,
                camp_details=data.get("camp_details"),
            )
            return JsonResponse({"message": "Camp added successfully!", "id": camp.id}, status=201)

        except Exception as e:
            print("Error in add_camp view:", e)
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

def get_camps(request):
    if request.method == "GET":
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
        elif filter_status:  # Check if filter_status is not empty
            # Use a try-except block to handle potential invalid camp_type values
            try:
                camps = camps.filter(camp_type=filter_status)
            except ValueError:
                return JsonResponse({"error": "Invalid camp_type value"}, status=400)

        if date_from_str:
            try:
                date_from = datetime.strptime(date_from_str, "%Y-%m-%d").date()
                camps = camps.filter(start_date__gte=date_from)
            except ValueError:
                return JsonResponse({"error": "Invalid dateFrom format"}, status=400)

        if date_to_str:
            try:
                date_to = datetime.strptime(date_to_str, "%Y-%m-%d").date()
                camps = camps.filter(end_date__lte=date_to)
            except ValueError:
                return JsonResponse({"error": "Invalid dateTo format"}, status=400)

        data = []
        for camp in camps:
            camp_data = {
                'id': camp.id,
                'camp_name': camp.camp_name,
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
import os  # Import the 'os' module

@csrf_exempt
def upload_files(request):
    if request.method == 'POST':
        camp_id = request.POST.get('campId')
        file_type = request.POST.get('fileType')

        try:
            camp = eventsandcamps.objects.get(pk=camp_id)
        except eventsandcamps.DoesNotExist:
            return JsonResponse({'error': 'Camp not found'}, status=404)

        file = request.FILES.get('files')

        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        file_extension = file.name.split('.')[-1].lower()
        if file_extension not in ALLOWED_FILE_TYPES:
            return JsonResponse({'error': 'Invalid file type'}, status=400)

        old_file = None
        file_url = None  # Initialize file_url

        try:
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
                return JsonResponse({'error': 'Invalid file type'}, status=400)

            camp.save()

            # Get file URL after saving and before deleting the old file
            # Use getattr() to safely access attributes
            file_field = getattr(camp, file_type, None)  # Get the attribute (e.g., camp.report1)
            if file_field:  # Check if the file field exists and is not None
                file_url = file_field.url  # Get the URL
            else:
                file_url = None #If not valid file_field, set it to None

            if old_file:
                if default_storage.exists(old_file.name):
                    default_storage.delete(old_file.name)

            return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url}, status=200)

        except Exception as e:
            print("Error in upload_files view:", e)

            # Delete the newly uploaded file on error
            if file and hasattr(file, 'name'): # Check the file is defined and has a name
                try:
                     if default_storage.exists(file.name): # check if the file exist on server
                         default_storage.delete(file.name) # delete it
                except Exception as delete_error:
                     print("Error deleting the problematic new file", delete_error)

            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
def download_file(request):
    if request.method == "GET":
        camp_id = request.GET.get('campId')
        file_type = request.GET.get('fileType')

        try:
            camp = get_object_or_404(eventsandcamps, pk=camp_id)
        except eventsandcamps.DoesNotExist:
            return JsonResponse({"error": "Camp not found"}, status=404)

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
            return JsonResponse({"error": "Invalid file type"}, status=400)

        if not file_field:
            return JsonResponse({"error": "File not found"}, status=404)

        try:
            with open(file_field.path, 'rb') as f:
                response = HttpResponse(f.read(), content_type="application/force-download")
                response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_field.name)  # Suggest filename
                return response

        except FileNotFoundError:
            return JsonResponse({"error": "File not found on server"}, status=404)
        except Exception as e:
            print("Error during download:", e)
            return JsonResponse({"error": "Error during download"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def delete_file(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            camp_id = data.get('campId')
            file_type = data.get('fileType')

            camp = eventsandcamps.objects.get(pk=camp_id)

            # Determine which file field to clear
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
                return JsonResponse({'error': 'Invalid file type'}, status=400)

            # Delete the file from storage, if it exists
            if file_field:
                default_storage.delete(file_field.name)  # Delete the old file
            camp.save()  # Save the model to remove the association
            return JsonResponse({'message': 'File deleted successfully'}, status=200)

        except eventsandcamps.DoesNotExist:
            return JsonResponse({'error': 'Camp not found'}, status=404)
        except Exception as e:
            print("Error in delete_file view:", e)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def save_mockdrills(request):

    if request.method == "POST":
        try:
            print("Hi hello")
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
            return JsonResponse({"message": "Mock drill saved successfully{}".format(mock_drill.id)}, status=201)
        except Exception as e:
            print("error occured")


            return JsonResponse({"error": str(e) + "This error"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def get_mockdrills(request):
    if request.method == "GET":
        try:
            mock_drills = list(mockdrills.objects.values())  # Serialize the queryset to a list of dictionaries
            return JsonResponse(mock_drills, safe=False)  # safe=False allows serialization of non-dict objects (lists, etc.)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    

import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from . import models

logger = logging.getLogger(__name__)

import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from . import models
from datetime import datetime

logger = logging.getLogger(__name__)

@csrf_exempt
def create_medical_history(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            data = json.loads(request.body)
            logger.info("Received data: %s", data)  # Log the received data

            # Validate required fields
            required_fields = ['emp_no',  'personalHistory', 'medicalData', 'femaleWorker',
                              'surgicalHistory', 'familyHistory', 'healthConditions', 'submissionDetails',
                              'allergyFields', 'allergyComments', 'childrenData', 'conditions']
            for field in required_fields:
                if field not in data:
                    logger.error("Missing required field: %s", field)
                    return JsonResponse({"error": f"Missing required field: {field}"}, status=400)

            emp_no = data['emp_no']
            entry_date = datetime.now().date()  # Get the current date

            # Create medical history record
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
                    'submission_details': data['submissionDetails'],
                    'allergy_fields': data['allergyFields'],
                    'allergy_comments': data['allergyComments'],
                    'children_data': data['childrenData'],
                    'conditions': data['conditions']
                }
            )

            if created:
                message = "Medical history created successfully"
            else:
                message = "Medical history updated successfully"


            logger.info("Medical history created/updated successfully for emp_no: %s", data['emp_no'])
            return JsonResponse({"message": message}, status=200)

        except json.JSONDecodeError:
            logger.error("Invalid JSON data received")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except ValidationError as e:
            logger.error("Validation error: %s", str(e))
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            logger.error("Error creating/updating medical history: %s", str(e))
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)
    

@csrf_exempt
def fetchVisitdata(request, emp_no):
    if request.method == "POST":
        try:
            print(emp_no)
            data = list(models.Dashboard.objects.filter(emp_no=emp_no).values())
            print(data)
            return JsonResponse({"message": "Visit data fetched successfully", "data":data}, status=200)
        except Exception as e:
            return JsonResponse({"error": "Invalid request"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request"}, status=500)
    

@csrf_exempt
def fetchVisitdataAll(request):
    if request.method == "POST":
        try:
            data = list(models.Dashboard.objects.values())
            return JsonResponse({"message": "Visit data fetched successfully", "data":data}, status=200)
        except Exception as e:
            return JsonResponse({"error": "Invalid request"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request"}, status=500)
    
@csrf_exempt
def fetchFitnessData(request):
    if request.method == "POST":
        try:
            data = list(models.FitnessAssessment.objects.values())
            return JsonResponse({"message": "Fitness data fetched successfully", "data":data}, status=200)
        except Exception as e:
            return JsonResponse({"error": "Invalid request"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request"}, status=500)
    


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime
from django.forms.models import model_to_dict
from . import models
import json
from django.utils.timezone import make_aware, is_aware
from django.core.serializers.json import DjangoJSONEncoder

# class CustomJSONEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, ImageFieldFile):
#             return obj.url  # Return the URL of the image
#         return super().default(obj)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime
from django.forms.models import model_to_dict
from . import models
import json
from django.utils.timezone import make_aware, is_aware
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.fields.files import ImageFieldFile
import logging

logger = logging.getLogger(__name__) #Get a logger instance

class CustomJSONEncoder(DjangoJSONEncoder): # DjangoJSONEncoder already handles dates!
    def default(self, obj):
        if isinstance(obj, ImageFieldFile):
            return obj.url if obj else None
        return super().default(obj)


@csrf_exempt
def fetchVisitDataWithDate(request, emp_no, date):
    if request.method == "GET":
        try:
            # Convert date string to datetime object and make it timezone-aware
            try:
                target_date = make_aware(datetime.strptime(date, "%Y-%m-%d"))
            except ValueError:
                return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

            # Fetch latest available record on or before the given date
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
            }
        
            return JsonResponse({"data": employee_data}, encoder=CustomJSONEncoder, safe=False, status=200)

        except Exception as e:
            logger.error(f"Error in fetchVisitDataWithDate view: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def add_consultation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Decode byte string
            print(data)  # Debugging: Print received data to console
            
            emp_no = data.get('emp_no')
            entry_date = datetime.now().date()

            if not emp_no:
                return JsonResponse({'status': 'error', 'message': 'Employee number is required'}, status=400)

            # Extract all fields from the request data
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
            print(f"Consultation saved successfully! ID: {consultation.id}")  # Debugging: Print successful save
            return JsonResponse({'status': 'success', 'message': message, 'consultation_id': consultation.id})  # Return a JSON message to indicate success, include the ID

        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format: ' + str(e)}, status=400)

        except Exception as e:
            print(f"Error saving consultation: {str(e)}")  # Debugging: Print error message to console
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)  # Return detailed error message

    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)




@csrf_exempt
def add_prescription(request):
    """
    View to handle adding or updating prescription data.
    Expects JSON data in the request body.
    """
    if request.method == "POST":
        try:
            print("Hii")
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            emp_no = data.get('emp_no', None)
            tablets = data.get('tablets', [])  
            injections = data.get('injections', [])
            creams = data.get('creams', [])
            others = data.get('others', [])
            submitted_by = data.get('submittedBy') 
            issued_by = data.get('issuedby') 
            nurse_notes = data.get('nurseNotes')

            if not submitted_by or not issued_by:
                return JsonResponse({"error": "submitted_by and issued_by are required fields"}, status=400)


            prescription, created = models.Prescription.objects.update_or_create(
                emp_no=emp_no,
                entry_date = datetime.now().date(),
                defaults={
                    'tablets': tablets,
                    'injections': injections,
                    'creams': creams,
                    'others': others,
                    'submitted_by': submitted_by,
                    'issued_by': issued_by,
                    'nurse_notes':nurse_notes,
                }
            )

            message = "Prescription details added successfully" if created else "Prescription details updated successfully"
            return JsonResponse({"message": message, "prescription_id": prescription.id}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data in request body"}, status=400)
        except Exception as e:
            print("Error:", e) 
            return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)
    else:
        return JsonResponse({"error": "Request method must be POST"}, status=405)