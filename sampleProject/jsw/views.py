# views.py
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
from .models import eventsandcamps  # Replace with your actual model
from datetime import datetime, timedelta
from .models import Appointment
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Max
import logging
from django.db.models import Count
from datetime import datetime, date
from .models import Dashboard  # Ensure this is your actual model
from .models import FitnessAssessment  # Ensure this is your actual model
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


logger = logging.getLogger(__name__)


@csrf_exempt
def fetchdata(request):
    if request.method == "POST":
        try:
            # Get latest record for each emp_no
            latest_employees = (
                models.employee_details.objects.values("emp_no")
                    .annotate(latest_id=Max("id"))  # Ensure latest record
            )

            latest_employee_ids = [emp["latest_id"] for emp in latest_employees]

            # Fetch only the latest employee records
            employees = list(models.employee_details.objects.filter(id__in=latest_employee_ids).values())

            # Fetch latest records for other tables using emp_no
            def get_latest_records(model):
                return {
                    v["emp_no"]: v
                    for v in model.objects.filter(emp_no__in=[emp["emp_no"] for emp in employees])
                        .values("emp_no")
                        .annotate(latest_id=Max("id"))
                        .values()
                }

            vitals_dict = get_latest_records(models.vitals)
            haematology_dict = get_latest_records(models.heamatalogy)
            routinesugartests_dict = get_latest_records(models.RoutineSugarTests)
            renalfunctiontests_dict = get_latest_records(models.RenalFunctionTest)
            lipidprofile_dict = get_latest_records(models.LipidProfile)
            liverfunctiontest_dict = get_latest_records(models.LiverFunctionTest)
            thyroidfunctiontest_dict = get_latest_records(models.ThyroidFunctionTest)
            coagulationtest_dict = get_latest_records(models.CoagulationTest)
            enzymesandcardiacprofile_dict = get_latest_records(models.EnzymesCardiacProfile)
            urineroutine_dict = get_latest_records(models.UrineRoutineTest)
            serology_dict = get_latest_records(models.SerologyTest)
            motion_dict = get_latest_records(models.MotionTest)
            menspack_dict = get_latest_records(models.MensPack)
            opthalamicreport_dict = get_latest_records(models.OphthalmicReport)
            usg_dict = get_latest_records(models.USGReport)
            mri_dict = get_latest_records(models.MRIReport)
            fitnessassessment_dict = get_latest_records(models.FitnessAssessment)

            # Merge data
            merged_data = []
            for emp in employees:
                emp_no = emp["emp_no"]
                emp["vitals"] = vitals_dict.get(emp_no, {})
                emp["haematology"] = haematology_dict.get(emp_no, {})
                emp["routinesugartests"] = routinesugartests_dict.get(emp_no, {})
                emp["renalfunctiontests_and_electrolytes"] = renalfunctiontests_dict.get(emp_no, {})
                emp["lipidprofile"] = lipidprofile_dict.get(emp_no, {})
                emp["liverfunctiontest"] = liverfunctiontest_dict.get(emp_no, {})
                emp["thyroidfunctiontest"] = thyroidfunctiontest_dict.get(emp_no, {})
                emp["coagulationtest"] = coagulationtest_dict.get(emp_no, {})
                emp["enzymesandcardiacprofile"] = enzymesandcardiacprofile_dict.get(emp_no, {})
                emp["urineroutine"] = urineroutine_dict.get(emp_no, {})
                emp["serology"] = serology_dict.get(emp_no, {})
                emp["motion"] = motion_dict.get(emp_no, {})
                emp["menspack"] = menspack_dict.get(emp_no, {})
                emp["opthalamicreport"] = opthalamicreport_dict.get(emp_no, {})
                emp["usg"] = usg_dict.get(emp_no, {})
                emp["mri"] = mri_dict.get(emp_no, {})
                emp["fitnessassessment"] = fitnessassessment_dict.get(emp_no, {})

                merged_data.append(emp)

            if merged_data:
                return JsonResponse({"data": merged_data}, status=200)
            else:
                return JsonResponse({"message": "Data not found"}, status=404)

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
        print("Hii")
        print(data)
        basicdetails = models.employee_details.objects.create(
            name=data['name'],
            dob=data['dob'],
            sex=data['sex'],
            aadhar=data['aadhar'],
            bloodgrp=data['bloodgrp'],
            identification_marks=data['identification_marks'],
            marital_status=data['marital_status'],
            emp_no=data['emp_no'],
            employer=data['employer'],
            designation=data['designation'],
            department=data['department'],
            job_nature=data['job_nature'],
            doj=data['doj'],
            moj=data['moj'],
            phone_Personal=data['phone_Personal'],
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


@csrf_exempt  # Disable CSRF for this API (for testing; use CSRF token in production)
def BookAppointment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Hi")
            # Create an appointment instance and save it
            appointment = models.Appointment.objects.create(
                role=data.get("role"),
                name=data.get("name"),
                employee_id=data.get("employeeId"),
                organization=data.get("organization"),
                aadhar_no=data.get("aadharNo"),
                contractor_name=data.get("contractorName"),
                purpose=data.get("purpose"),
                appointment_date=data.get("appointmentDate"),
                date=data.get("date"),
                time=data.get("time"),
                booked_by=data.get("bookedBy"),
            )
            print(data.get("role"))

            return JsonResponse(
                {"message": f"Appointment booked successfully for {appointment.name} on {appointment.appointment_date}"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def get_appointments(request):
    if request.method == "GET":
        from_date_str = request.GET.get('fromDate')
        to_date_str = request.GET.get('toDate')

        today = datetime.today().date()

        # Convert string to date format (if provided)
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else None
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else None

        # Fetch appointments based on provided filters using `appointment_date`
        if from_date and to_date:
            appointments = Appointment.objects.filter(
                appointment_date__gte=from_date,
                appointment_date__lte=to_date
            ).order_by('appointment_date', 'time')
        elif from_date:
            appointments = Appointment.objects.filter(
                appointment_date__gte=from_date
            ).order_by('appointment_date', 'time')
        elif to_date:
            appointments = Appointment.objects.filter(
                appointment_date__lte=to_date
            ).order_by('appointment_date', 'time')
        else:
            appointments = Appointment.objects.filter(appointment_date=today).order_by('appointment_date', 'time')

        # Debugging prints
        print(f"Today: {today}")
        print(f"From: {from_date}, To: {to_date}")
        print(f"Query: {appointments.query}")  # Debugging SQL query
        print(f"Results: {list(appointments)}")  # Debugging actual results

        # Convert QuerySet to JSON format
        appointment_list = list(appointments.values())
        return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."})

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def get_appointments(request):
    if request.method == "GET":
        from_date_str = request.GET.get('fromDate')
        to_date_str = request.GET.get('toDate')

        today = datetime.today().date()
        from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date() if from_date_str else None
        to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date() if to_date_str else None

        if from_date and to_date:
            appointments = Appointment.objects.filter(appointment_date__range=[from_date, to_date]).order_by(
                'appointment_date', 'time')
        elif from_date:
            appointments = Appointment.objects.filter(appointment_date__range=[from_date, today]).order_by(
                'appointment_date', 'time')
        elif to_date:
            appointments = Appointment.objects.filter(appointment_date__range=[today, to_date]).order_by(
                'appointment_date', 'time')
        else:
            appointments = Appointment.objects.filter(appointment_date=today).order_by('appointment_date', 'time')

        appointment_list = list(
            appointments.values("id", "employee_id", "name", "role", "appointment_date", "status"))
        return JsonResponse({"appointments": appointment_list, "message": "Appointments fetched successfully."})

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def update_appointment_status(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            appointment_id = data.get("id")  # Get appointment ID
            appointment = Appointment.objects.get(id=appointment_id)  # Fetch by ID

            if appointment.status == "initiate":
                appointment.status = "inprogress"
                appointment.save()
                return JsonResponse({"success": True, "message": "Status updated", "status": "inprogress"})

            return JsonResponse({"success": False, "message": "Cannot update status"})

        except Appointment.DoesNotExist:
            return JsonResponse({"success": False, "message": "Appointment not found"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt  # Disable CSRF for testing; use CSRF token in production
def uploadAppointment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Load JSON data
            print("Received data:", data)  # Debugging: Verify structure

            appointments_data = data.get("appointments", [])
            print(appointments_data)

            for i, appointment_data in enumerate(appointments_data):
                if i == 0:  # Skip header row
                    continue

                try:
                    role = str(appointment_data[1]).strip()
                    name = str(appointment_data[2]).strip()
                    employee_id = str(appointment_data[3]).strip()
                    organization = str(appointment_data[4]).strip()
                    aadhar_no = str(appointment_data[5]).strip()  # Ensure it's a string
                    contractor_name = str(appointment_data[6]).strip()
                    purpose = str(appointment_data[7]).strip()

                    # Check if date is an Excel serial number (integer)
                    def excel_date_to_date(excel_serial):
                        if isinstance(excel_serial, int):
                            return (datetime(1899, 12, 30) + timedelta(days=excel_serial)).date()
                        return datetime.strptime(str(excel_serial).strip(), "%Y-%m-%d").date()

                    appointment_date = excel_date_to_date(appointment_data[8])
                    date = excel_date_to_date(appointment_data[9])

                    # Parse time in 'HH:MM:SS' format
                    time = datetime.strptime(str(appointment_data[10]).strip(), "%H:%M:%S").time()

                    booked_by = str(appointment_data[11]).strip()

                except IndexError as ie:
                    print("Index Error:", str(ie))
                    return JsonResponse({"error": "Data is missing required fields."}, status=400)
                except ValueError as ve:
                    print("Value Error:", str(ve))
                    return JsonResponse({"error": f"Invalid date or time format: {ve}"}, status=400)

                # Create and save the appointment
                Appointment.objects.create(
                    role=role,
                    name=name,
                    employee_id=employee_id,
                    organization=organization,
                    aadhar_no=aadhar_no,
                    contractor_name=contractor_name,
                    purpose=purpose,
                    appointment_date=appointment_date,
                    date=date,
                    time=time,
                    booked_by=booked_by
                )

            return JsonResponse({"message": "Appointments uploaded successfully."})

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


def create_users(request):
    users = [
        {'username': 'nurse', 'password': 'nurse'},
        {'username': 'doctor', 'password': 'doctor'},
        {'username': 'admin', 'password': 'admin'}
    ]

    for user_data in users:
        user = User.objects.get(username=user_data['username'])
        user.set_password(user_data['password'])
        user.save()

    print("Users created successfully.")
    return JsonResponse({"message": "Password updated successfully!"})


@csrf_exempt
def add_camp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            camp = eventsandcamps.objects.create(
                camp_name=data.get("camp_name"),
                start_date=data.get("start_date"),
                end_date=data.get("end_date"),
                camp_details=data.get("camp_details"),
                camp_type=data.get("select_option"),
            )
            return JsonResponse({"message": "Camp added successfully!", "id": camp.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
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

@csrf_exempt
def insert_vaccination(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)  # Debugging

            # Extract data correctly
            vaccine_name = data.get("vaccine")  # Correct key name
            status = data.get("status")

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
        member = Member.objects.create(
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