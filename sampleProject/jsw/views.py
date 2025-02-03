# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from . import models 
import logging
from datetime import datetime


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('name')
            userval = models.user.objects.filter(name=email).first()
            if userval:
                return JsonResponse({"password": userval.password, "accessLevel":userval.accessLevel}, status=200)
            else:
                return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


logger = logging.getLogger(__name__)

@csrf_exempt
def fetchdata(request):
    if request.method == "POST":
        try:
            # Fetch employee details
            employees = list(models.employee_details.objects.values())
            vitals = list(models.vitals.objects.values())  
            haematology = list(models.heamatalogy.objects.values()) if models.heamatalogy.objects.exists() else []
            routinesugartests = list(models.RoutineSugarTests.objects.values()) if models.RoutineSugarTests.objects.exists() else []
            renalfunctiontests = list(models.RenalFunctionTest.objects.values()) if models.RenalFunctionTest.objects.exists() else []
            lipidprofile = list(models.LipidProfile.objects.values()) if models.LipidProfile.objects.exists() else []
            liverfunctiontest = list(models.LiverFunctionTest.objects.values()) if models.LiverFunctionTest.objects.exists() else []
            thyroidfunctiontest = list(models.ThyroidFunctionTest.objects.values()) if models.ThyroidFunctionTest.objects.exists() else []
            coagulationtest = list(models.CoagulationTest.objects.values()) if models.CoagulationTest.objects.exists() else []
            enzymesandcardiacprofile = list(models.EnzymesCardiacProfile.objects.values()) if models.EnzymesCardiacProfile.objects.exists() else []
            urineroutine = list(models.UrineRoutineTest.objects.values()) if models.UrineRoutineTest.objects.exists() else []
            serology = list(models.SerologyTest.objects.values()) if models.SerologyTest.objects.exists() else []
            motion = list(models.MotionTest.objects.values()) if models.MotionTest.objects.exists() else []
            menspack = list(models.MensPack.objects.values()) if models.MensPack.objects.exists() else []
            womenspack = list(models.WomensPack.objects.values()) if models.WomensPack.objects.exists() else []
            occupationalprofile = list(models.OccupationalProfile.objects.values()) if models.OccupationalProfile.objects.exists() else []
            otherstest = list(models.OthersTest.objects.values()) if models.OthersTest.objects.exists() else []
            opthalamicreport = list(models.OphthalmicReport.objects.values()) if models.OphthalmicReport.objects.exists() else []
            xray = list(models.XRayReport.objects.values()) if models.XRayReport.objects.exists() else []
            usg = list(models.USGReport.objects.values()) if models.USGReport.objects.exists() else []
            ct = list(models.CTReport.objects.values()) if models.CTReport.objects.exists() else []
            mri = list(models.MRIReport.objects.values()) if models.MRIReport.objects.exists() else []

            # Convert the lists into dictionaries with emp_no as the key
            vitals_dict = {v["emp_no"]: v for v in vitals}
            haematology_dict = {v["emp_no"]: v for v in haematology}
            routinesugartests_dict = {v["emp_no"]: v for v in routinesugartests}
            renalfunctiontests_dict = {v["emp_no"]: v for v in renalfunctiontests}
            lipidprofile_dict = {v["emp_no"]: v for v in lipidprofile}
            liverfunctiontest_dict = {v["emp_no"]: v for v in liverfunctiontest}
            thyroidfunctiontest_dict = {v["emp_no"]: v for v in thyroidfunctiontest}
            coagulationtest_dict = {v["emp_no"]: v for v in coagulationtest}
            enzymesandcardiacprofile_dict = {v["emp_no"]: v for v in enzymesandcardiacprofile}
            urineroutine_dict = {v["emp_no"]: v for v in urineroutine}
            serology_dict = {v["emp_no"]: v for v in serology}
            motion_dict = {v["emp_no"]: v for v in motion}
            menspack_dict = {v["emp_no"]: v for v in menspack}
            womenspack_dict = {v["emp_no"]: v for v in womenspack}
            occupationalprofile_dict = {v["emp_no"]: v for v in occupationalprofile}
            otherstest_dict = {v["emp_no"]: v for v in otherstest}
            opthalamicreport_dict = {v["emp_no"]: v for v in opthalamicreport}
            xray_dict = {v["emp_no"]: v for v in xray}
            usg_dict = {v["emp_no"]: v for v in usg}
            ct_dict = {v["emp_no"]: v for v in ct}
            mri_dict = {v["emp_no"]: v for v in mri}

            # Merging employee data with the fetched details
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
                emp["womenspack"] = womenspack_dict.get(emp_no, {})
                emp["occupationalprofile"] = occupationalprofile_dict.get(emp_no, {})
                emp["otherstest"] = otherstest_dict.get(emp_no, {})
                emp["opthalamicreport"] = opthalamicreport_dict.get(emp_no, {})
                emp["xray"] = xray_dict.get(emp_no, {})
                emp["usg"] = usg_dict.get(emp_no, {})
                emp["ct"] = ct_dict.get(emp_no, {})
                emp["mri"] = mri_dict.get(emp_no, {})
                merged_data.append(emp)

            if merged_data:
                return JsonResponse({"data": merged_data}, status=200)
            else:
                return JsonResponse({"message": "Data not found"}, status=404)

        except Exception as e:
            logger.error(f"Error in fetchdata view: {str(e)}")  # Log the error for debugging
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# @csrf_exempt  # Disable CSRF for this API (for testing; use CSRF token in production)
# def BookAppointment(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             print("Hi")
#             #Create an appointment instance and save it
#             appointment = models.Appointment.objects.create(
#                 role=data.get("role"),
#                 name=data.get("name"),
#                 employee_id=data.get("employeeId"),
#                 organization=data.get("organization"),
#                 aadhar_no=data.get("aadharNo"),
#                 contractor_name=data.get("contractorName"),
#                 purpose=data.get("purpose"),
#                 appointment_date=data.get("appointmentDate"),
#                 date=data.get("date"),
#                 time=data.get("time"),
#                 booked_by=data.get("bookedBy"),
#             )
#             print(data.get("role"))

