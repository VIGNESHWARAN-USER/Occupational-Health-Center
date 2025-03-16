from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import models
import logging
from datetime import datetime
import json
from .models import user  # Replace with your actual model
from .models import Appointment  # Replace with your actual model
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
            vaccination_dict, vaccination_default = get_latest_records(models.Vaccination)

            # If no employees found, return a meaningful response
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

            print(data['emp_no'])
            models.Dashboard.objects.create(
                emp_no=data['emp_no'],
                type_of_visit=data['formDataDashboard']['typeofVisit'],
                type=data['formDataDashboard']['category'],
                register=data['formDataDashboard']['register'],
                purpose=data['formDataDashboard']['purpose']
            )

            return JsonResponse({"message": "Entry added successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Internal Server Error"}, status=500)

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
        print(data['role'])
        basicdetails = models.employee_details.objects.create(
            name=data['name'],
            dob=data['dob'],
            sex=data['sex'],
            aadhar=data['aadhar'],
            role = data['role'],
            bloodgrp=data['bloodgrp'],
            identification_marks1=data['identification_marks1'],
            identification_marks2=data['identification_marks2'],
            marital_status=data['marital_status'],
            emp_no=data['emp_no'],
            employer=data['employer'],
            designation=data['designation'],
            department=data['department'],
            job_nature=data['job_nature'],
            doj=data['doj'],
            moj=data['moj'],
            phone_Personal=data['phone_personal'],
            mail_id_Personal=data['mail_id_Personal'],
            emergency_contact_person=data['emergency_contact_person'],
            phone_Office=data['phone_Office'],
            mail_id_Office=data['mail_id_Office'],
            emergency_contact_relation=data['emergency_contact_relation'],
            mail_id_Emergency_Contact_Person=data['mail_id_Emergency_Contact_Person'],
            emergency_contact_phone=data['emergency_contact_phone'],
            address=data['address'],
        )
        return JsonResponse({"message": "Basic Details added successfully"}, status=200)
    else:
        return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_vital_details(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        # Filter out unexpected fields
        allowed_fields = {field.name for field in models.vitals._meta.fields}
        allowed_fields.remove('id')
        filtered_data = {key: value for key, value in data.items() if key in allowed_fields}
        models.vitals.objects.create(**filtered_data)
        return JsonResponse({"message": "Vital Details added successfully"}, status=200)

    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_motion_test(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.MotionTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Motion Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_culture_sensitivity_test(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.CultureSensitivityTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Culture Sensitivity Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_mens_pack(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.MensPack.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Mens Pack details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_opthalmic_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.OphthalmicReport.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Ophthalmic Report details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_usg_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.USGReport.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "USG Report details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_mri_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.MRIReport.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "MRI Report details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)

@csrf_exempt
def add_mri(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.MRIReport.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "MRI Report details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)



@csrf_exempt
def add_haem_report(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.heamatalogy.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Haematology details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_routine_sugar(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.RoutineSugarTests.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Routine Sugar Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_renel_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.RenalFunctionTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Renal Function Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_lipid_profile(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.LipidProfile.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Lipid Profile details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_liver_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.LiverFunctionTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Liver Function Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_thyroid_function(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.ThyroidFunctionTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Thyroid Function Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)




@csrf_exempt
def add_enzymes_cardiac(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.EnzymesCardiacProfile.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Enzymes Cardiac Profile details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_urine_routine(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.UrineRoutineTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Urine Routine Test details added successfully"}, status=200)
    return JsonResponse({"error": "Request method is wrong"}, status=405)


@csrf_exempt
def add_serology(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        models.SerologyTest.objects.create(**data)  # Modified to create directly
        return JsonResponse({"message": "Serology Test details added successfully"}, status=200)
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


@csrf_exempt
def uploadAppointment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            appointments_data = data.get("appointments", [])
            appointment_count = {}

            for i, appointment_data in enumerate(appointments_data):
                if i == 0:  # Skip header row
                    continue

                try:
                    role = str(appointment_data[1]).strip()
                    if role.lower() != "contractor":  # Filter only contractor appointments
                        continue
                    
                    emp_no = str(appointment_data[3]).strip()
                    aadhar_no = str(appointment_data[5]).strip()
                    contractor_name = str(appointment_data[6]).strip()
                    purpose = str(appointment_data[7]).strip()

                    def parse_date(value):
                        if isinstance(value, int):  # Excel serial date handling
                            return (datetime(1899, 12, 30) + timedelta(days=value)).date()
                        return datetime.strptime(str(value).strip(), "%Y-%m-%d").date()

                    date = parse_date(appointment_data[8])  # Ensure only date is stored
                    time = str(appointment_data[9]).strip()
                    booked_by = str(appointment_data[10]).strip()
                    consulted_by = str(appointment_data[10]).strip()
                    
                    # Format date as ddmmyyyy for appointment_no
                    formatted_date = date.strftime("%d%m%Y")

                    # Determine the sequence number for the given date
                    if formatted_date not in appointment_count:
                        appointment_count[formatted_date] = 1
                    else:
                        appointment_count[formatted_date] += 1
                    print(appointment_count)  # Debugging
                    # Format the appointment number (4-digit sequence + date)
                    appointment_no = f"{appointment_count[formatted_date]:04d}{formatted_date}"
                    print(appointment_no)  # Debugging
                except IndexError:
                    return JsonResponse({"error": "Data is missing required fields."}, status=400)
                except ValueError as ve:
                    return JsonResponse({"error": f"Invalid date format: {ve}"}, status=400)
                
                # Create and save the contractor appointment
                Appointment.objects.create(
                    appointment_no=appointment_no,
                    role=role,
                    emp_no=emp_no,
                    aadhar_no=aadhar_no,
                    contractor_name=contractor_name,
                    purpose=purpose,
                    date=date,  # Store only date
                    time=time,
                    booked_by=booked_by,
                    doctor_name=consulted_by
                )

            return JsonResponse({"message": "Contractor appointments uploaded successfully."})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

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

@csrf_exempt
def insert_vaccination(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)  # Debugging

            # Extract data correctly
            vaccine_name = data.get("vaccine")  # Correct key name
            status = data.get("status")
            emp_no = data.get("emp_no")
            # Extract normal and booster doses
            normal_doses = {
                "dates": [dose["date"] for dose in data.get("normalDoses", []) if dose["date"]],
                "dose_names": [dose["name"] for dose in data.get("normalDoses", []) if dose["name"]]
            }

            booster_doses = {
                "dates": [dose["date"] for dose in data.get("boosterDoses", []) if dose["date"]],
                "dose_names": [dose["name"] for dose in data.get("boosterDoses", []) if dose["name"]]
            }

            # Create a new vaccination record
            vaccination = Vaccination.objects.create(
                emp_no=emp_no,
                name=vaccine_name,
                status=status,
                normal_doses=normal_doses,
                booster_doses=booster_doses
            )

            return JsonResponse({"message": "Vaccination record added successfully", "id": vaccination.id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


from .models import Vaccination  # Ensure you import the Vaccination model

@csrf_exempt
def fetch_vaccinations(request):
    if request.method == "GET":
        try:
            print("HII")
            # Retrieve all vaccination records
            vaccinations = Vaccination.objects.all()

            # Convert queryset to a list of dictionaries
            data = [
                {
                    "id": v.id,
                    "vaccine": v.name,
                    "status": v.status,
                    "normalDoses": [
                        {"date": date, "name": name}
                        for date, name in zip(v.normal_doses.get("dates", []), v.normal_doses.get("dose_names", []))
                    ],
                    "boosterDoses": [
                        {"date": date, "name": name}
                        for date, name in zip(v.booster_doses.get("dates", []), v.booster_doses.get("dose_names", []))
                    ],
                }
                for v in vaccinations
            ]

            return JsonResponse({"vaccinations": data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def fitness_test(request, pk=None):
    if request.method == "GET":
        print("Pramoth")
        if pk:
            # Retrieve a single record
            fitness_test = json.loads(FitnessAssessment)
            return JsonResponse({
                "id": fitness_test.get['id'],
                "emp_no": fitness_test.get['emp_no'],
                "tremors": fitness_test.get['tremors'],
                "romberg_test": fitness_test.get['romberg_test'],
                "acrophobia": fitness_test.get['acrophobia'],
                "trendelenberg_test": fitness_test.get['trendelenberg_test'],
                "job_nature": fitness_test.get['job_nature'],
                "overall_fitness": fitness_test.get['overall_fitness'],
                "comments": fitness_test.get['comments'],
                "created_at": fitness_test.get['created_at']
            })
        else:
            # Retrieve all records
            tests = list(FitnessAssessment.objects.all().values())
            return JsonResponse(tests, safe=False)

    elif request.method == "POST":
        # Create a new record
        data = json.loads(request.body)
        print(data)
        fitness_test = FitnessAssessment.objects.create(
            emp_no=data.get("emp_no"),
            tremors=data.get("tremors"),
            romberg_test=data.get("romberg_test"),
            acrophobia=data.get("acrophobia"),
            trendelenberg_test=data.get("trendelenberg_test"),
            job_nature=data.get("job_nature", ""),
            overall_fitness=data.get("overall_fitness", ""),
            comments=data.get("comments", ""),
        )
        return JsonResponse({"message": "Fitness test created!", "id": fitness_test.id}, status=201)

    elif request.method == "PUT" and pk:
        # Update an existing record
        fitness_test = get_object_or_404(FitnessAssessment, pk=pk)
        data = json.loads(request.body)
        fitness_test.emp_no = data.get("emp_no", fitness_test.emp_no)
        fitness_test.tremors = data.get("tremors", fitness_test.tremors)
        fitness_test.romberg_test = data.get("romberg_test", fitness_test.romberg_test)
        fitness_test.acrophobia = data.get("acrophobia", fitness_test.acrophobia)
        fitness_test.trendelenberg_test = data.get("trendelenberg_test", fitness_test.trendelenberg_test)
        fitness_test.job_nature = data.get("job_nature", fitness_test.job_nature)
        fitness_test.overall_fitness = data.get("overall_fitness", fitness_test.overall_fitness)
        fitness_test.comments = data.get("comments", fitness_test.comments)
        fitness_test.save()
        return JsonResponse({"message": "Fitness test updated!"})

    elif request.method == "DELETE" and pk:
        # Delete a record
        fitness_test = get_object_or_404(FitnessAssessment, pk=pk)
        fitness_test.delete()
        return JsonResponse({"message": "Fitness test deleted!"}, status=204)

    return JsonResponse({"error": "Invalid request"}, status=400)

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
# from .models import eventsandcamps # Import your model
from django.core.files.storage import default_storage

ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'pptx', 'ppt']

# @csrf_exempt
# def add_camp(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             print("Data received by backend:", data)

#             # Date parsing
#             start_date_str = data.get("start_date")
#             end_date_str = data.get("end_date")

#             try:
#                 start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
#                 end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
#             except ValueError as e:
#                 return JsonResponse({"error": f"Invalid date format: {e}"}, status=400)

#             camp = eventsandcamps.objects.create(
#                 camp_name=data.get("camp_name"),
#                 start_date=start_date,
#                 end_date=end_date,
#                 camp_details=data.get("camp_details"),
#             )
#             return JsonResponse({"message": "Camp added successfully!", "id": camp.id}, status=201)

#         except Exception as e:
#             print("Error in add_camp view:", e)
#             return JsonResponse({"error": str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request"}, status=400)

# def get_camps(request):
#     if request.method == "GET":
#         search_term = request.GET.get("searchTerm", "")
#         filter_status = request.GET.get("filterStatus", "")
#         date_from_str = request.GET.get("dateFrom", None)
#         date_to_str = request.GET.get("dateTo", None)
#         today = date.today()

#         camps = eventsandcamps.objects.all()

#         if search_term:
#             camps = camps.filter(camp_name__icontains=search_term)

#         if filter_status == "Live":
#             camps = camps.filter(
#                 start_date__lte=today,
#                 end_date__gte=today
#             )
#         elif filter_status and filter_status != "Live":
#             camps = camps.filter(camp_type=filter_status)

#         if date_from_str:
#             try:
#                 date_from = datetime.strptime(date_from_str, "%Y-%m-%d").date()
#                 camps = camps.filter(start_date__gte=date_from)
#             except ValueError:
#                 return JsonResponse({"error": "Invalid dateFrom format"}, status=400)

#         if date_to_str:
#             try:
#                 date_to = datetime.strptime(date_to_str, "%Y-%m-%d").date()
#                 camps = camps.filter(end_date__lte=date_to)
#             except ValueError:
#                 return JsonResponse({"error": "Invalid dateTo format"}, status=400)

#         data = []
#         for camp in camps:
#             camp_data = {
#                 'id': camp.id,
#                 'camp_name': camp.camp_name,
#                 'start_date': str(camp.start_date),
#                 'end_date': str(camp.end_date),
#                 'camp_details': camp.camp_details,
#                 'camp_type': camp.camp_type,
#                 'report1': camp.report1.url if camp.report1 else None,
#                 'report2': camp.report2.url if camp.report2 else None,
#                 'photos': camp.photos.url if camp.photos else None,
#                 'ppt': camp.ppt.url if camp.ppt else None,
#             }
#             data.append(camp_data)

#         return JsonResponse(data, safe=False)

# @csrf_exempt
# def upload_files(request):
#     if request.method == 'POST':
#         camp_id = request.POST.get('campId')
#         file_type = request.POST.get('fileType') #Get file type from request

#         try:
#             camp = eventsandcamps.objects.get(pk=camp_id)
#         except eventsandcamps.DoesNotExist:
#             return JsonResponse({'error': 'Camp not found'}, status=404)

#         file = request.FILES.get('files')

#         if not file:
#             return JsonResponse({'error': 'No file uploaded'}, status=400)

#         file_extension = file.name.split('.')[-1].lower()
#         if file_extension not in ALLOWED_FILE_TYPES:
#             return JsonResponse({'error': 'Invalid file type'}, status=400)
#         old_file = None

#         if file_type == 'report1':
#             old_file = camp.report1
#             camp.report1 = file
#         elif file_type == 'report2':
#             old_file = camp.report2
#             camp.report2 = file
#         elif file_type == 'photos':
#             old_file = camp.photos
#             camp.photos = file
#         elif file_type == 'ppt':
#             old_file = camp.ppt
#             camp.ppt = file
#         else:
#             return JsonResponse({'error': 'Invalid file type'}, status=400)

#         camp.save()

#         if old_file:
#             default_storage.delete(old_file.name)
#          # Return file URL for immediate update on the frontend
#         return JsonResponse({'message': 'File uploaded successfully', 'file_url': camp._getattribute_(file_type).url}, status=200)
#     else:
#         return JsonResponse({"error": "Invalid request method"}, status=400)

# def download_file(request):
#     if request.method == "GET":
#         camp_id = request.GET.get('campId')
#         file_type = request.GET.get('fileType')

#         try:
#             camp = get_object_or_404(eventsandcamps, pk=camp_id)
#         except eventsandcamps.DoesNotExist:
#             return JsonResponse({"error": "Camp not found"}, status=404)

#         file_field = None
#         if file_type == 'report1':
#             file_field = camp.report1
#         elif file_type == 'report2':
#             file_field = camp.report2
#         elif file_type == 'photos':
#             file_field = camp.photos
#         elif file_type == 'ppt':
#             file_field = camp.ppt
#         else:
#             return JsonResponse({"error": "Invalid file type"}, status=400)

#         if not file_field:
#             return JsonResponse({"error": "File not found"}, status=404)

#         try:
#             with open(file_field.path, 'rb') as f:
#                 response = HttpResponse(f.read(), content_type="application/force-download")
#                 response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_field.name)  # Suggest filename
#                 return response

#         except FileNotFoundError:
#             return JsonResponse({"error": "File not found on server"}, status=404)
#         except Exception as e:
#             print("Error during download:", e)
#             return JsonResponse({"error": "Error during download"}, status=500)

#     return JsonResponse({"error": "Invalid request"}, status=400)

# @csrf_exempt
# def delete_file(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             camp_id = data.get('campId')
#             file_type = data.get('fileType')

#             camp = eventsandcamps.objects.get(pk=camp_id)

#             # Determine which file field to clear
#             if file_type == 'report1':
#                 file_field = camp.report1
#                 camp.report1 = None
#             elif file_type == 'report2':
#                 file_field = camp.report2
#                 camp.report2 = None
#             elif file_type == 'photos':
#                 file_field = camp.photos
#                 camp.photos = None
#             elif file_type == 'ppt':
#                 file_field = camp.ppt
#                 camp.ppt = None
#             else:
#                 return JsonResponse({'error': 'Invalid file type'}, status=400)

#             # Delete the file from storage, if it exists
#             if file_field:
#                 default_storage.delete(file_field.name)  # Delete the old file
#             camp.save()  # Save the model to remove the association
#             return JsonResponse({'message': 'File deleted successfully'}, status=200)

#         except eventsandcamps.DoesNotExist:
#             return JsonResponse({'error': 'Camp not found'}, status=404)
#         except Exception as e:
#             print("Error in delete_file view:", e)
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request"}, status=400)


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

            # Create medical history record
            medical_history = models.MedicalHistory.objects.create(
                emp_no=data['emp_no'],
                personal_history=data['personalHistory'],
                medical_data=data['medicalData'],
                female_worker=data['femaleWorker'],
                surgical_history=data['surgicalHistory'],
                family_history=data['familyHistory'],
                health_conditions=data['healthConditions'],
                submission_details=data['submissionDetails'],
                allergy_fields=data['allergyFields'],
                allergy_comments=data['allergyComments'],
                children_data=data['childrenData'],
                conditions=data['conditions']
            )

            logger.info("Medical history created successfully for emp_no: %s", data['emp_no'])
            return JsonResponse({"message": "Medical history created successfully"}, status=201)

        except json.JSONDecodeError:
            logger.error("Invalid JSON data received")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except ValidationError as e:
            logger.error("Validation error: %s", str(e))
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            logger.error("Error creating medical history: %s", str(e))
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)