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
from .models import eventsandcamps # Replace with your actual model
from datetime import datetime, timedelta
from .models import Appointment
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Max 
import logging

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
def addbasicdetails(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        print("Basic Details:" ,data['name'])
        print("Vitals: ", data['vitals']['emp_no'])
        print("Motion Test", data['motion']['emp_no'])
        #print("CSTest", data.keys())
        print("Mens Pack", data['menspack']['emp_no'])
        # basicdetails = models.employee_details.objects.create(
        #     name = data['name'],
        #     dob= data['dob'],
        #     sex= data['sex'],
        #     aadhar= data['aadhar'],
        #     bloodgrp= data['bloodgrp'],
        #     identification_marks= data['identification_marks'],
        #     marital_status= data['marital_status'],
        #     emp_no= data['emp_no'],
        #     employer= data['employer'],
        #     designation= data['designation'],
        #     department= data['department'],
        #     job_nature= data['job_nature'],
        #     doj= data['doj'],
        #     moj= data['moj'],
        #     phone_Personal= data['phone_Personal'],
        #     mail_id_Personal= data['mail_id_Personal'],
        #     emergency_contact_person= data['emergency_contact_person'],
        #     phone_Office= data['phone_Office'],
        #     mail_id_Office= data['mail_id_Office'],
        #     emergency_contact_relation= data['emergency_contact_relation'],
        #     mail_id_Emergency_Contact_Person= data['mail_id_Emergency_Contact_Person'],
        #     emergency_contact_phone= data['emergency_contact_phone'],
        #     address= data['address'],
        # )
        # vital_details = models.vitals.objects.create(
        #     emp_no=data['vitals']['emp_no'],
        #     systolic=data['vitals']['systolic'],
        #     diastolic=data['vitals']['diastolic'],
        #     pulse=data['vitals']['pulse'],
        #     respiratory_rate=data['vitals']['respiratory_rate'],
        #     temperature=data['vitals']['temperature'],
        #     spO2=data['vitals']['spO2'],
        #     weight=data['vitals']['weight'],
        #     height=data['vitals']['height'],
        #     bmi=data['vitals']['bmi']
        # )
          
        # motion_test = models.MotionTest.objects.create(
        #     emp_no=data['motion']['emp_no'],
        #     colour_motion=data['motion']['colour_motion'],
        #     colour_motion_unit=data['motion']['colour_motion_unit'],
        #     colour_motion_reference_range=data['motion']['colour_motion_reference_range'],
        #     colour_motion_comments=data['motion']['colour_motion_comments'],
            
        #     appearance_motion=data['motion']['appearance_motion'],
        #     appearance_motion_unit=data['motion']['appearance_motion_unit'],
        #     appearance_motion_reference_range=data['motion']['appearance_motion_reference_range'],
        #     appearance_motion_comments=data['motion']['appearance_motion_comments'],
            
        #     occult_blood=data['motion']['occult_blood'],
        #     occult_blood_unit=data['motion']['occult_blood_unit'],
        #     occult_blood_reference_range=data['motion']['occult_blood_reference_range'],
        #     occult_blood_comments=data['motion']['occult_blood_comments'],
            
        #     cyst=data['motion']['cyst'],
        #     cyst_unit=data['motion']['cyst_unit'],
        #     cyst_reference_range=data['motion']['cyst_reference_range'],
        #     cyst_comments=data['motion']['cyst_comments'],
            
        #     mucus=data['motion']['mucus'],
        #     mucus_unit=data['motion']['mucus_unit'],
        #     mucus_reference_range=data['motion']['mucus_reference_range'],
        #     mucus_comments=data['motion']['mucus_comments'],
            
        #     pus_cells=data['motion']['pus_cells'],
        #     pus_cells_unit=data['motion']['pus_cells_unit'],
        #     pus_cells_reference_range=data['motion']['pus_cells_reference_range'],
        #     pus_cells_comments=data['motion']['pus_cells_comments'],
            
        #     ova=data['motion']['ova'],
        #     ova_unit=data['motion']['ova_unit'],
        #     ova_reference_range=data['motion']['ova_reference_range'],
        #     ova_comments=data['motion']['ova_comments'],
            
        #     rbcs=data['motion']['rbcs'],
        #     rbcs_unit=data['motion']['rbcs_unit'],
        #     rbcs_reference_range=data['motion']['rbcs_reference_range'],
        #     rbcs_comments=data['motion']['rbcs_comments'],
            
        #     others=data['motion']['others'],
        #     others_unit=data['motion']['others_unit'],
        #     others_reference_range=data['motion']['others_reference_range'],
        #     others_comments=data['motion']['others_comments']
        # )

        # culture_sensitivity_test = CultureSensitivityTest.objects.create(
        #     emp_no=data['emp_no'],
        #     urine=data['urine'],
        #     urine_unit=data['urine_unit'],
        #     urine_reference_range=data['urine_reference_range'],
        #     urine_comments=data['urine_comments'],
            
        #     motion=data['motion'],
        #     motion_unit=data['motion_unit'],
        #     motion_reference_range=data['motion_reference_range'],
        #     motion_comments=data['motion_comments'],
            
        #     sputum=data['sputum'],
        #     sputum_unit=data['sputum_unit'],
        #     sputum_reference_range=data['sputum_reference_range'],
        #     sputum_comments=data['sputum_comments'],
            
        #     blood=data['blood'],
        #     blood_unit=data['blood_unit'],
        #     blood_reference_range=data['blood_reference_range'],
        #     blood_comments=data['blood_comments']
        # )

        # mens_pack = models.MensPack.objects.create(
        #     emp_no=data['menspack']['emp_no'],
        #     psa=data['menspack']['psa'],
        #     psa_unit=data['menspack']['psa_unit'],
        #     psa_reference_range=data['menspack']['psa_reference_range'],
        #     psa_comments=data['menspack']['psa_comments']
        # )


        # ophthalmic_report = models.OphthalmicReport.objects.create(
        #     emp_no=data['opthalamicreport']['emp_no'],
        #     vision=data['opthalamicreport']['vision'],
        #     vision_unit=data['opthalamicreport']['vision_unit'],
        #     vision_reference_range=data['opthalamicreport']['vision_reference_range'],
        #     vision_comments=data['opthalamicreport']['vision_comments'],
            
        #     color_vision=data['opthalamicreport']['color_vision'],
        #     color_vision_unit=data['opthalamicreport']['color_vision_unit'],
        #     color_vision_reference_range=data['opthalamicreport']['color_vision_reference_range'],
        #     color_vision_comments=data['opthalamicreport']['color_vision_comments']
        # )
        # print("OP Report")
        # usg_report = models.USGReport.objects.create(
        #     emp_no=data['usg']['emp_no'],
        #     usg_abdomen=data['usg']['usg_abdomen'],
        #     usg_abdomen_unit=data['usg']['usg_abdomen_unit'],
        #     usg_abdomen_reference_range=data['usg']['usg_abdomen_reference_range'],
        #     usg_abdomen_comments=data['usg']['usg_abdomen_comments'],
            
        #     usg_kub=data['usg']['usg_kub'],
        #     usg_kub_unit=data['usg']['usg_kub_unit'],
        #     usg_kub_reference_range=data['usg']['usg_kub_reference_range'],
        #     usg_kub_comments=data['usg']['usg_kub_comments'],
            
        #     usg_pelvis=data['usg']['usg_pelvis'],
        #     usg_pelvis_unit=data['usg']['usg_pelvis_unit'],
        #     usg_pelvis_reference_range=data['usg']['usg_pelvis_reference_range'],
        #     usg_pelvis_comments=data['usg']['usg_pelvis_comments'],
            
        #     usg_neck=data['usg']['usg_neck'],
        #     usg_neck_unit=data['usg']['usg_neck_unit'],
        #     usg_neck_reference_range=data['usg']['usg_neck_reference_range'],
        #     usg_neck_comments=data['usg']['usg_neck_comments']
        # )
        # print("usg_report")
        # mri_report = models.MRIReport.objects.create(
        #     emp_no=data['mri']['emp_no'],
        #     mri_brain=data['mri']['mri_brain'],
        #     mri_brain_unit=data['mri']['mri_brain_unit'],
        #     mri_brain_reference_range=data['mri']['mri_brain_reference_range'],
        #     mri_brain_comments=data['mri']['mri_brain_comments'],
            
        #     mri_lungs=data['mri']['mri_lungs'],
        #     mri_lungs_unit=data['mri']['mri_lungs_unit'],
        #     mri_lungs_reference_range=data['mri']['mri_lungs_reference_range'],
        #     mri_lungs_comments=data['mri']['mri_lungs_comments'],
            
        #     mri_abdomen=data['mri']['mri_abdomen'],
        #     mri_abdomen_unit=data['mri']['mri_abdomen_unit'],
        #     mri_abdomen_reference_range=data['mri']['mri_abdomen_reference_range'],
        #     mri_abdomen_comments=data['mri']['mri_abdomen_comments'],
            
        #     mri_spine=data['mri']['mri_spine'],
        #     mri_spine_unit=data['mri']['mri_spine_unit'],
        #     mri_spine_reference_range=data['mri']['mri_spine_reference_range'],
        #     mri_spine_comments=data['mri']['mri_spine_comments'],
            
        #     mri_pelvis=data['mri']['mri_pelvis'],
        #     mri_pelvis_unit=data['mri']['mri_pelvis_unit'],
        #     mri_pelvis_reference_range=data['mri']['mri_pelvis_reference_range'],
        #     mri_pelvis_comments=data['mri']['mri_pelvis_comments']
        # )
        # print('MRI')


        heamatalogy_details = models.heamatalogy.objects.create(
            emp_no=data['haematology']['emp_no'],
            hemoglobin=data['haematology']['hemoglobin'],
            hemoglobin_unit=data['haematology']['hemoglobin_unit'],
            hemoglobin_reference_range=data['haematology']['hemoglobin_reference_range'],
            hemoglobin_comments=data['haematology']['hemoglobin_comments'],

            total_rbc=data['haematology']['total_rbc'],
            total_rbc_unit=data['haematology']['total_rbc_unit'],
            total_rbc_reference_range=data['haematology']['total_rbc_reference_range'],
            total_rbc_comments=data['haematology']['total_rbc_comments'],

            total_wbc=data['haematology']['total_wbc'],
            total_wbc_unit=data['haematology']['total_wbc_unit'],
            total_wbc_reference_range=data['haematology']['total_wbc_reference_range'],
            total_wbc_comments=data['haematology']['total_wbc_comments'],

            neutrophil=data['haematology']['neutrophil'],
            neutrophil_unit=data['haematology']['neutrophil_unit'],
            neutrophil_reference_range=data['haematology']['neutrophil_reference_range'],
            neutrophil_comments=data['haematology']['neutrophil_comments'],

            monocyte=data['haematology']['monocyte'],
            monocyte_unit=data['haematology']['monocyte_unit'],
            monocyte_reference_range=data['haematology']['monocyte_reference_range'],
            monocyte_comments=data['haematology']['monocyte_comments'],

            pcv=data['haematology']['pcv'],
            pcv_unit=data['haematology']['pcv_unit'],
            pcv_reference_range=data['haematology']['pcv_reference_range'],
            pcv_comments=data['haematology']['pcv_comments'],

            mcv=data['haematology']['mcv'],
            mcv_unit=data['haematology']['mcv_unit'],
            mcv_reference_range=data['haematology']['mcv_reference_range'],
            mcv_comments=data['haematology']['mcv_comments'],

            mch=data['haematology']['mch'],
            mch_unit=data['haematology']['mch_unit'],
            mch_reference_range=data['haematology']['mch_reference_range'],
            mch_comments=data['haematology']['mch_comments'],

            lymphocyte=data['haematology']['lymphocyte'],
            lymphocyte_unit=data['haematology']['lymphocyte_unit'],
            lymphocyte_reference_range=data['haematology']['lymphocyte_reference_range'],
            lymphocyte_comments=data['haematology']['lymphocyte_comments'],

            esr=data['haematology']['esr'],
            esr_unit=data['haematology']['esr_unit'],
            esr_reference_range=data['haematology']['esr_reference_range'],
            esr_comments=data['haematology']['esr_comments'],

            mchc=data['haematology']['mchc'],
            mchc_unit=data['haematology']['mchc_unit'],
            mchc_reference_range=data['haematology']['mchc_reference_range'],
            mchc_comments=data['haematology']['mchc_comments'],

            platelet_count=data['haematology']['platelet_count'],
            platelet_count_unit=data['haematology']['platelet_count_unit'],
            platelet_count_reference_range=data['haematology']['platelet_count_reference_range'],
            platelet_count_comments=data['haematology']['platelet_count_comments'],

            rdw=data['haematology']['rdw'],
            rdw_unit=data['haematology']['rdw_unit'],
            rdw_reference_range=data['haematology']['rdw_reference_range'],
            rdw_comments=data['haematology']['rdw_comments'],

            eosinophil=data['haematology']['eosinophil'],
            eosinophil_unit=data['haematology']['eosinophil_unit'],
            eosinophil_reference_range=data['haematology']['eosinophil_reference_range'],
            eosinophil_comments=data['haematology']['eosinophil_comments'],

            basophil=data['haematology']['basophil'],
            basophil_unit=data['haematology']['basophil_unit'],
            basophil_reference_range=data['haematology']['basophil_reference_range'],
            basophil_comments=data['haematology']['basophil_comments'],

            peripheral_blood_smear_rbc_morphology=data['haematology']['peripheral_blood_smear_rbc_morphology'],
            peripheral_blood_smear_parasites=data['haematology']['peripheral_blood_smear_parasites'],
            peripheral_blood_smear_others=data['haematology']['peripheral_blood_smear_others']
        )

        routine_sugar_details = models.RoutineSugarTests.objects.create(
            emp_no=data['routinesugartests']['emp_no'],
            glucose_f=data['routinesugartests']['glucose_f'],
            glucose_f_unit=data['routinesugartests']['glucose_f_unit'],
            glucose_f_reference_range=data['routinesugartests']['glucose_f_reference_range'],
            glucose_f_comments=data['routinesugartests']['glucose_f_comments'],

            glucose_pp=data['routinesugartests']['glucose_pp'],
            glucose_pp_unit=data['routinesugartests']['glucose_pp_unit'],
            glucose_pp_reference_range=data['routinesugartests']['glucose_pp_reference_range'],
            glucose_pp_comments=data['routinesugartests']['glucose_pp_comments'],

            random_blood_sugar=data['routinesugartests']['random_blood_sugar'],
            random_blood_sugar_unit=data['routinesugartests']['random_blood_sugar_unit'],
            random_blood_sugar_reference_range=data['routinesugartests']['random_blood_sugar_reference_range'],
            random_blood_sugar_comments=data['routinesugartests']['random_blood_sugar_comments'],

            estimated_average_glucose=data['routinesugartests']['estimated_average_glucose'],
            estimated_average_glucose_unit=data['routinesugartests']['estimated_average_glucose_unit'],
            estimated_average_glucose_reference_range=data['routinesugartests']['estimated_average_glucose_reference_range'],
            estimated_average_glucose_comments=data['routinesugartests']['estimated_average_glucose_comments'],

            hba1c=data['routinesugartests']['hba1c'],
            hba1c_unit=data['routinesugartests']['hba1c_unit'],
            hba1c_reference_range=data['routinesugartests']['hba1c_reference_range'],
            hba1c_comments=data['routinesugartests']['hba1c_comments']
        )

        renal_function_test = models.RenalFunctionTest.objects.create(
            emp_no=data['renalfunctiontests_and_electrolytes']['emp_no'],
            urea=data['renalfunctiontests_and_electrolytes']['urea'],
            urea_unit=data['renalfunctiontests_and_electrolytes']['urea_unit'],
            urea_reference_range=data['renalfunctiontests_and_electrolytes']['urea_reference_range'],
            urea_comments=data['renalfunctiontests_and_electrolytes']['urea_comments'],

            bun=data['renalfunctiontests_and_electrolytes']['bun'],
            bun_unit=data['renalfunctiontests_and_electrolytes']['bun_unit'],
            bun_reference_range=data['renalfunctiontests_and_electrolytes']['bun_reference_range'],
            bun_comments=data['renalfunctiontests_and_electrolytes']['bun_comments'],

            calcium=data['renalfunctiontests_and_electrolytes']['calcium'],
            calcium_unit=data['renalfunctiontests_and_electrolytes']['calcium_unit'],
            calcium_reference_range=data['renalfunctiontests_and_electrolytes']['calcium_reference_range'],
            calcium_comments=data['renalfunctiontests_and_electrolytes']['calcium_comments'],

            sodium=data['renalfunctiontests_and_electrolytes']['sodium'],
            sodium_unit=data['renalfunctiontests_and_electrolytes']['sodium_unit'],
            sodium_reference_range=data['renalfunctiontests_and_electrolytes']['sodium_reference_range'],
            sodium_comments=data['renalfunctiontests_and_electrolytes']['sodium_comments'],

            potassium=data['renalfunctiontests_and_electrolytes']['potassium'],
            potassium_unit=data['renalfunctiontests_and_electrolytes']['potassium_unit'],
            potassium_reference_range=data['renalfunctiontests_and_electrolytes']['potassium_reference_range'],
            potassium_comments=data['renalfunctiontests_and_electrolytes']['potassium_comments'],

            phosphorus=data['renalfunctiontests_and_electrolytes']['phosphorus'],
            phosphorus_unit=data['renalfunctiontests_and_electrolytes']['phosphorus_unit'],
            phosphorus_reference_range=data['renalfunctiontests_and_electrolytes']['phosphorus_reference_range'],
            phosphorus_comments=data['renalfunctiontests_and_electrolytes']['phosphorus_comments'],

            serum_creatinine=data['renalfunctiontests_and_electrolytes']['serum_creatinine'],
            serum_creatinine_unit=data['renalfunctiontests_and_electrolytes']['serum_creatinine_unit'],
            serum_creatinine_reference_range=data['renalfunctiontests_and_electrolytes']['serum_creatinine_reference_range'],
            serum_creatinine_comments=data['renalfunctiontests_and_electrolytes']['serum_creatinine_comments'],

            uric_acid=data['renalfunctiontests_and_electrolytes']['uric_acid'],
            uric_acid_unit=data['renalfunctiontests_and_electrolytes']['uric_acid_unit'],
            uric_acid_reference_range=data['renalfunctiontests_and_electrolytes']['uric_acid_reference_range'],
            uric_acid_comments=data['renalfunctiontests_and_electrolytes']['uric_acid_comments'],

            chloride=data['renalfunctiontests_and_electrolytes']['chloride'],
            chloride_unit=data['renalfunctiontests_and_electrolytes']['chloride_unit'],
            chloride_reference_range=data['renalfunctiontests_and_electrolytes']['chloride_reference_range'],
            chloride_comments=data['renalfunctiontests_and_electrolytes']['chloride_comments']
        )

        print(heamatalogy_details)
        print(routine_sugar_details)
        print(renal_function_test)

        lipid_profile = models.LipidProfile.objects.create(
            emp_no=data['lipidprofile']['emp_no'],
            calcium=data['lipidprofile']['calcium'],
            calcium_unit=data['lipidprofile']['calcium_unit'],
            calcium_reference_range=data['lipidprofile']['calcium_reference_range'],
            calcium_comments=data['lipidprofile']['calcium_comments'],

            triglycerides=data['lipidprofile']['triglycerides'],
            triglycerides_unit=data['lipidprofile']['triglycerides_unit'],
            triglycerides_reference_range=data['lipidprofile']['triglycerides_reference_range'],
            triglycerides_comments=data['lipidprofile']['triglycerides_comments'],

            hdl_cholesterol=data['lipidprofile']['hdl_cholesterol'],
            hdl_cholesterol_unit=data['lipidprofile']['hdl_cholesterol_unit'],
            hdl_cholesterol_reference_range=data['lipidprofile']['hdl_cholesterol_reference_range'],
            hdl_cholesterol_comments=data['lipidprofile']['hdl_cholesterol_comments'],

            ldl_cholesterol=data['lipidprofile']['ldl_cholesterol'],
            ldl_cholesterol_unit=data['lipidprofile']['ldl_cholesterol_unit'],
            ldl_cholesterol_reference_range=data['lipidprofile']['ldl_cholesterol_reference_range'],
            ldl_cholesterol_comments=data['lipidprofile']['ldl_cholesterol_comments'],

            chol_hdl_ratio=data['lipidprofile']['chol_hdl_ratio'],
            chol_hdl_ratio_unit=data['lipidprofile']['chol_hdl_ratio_unit'],
            chol_hdl_ratio_reference_range=data['lipidprofile']['chol_hdl_ratio_reference_range'],
            chol_hdl_ratio_comments=data['lipidprofile']['chol_hdl_ratio_comments'],

            vldl_cholesterol=data['lipidprofile']['vldl_cholesterol'],
            vldl_cholesterol_unit=data['lipidprofile']['vldl_cholesterol_unit'],
            vldl_cholesterol_reference_range=data['lipidprofile']['vldl_cholesterol_reference_range'],
            vldl_cholesterol_comments=data['lipidprofile']['vldl_cholesterol_comments'],

            ldl_hdl_ratio=data['lipidprofile']['ldl_hdl_ratio'],
            ldl_hdl_ratio_unit=data['lipidprofile']['ldl_hdl_ratio_unit'],
            ldl_hdl_ratio_reference_range=data['lipidprofile']['ldl_hdl_ratio_reference_range'],
            ldl_hdl_ratio_comments=data['lipidprofile']['ldl_hdl_ratio_comments']
        )
        print("Lipid Profile")
        liver_function_test = models.LiverFunctionTest.objects.create(
            emp_no=data['liverfunctiontest']['emp_no'],
            bilirubin_total=data['liverfunctiontest']['bilirubin_total'],
            bilirubin_total_unit=data['liverfunctiontest']['bilirubin_total_unit'],
            bilirubin_total_reference_range=data['liverfunctiontest']['bilirubin_total_reference_range'],
            bilirubin_total_comments=data['liverfunctiontest']['bilirubin_total_comments'],

            bilirubin_direct=data['liverfunctiontest']['bilirubin_direct'],
            bilirubin_direct_unit=data['liverfunctiontest']['bilirubin_direct_unit'],
            bilirubin_direct_reference_range=data['liverfunctiontest']['bilirubin_direct_reference_range'],
            bilirubin_direct_comments=data['liverfunctiontest']['bilirubin_direct_comments'],

            bilirubin_indirect=data['liverfunctiontest']['bilirubin_indirect'],
            bilirubin_indirect_unit=data['liverfunctiontest']['bilirubin_indirect_unit'],
            bilirubin_indirect_reference_range=data['liverfunctiontest']['bilirubin_indirect_reference_range'],
            bilirubin_indirect_comments=data['liverfunctiontest']['bilirubin_indirect_comments'],

            sgot_ast=data['liverfunctiontest']['sgot_ast'],
            sgot_ast_unit=data['liverfunctiontest']['sgot_ast_unit'],
            sgot_ast_reference_range=data['liverfunctiontest']['sgot_ast_reference_range'],
            sgot_ast_comments=data['liverfunctiontest']['sgot_ast_comments'],

            sgpt_alt=data['liverfunctiontest']['sgpt_alt'],
            sgpt_alt_unit=data['liverfunctiontest']['sgpt_alt_unit'],
            sgpt_alt_reference_range=data['liverfunctiontest']['sgpt_alt_reference_range'],
            sgpt_alt_comments=data['liverfunctiontest']['sgpt_alt_comments'],

            alkaline_phosphatase=data['liverfunctiontest']['alkaline_phosphatase'],
            alkaline_phosphatase_unit=data['liverfunctiontest']['alkaline_phosphatase_unit'],
            alkaline_phosphatase_reference_range=data['liverfunctiontest']['alkaline_phosphatase_reference_range'],
            alkaline_phosphatase_comments=data['liverfunctiontest']['alkaline_phosphatase_comments'],

            total_protein=data['liverfunctiontest']['total_protein'],
            total_protein_unit=data['liverfunctiontest']['total_protein_unit'],
            total_protein_reference_range=data['liverfunctiontest']['total_protein_reference_range'],
            total_protein_comments=data['liverfunctiontest']['total_protein_comments'],

            albumin_serum=data['liverfunctiontest']['albumin_serum'],
            albumin_serum_unit=data['liverfunctiontest']['albumin_serum_unit'],
            albumin_serum_reference_range=data['liverfunctiontest']['albumin_serum_reference_range'],
            albumin_serum_comments=data['liverfunctiontest']['albumin_serum_comments'],

            globulin_serum=data['liverfunctiontest']['globulin_serum'],
            globulin_serum_unit=data['liverfunctiontest']['globulin_serum_unit'],
            globulin_serum_reference_range=data['liverfunctiontest']['globulin_serum_reference_range'],
            globulin_serum_comments=data['liverfunctiontest']['globulin_serum_comments'],

            alb_glob_ratio=data['liverfunctiontest']['alb_glob_ratio'],
            alb_glob_ratio_unit=data['liverfunctiontest']['alb_glob_ratio_unit'],
            alb_glob_ratio_reference_range=data['liverfunctiontest']['alb_glob_ratio_reference_range'],
            alb_glob_ratio_comments=data['liverfunctiontest']['alb_glob_ratio_comments'],

            gamma_glutamyl_transferase=data['liverfunctiontest']['gamma_glutamyl_transferase'],
            gamma_glutamyl_transferase_unit=data['liverfunctiontest']['gamma_glutamyl_transferase_unit'],
            gamma_glutamyl_transferase_reference_range=data['liverfunctiontest']['gamma_glutamyl_transferase_reference_range'],
            gamma_glutamyl_transferase_comments=data['liverfunctiontest']['gamma_glutamyl_transferase_comments']
        )
        print("LFT")
        thyroid_function_test = models.ThyroidFunctionTest.objects.create(
            emp_no=data['thyroidfunctiontest']['emp_no'],
            t3_triiodothyronine=data['thyroidfunctiontest']['t3_triiodothyronine'],
            t3_unit=data['thyroidfunctiontest']['t3_unit'],
            t3_reference_range=data['thyroidfunctiontest']['t3_reference_range'],
            t3_comments=data['thyroidfunctiontest']['t3_comments'],

            t4_thyroxine=data['thyroidfunctiontest']['t4_thyroxine'],
            t4_unit=data['thyroidfunctiontest']['t4_unit'],
            t4_reference_range=data['thyroidfunctiontest']['t4_reference_range'],
            t4_comments=data['thyroidfunctiontest']['t4_comments'],

            tsh_thyroid_stimulating_hormone=data['thyroidfunctiontest']['tsh_thyroid_stimulating_hormone'],
            tsh_unit=data['thyroidfunctiontest']['tsh_unit'],
            tsh_reference_range=data['thyroidfunctiontest']['tsh_reference_range'],
            tsh_comments=data['thyroidfunctiontest']['tsh_comments']
        )
        print("Thyroid FT")

        coagulation_test = models.CoagulationTest.objects.create(
            emp_no=data['coagulationtest']['emp_no'],
            prothrombin_time=data['coagulationtest']['prothrombin_time'],
            prothrombin_time_unit=data['coagulationtest']['prothrombin_time_unit'],
            prothrombin_time_reference_range=data['coagulationtest']['prothrombin_time_reference_range'],
            prothrombin_time_comments=data['coagulationtest']['prothrombin_time_comments'],

            pt_inr=data['coagulationtest']['pt_inr'],
            pt_inr_unit=data['coagulationtest']['pt_inr_unit'],
            pt_inr_reference_range=data['coagulationtest']['pt_inr_reference_range'],
            pt_inr_comments=data['coagulationtest']['pt_inr_comments'],

            clotting_time=data['coagulationtest']['clotting_time'],
            clotting_time_unit=data['coagulationtest']['clotting_time_unit'],
            clotting_time_reference_range=data['coagulationtest']['clotting_time_reference_range'],
            clotting_time_comments=data['coagulationtest']['clotting_time_comments'],

            bleeding_time=data['coagulationtest']['bleeding_time'],
            bleeding_time_unit=data['coagulationtest']['bleeding_time_unit'],
            bleeding_time_reference_range=data['coagulationtest']['bleeding_time_reference_range'],
            bleeding_time_comments=data['coagulationtest']['bleeding_time_comments']
        )
        print("Coagulation Test")

        enzymes_cardiac_profile = models.EnzymesCardiacProfile.objects.create(
            emp_no=data['enzymesandcardiacprofile']['emp_no'],
            acid_phosphatase=data['enzymesandcardiacprofile']['acid_phosphatase'],
            acid_phosphatase_unit=data['enzymesandcardiacprofile']['acid_phosphatase_unit'],
            acid_phosphatase_reference_range=data['enzymesandcardiacprofile']['acid_phosphatase_reference_range'],
            acid_phosphatase_comments=data['enzymesandcardiacprofile']['acid_phosphatase_comments'],

            adenosine_deaminase=data['enzymesandcardiacprofile']['adenosine_deaminase'],
            adenosine_deaminase_unit=data['enzymesandcardiacprofile']['adenosine_deaminase_unit'],
            adenosine_deaminase_reference_range=data['enzymesandcardiacprofile']['adenosine_deaminase_reference_range'],
            adenosine_deaminase_comments=data['enzymesandcardiacprofile']['adenosine_deaminase_comments'],

            amylase=data['enzymesandcardiacprofile']['amylase'],
            amylase_unit=data['enzymesandcardiacprofile']['amylase_unit'],
            amylase_reference_range=data['enzymesandcardiacprofile']['amylase_reference_range'],
            amylase_comments=data['enzymesandcardiacprofile']['amylase_comments'],

            ecg=data['enzymesandcardiacprofile']['ecg'],
            ecg_unit=data['enzymesandcardiacprofile']['ecg_unit'],
            ecg_reference_range=data['enzymesandcardiacprofile']['ecg_reference_range'],
            ecg_comments=data['enzymesandcardiacprofile']['ecg_comments'],

            troponin_t=data['enzymesandcardiacprofile']['troponin_t'],
            troponin_t_unit=data['enzymesandcardiacprofile']['troponin_t_unit'],
            troponin_t_reference_range=data['enzymesandcardiacprofile']['troponin_t_reference_range'],
            troponin_t_comments=data['enzymesandcardiacprofile']['troponin_t_comments'],

            cpk_total=data['enzymesandcardiacprofile']['cpk_total'],
            cpk_total_unit=data['enzymesandcardiacprofile']['cpk_total_unit'],
            cpk_total_reference_range=data['enzymesandcardiacprofile']['cpk_total_reference_range'],
            cpk_total_comments=data['enzymesandcardiacprofile']['cpk_total_comments'],

            echo=data['enzymesandcardiacprofile']['echo'],
            echo_unit=data['enzymesandcardiacprofile']['echo_unit'],
            echo_reference_range=data['enzymesandcardiacprofile']['echo_reference_range'],
            echo_comments=data['enzymesandcardiacprofile']['echo_comments'],

            lipase=data['enzymesandcardiacprofile']['lipase'],
            lipase_unit=data['enzymesandcardiacprofile']['lipase_unit'],
            lipase_reference_range=data['enzymesandcardiacprofile']['lipase_reference_range'],
            lipase_comments=data['enzymesandcardiacprofile']['lipase_comments'],

            cpk_mb=data['enzymesandcardiacprofile']['cpk_mb'],
            cpk_mb_unit=data['enzymesandcardiacprofile']['cpk_mb_unit'],
            cpk_mb_reference_range=data['enzymesandcardiacprofile']['cpk_mb_reference_range'],
            cpk_mb_comments=data['enzymesandcardiacprofile']['cpk_mb_comments'],

            tmt_normal=data['enzymesandcardiacprofile']['tmt_normal'],
            tmt_normal_unit=data['enzymesandcardiacprofile']['tmt_normal_unit'],
            tmt_normal_reference_range=data['enzymesandcardiacprofile']['tmt_normal_reference_range'],
            tmt_normal_comments=data['enzymesandcardiacprofile']['tmt_normal_comments']
        )
        print("Enzymes")

        urine_routine_test = models.UrineRoutineTest.objects.create(
            emp_no=data['urineroutine']['emp_no'],
            colour=data['urineroutine']['colour'],
            colour_unit=data['urineroutine']['colour_unit'],
            colour_reference_range=data['urineroutine']['colour_reference_range'],
            colour_comments=data['urineroutine']['colour_comments'],

            appearance=data['urineroutine']['appearance'],
            appearance_unit=data['urineroutine']['appearance_unit'],
            appearance_reference_range=data['urineroutine']['appearance_reference_range'],
            appearance_comments=data['urineroutine']['appearance_comments'],

            reaction_ph=data['urineroutine']['reaction_ph'],
            reaction_ph_unit=data['urineroutine']['reaction_ph_unit'],
            reaction_ph_reference_range=data['urineroutine']['reaction_ph_reference_range'],
            reaction_ph_comments=data['urineroutine']['reaction_ph_comments'],

            specific_gravity=data['urineroutine']['specific_gravity'],
            specific_gravity_unit=data['urineroutine']['specific_gravity_unit'],
            specific_gravity_reference_range=data['urineroutine']['specific_gravity_reference_range'],
            specific_gravity_comments=data['urineroutine']['specific_gravity_comments'],

            crystals=data['urineroutine']['crystals'],
            crystals_unit=data['urineroutine']['crystals_unit'],
            crystals_reference_range=data['urineroutine']['crystals_reference_range'],
            crystals_comments=data['urineroutine']['crystals_comments'],

            bacteria=data['urineroutine']['bacteria'],
            bacteria_unit=data['urineroutine']['bacteria_unit'],
            bacteria_reference_range=data['urineroutine']['bacteria_reference_range'],
            bacteria_comments=data['urineroutine']['bacteria_comments'],

            protein_albumin=data['urineroutine']['protein_albumin'],
            protein_albumin_unit=data['urineroutine']['protein_albumin_unit'],
            protein_albumin_reference_range=data['urineroutine']['protein_albumin_reference_range'],
            protein_albumin_comments=data['urineroutine']['protein_albumin_comments'],

            glucose_urine=data['urineroutine']['glucose_urine'],
            glucose_urine_unit=data['urineroutine']['glucose_urine_unit'],
            glucose_urine_reference_range=data['urineroutine']['glucose_urine_reference_range'],
            glucose_urine_comments=data['urineroutine']['glucose_urine_comments'],

            ketone_bodies=data['urineroutine']['ketone_bodies'],
            ketone_bodies_unit=data['urineroutine']['ketone_bodies_unit'],
            ketone_bodies_reference_range=data['urineroutine']['ketone_bodies_reference_range'],
            ketone_bodies_comments=data['urineroutine']['ketone_bodies_comments'],

            urobilinogen=data['urineroutine']['urobilinogen'],
            urobilinogen_unit=data['urineroutine']['urobilinogen_unit'],
            urobilinogen_reference_range=data['urineroutine']['urobilinogen_reference_range'],
            urobilinogen_comments=data['urineroutine']['urobilinogen_comments'],

            casts=data['urineroutine']['casts'],
            casts_unit=data['urineroutine']['casts_unit'],
            casts_reference_range=data['urineroutine']['casts_reference_range'],
            casts_comments=data['urineroutine']['casts_comments'],

            bile_salts=data['urineroutine']['bile_salts'],
            bile_salts_unit=data['urineroutine']['bile_salts_unit'],
            bile_salts_reference_range=data['urineroutine']['bile_salts_reference_range'],
            bile_salts_comments=data['urineroutine']['bile_salts_comments'],

            bile_pigments=data['urineroutine']['bile_pigments'],
            bile_pigments_unit=data['urineroutine']['bile_pigments_unit'],
            bile_pigments_reference_range=data['urineroutine']['bile_pigments_reference_range'],
            bile_pigments_comments=data['urineroutine']['bile_pigments_comments'],

            wbc_pus_cells=data['urineroutine']['wbc_pus_cells'],
            wbc_pus_cells_unit=data['urineroutine']['wbc_pus_cells_unit'],
            wbc_pus_cells_reference_range=data['urineroutine']['wbc_pus_cells_reference_range'],
            wbc_pus_cells_comments=data['urineroutine']['wbc_pus_cells_comments'],

            red_blood_cells=data['urineroutine']['red_blood_cells'],
            red_blood_cells_unit=data['urineroutine']['red_blood_cells_unit'],
            red_blood_cells_reference_range=data['urineroutine']['red_blood_cells_reference_range'],
            red_blood_cells_comments=data['urineroutine']['red_blood_cells_comments'],

            epithelial_cells=data['urineroutine']['epithelial_cells'],
            epithelial_cells_unit=data['urineroutine']['epithelial_cells_unit'],
            epithelial_cells_reference_range=data['urineroutine']['epithelial_cells_reference_range'],
            epithelial_cells_comments=data['urineroutine']['epithelial_cells_comments']
        )
        print("URT")

        serology_test = models.SerologyTest.objects.create(
            emp_no=data['serology']['emp_no'],
            screening_hiv=data['serology']['screening_hiv'],
            screening_hiv_unit=data['serology']['screening_hiv_unit'],
            screening_hiv_reference_range=data['serology']['screening_hiv_reference_range'],
            screening_hiv_comments=data['serology']['screening_hiv_comments'],

            occult_blood=data['serology']['occult_blood'],
            occult_blood_unit=data['serology']['occult_blood_unit'],
            occult_blood_reference_range=data['serology']['occult_blood_reference_range'],
            occult_blood_comments=data['serology']['occult_blood_comments'],

            cyst=data['serology']['cyst'],
            cyst_unit=data['serology']['cyst_unit'],
            cyst_reference_range=data['serology']['cyst_reference_range'],
            cyst_comments=data['serology']['cyst_comments'],

            mucus=data['serology']['mucus'],
            mucus_unit=data['serology']['mucus_unit'],
            mucus_reference_range=data['serology']['mucus_reference_range'],
            mucus_comments=data['serology']['mucus_comments'],

            pus_cells=data['serology']['pus_cells'],
            pus_cells_unit=data['serology']['pus_cells_unit'],
            pus_cells_reference_range=data['serology']['pus_cells_reference_range'],
            pus_cells_comments=data['serology']['pus_cells_comments'],

            ova=data['serology']['ova'],
            ova_unit=data['serology']['ova_unit'],
            ova_reference_range=data['serology']['ova_reference_range'],
            ova_comments=data['serology']['ova_comments']
        )
        print("Serology")

        return JsonResponse({"message":"Added Successfully"}, status=200)
    else:
        return JsonResponse({"error":"Request method is wrong"}, status=405)





@csrf_exempt  # Disable CSRF for this API (for testing; use CSRF token in production)
def BookAppointment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Hi")
            #Create an appointment instance and save it
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

            return JsonResponse({"message": f"Appointment booked successfully for {appointment.name} on {appointment.appointment_date}"})

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
            appointments = Appointment.objects.filter(appointment_date__range=[from_date, to_date]).order_by('appointment_date', 'time')
        elif from_date:
            appointments = Appointment.objects.filter(appointment_date__range=[from_date, today]).order_by('appointment_date', 'time')
        elif to_date:
            appointments = Appointment.objects.filter(appointment_date__range=[today,to_date]).order_by('appointment_date', 'time')
        else:
            appointments = Appointment.objects.filter(appointment_date=today).order_by('appointment_date', 'time')

        appointment_list = list(appointments.values("id", "employee_id", "name", "role", "appointment_date", "status"))
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