#             return JsonResponse({"message": f"Appointment booked successfully for {appointment.name} on {appointment.appointment_date}"})

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request"}, status=400)


# @csrf_exempt  # Disable CSRF for testing; use CSRF token in production
# def uploadAppointment(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)  # Load JSON data
#             print("Received data:", data)  # Debugging: Verify structure

#             appointments_data = data.get("appointments", [])
#             print(appointments_data)

#             for i, appointment_data in enumerate(appointments_data):
#                 if i == 0:  # Skip header row
#                     continue  

#                 try:
#                     role = appointment_data[1].strip()
#                     name = appointment_data[2].strip()
#                     employee_id = appointment_data[3].strip()
#                     organization = appointment_data[4].strip()
#                     aadhar_no = str(appointment_data[5]).strip()  # Ensure it's a string
#                     contractor_name = appointment_data[6].strip()
#                     purpose = appointment_data[7].strip()

#                     # Parse date in 'YYYY-MM-DD' format
#                     appointment_date = datetime.strptime(appointment_data[8].strip(), "%Y-%m-%d").date()
#                     date = datetime.strptime(appointment_data[9].strip(), "%Y-%m-%d").date()

#                     # Parse time in 'HH:MM:SS' format
#                     time = datetime.strptime(appointment_data[10].strip(), "%H:%M:%S").time()

#                     booked_by = appointment_data[11].strip()

#                 except IndexError as ie:
#                     print("Index Error:", str(ie))
#                     return JsonResponse({"error": "Data is missing required fields."}, status=400)
#                 except ValueError as ve:
#                     print("Value Error:", str(ve))
#                     return JsonResponse({"error": f"Invalid date or time format: {ve}"}, status=400)

#                 # Create and save the appointment
#                 models.Appointment.objects.create(
#                     role=role,
#                     name=name,
#                     employee_id=employee_id,
#                     organization=organization,
#                     aadhar_no=aadhar_no,
#                     contractor_name=contractor_name,
#                     purpose=purpose,
#                     appointment_date=appointment_date,
#                     date=date,
#                     time=time,
#                     booked_by=booked_by
#                 )

#             return JsonResponse({"message": "Appointments uploaded successfully."})

#         except Exception as e:
#             print("Error:", str(e))
#             return JsonResponse({"error": str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request"}, status=400)



# @api_view(['GET'])
# def get_appointments(request):
#     date_filter = request.GET.get('date')
#     if date_filter:
#         appointments = Appointment.objects.filter(date=date_filter).order_by('date', 'time')
       
#     else:
#         appointments = Appointment.objects.all().order_by('date')
    
#     serializer = AppointmentSerializer(appointments, many=True)
#     # print(appointments)
#     return Response(serializer.data)