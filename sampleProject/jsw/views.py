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
from datetime import datetime, timedelta
from .models import Appointment

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
            #womenspack = list(models.WomensPack.objects.values()) if models.WomensPack.objects.exists() else []
            #occupationalprofile = list(models.OccupationalProfile.objects.values()) if models.OccupationalProfile.objects.exists() else []
            #otherstest = list(models.OthersTest.objects.values()) if models.OthersTest.objects.exists() else []
            opthalamicreport = list(models.OphthalmicReport.objects.values()) if models.OphthalmicReport.objects.exists() else []
            #xray = list(models.XRayReport.objects.values()) if models.XRayReport.objects.exists() else []
            usg = list(models.USGReport.objects.values()) if models.USGReport.objects.exists() else []
            #ct = list(models.CTReport.objects.values()) if models.CTReport.objects.exists() else []
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
            #womenspack_dict = {v["emp_no"]: v for v in womenspack}
            #occupationalprofile_dict = {v["emp_no"]: v for v in occupationalprofile}
            #otherstest_dict = {v["emp_no"]: v for v in otherstest}
            opthalamicreport_dict = {v["emp_no"]: v for v in opthalamicreport}
            #xray_dict = {v["emp_no"]: v for v in xray}
            usg_dict = {v["emp_no"]: v for v in usg}
            #ct_dict = {v["emp_no"]: v for v in ct}
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
                #emp["womenspack"] = womenspack_dict.get(emp_no, {})
                #emp["occupationalprofile"] = occupationalprofile_dict.get(emp_no, {})
                #emp["otherstest"] = otherstest_dict.get(emp_no, {})
                emp["opthalamicreport"] = opthalamicreport_dict.get(emp_no, {})
                #emp["xray"] = xray_dict.get(emp_no, {})
                emp["usg"] = usg_dict.get(emp_no, {})
                #emp["ct"] = ct_dict.get(emp_no, {})
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
        print("Vitals: ", data['vitals']['name'])
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
        #     emp_no=data['emp_no'],
        #     systolic=data['systolic'],
        #     diastolic=data['diastolic'],
        #     pulse=data['pulse'],
        #     respiratory_rate=data['respiratory_rate'],
        #     temperature=data['temperature'],
        #     spO2=data['spO2'],
        #     weight=data['weight'],
        #     height=data['height'],
        #     bmi=data['bmi']
        # )

        # motion_test = MotionTest.objects.create(
        #     emp_no=data['emp_no'],
        #     colour_motion=data['colour_motion'],
        #     colour_motion_unit=data['colour_motion_unit'],
        #     colour_motion_reference_range=data['colour_motion_reference_range'],
        #     colour_motion_comments=data['colour_motion_comments'],
            
        #     appearance_motion=data['appearance_motion'],
        #     appearance_motion_unit=data['appearance_motion_unit'],
        #     appearance_motion_reference_range=data['appearance_motion_reference_range'],
        #     appearance_motion_comments=data['appearance_motion_comments'],
            
        #     occult_blood=data['occult_blood'],
        #     occult_blood_unit=data['occult_blood_unit'],
        #     occult_blood_reference_range=data['occult_blood_reference_range'],
        #     occult_blood_comments=data['occult_blood_comments'],
            
        #     cyst=data['cyst'],
        #     cyst_unit=data['cyst_unit'],
        #     cyst_reference_range=data['cyst_reference_range'],
        #     cyst_comments=data['cyst_comments'],
            
        #     mucus=data['mucus'],
        #     mucus_unit=data['mucus_unit'],
        #     mucus_reference_range=data['mucus_reference_range'],
        #     mucus_comments=data['mucus_comments'],
            
        #     pus_cells=data['pus_cells'],
        #     pus_cells_unit=data['pus_cells_unit'],
        #     pus_cells_reference_range=data['pus_cells_reference_range'],
        #     pus_cells_comments=data['pus_cells_comments'],
            
        #     ova=data['ova'],
        #     ova_unit=data['ova_unit'],
        #     ova_reference_range=data['ova_reference_range'],
        #     ova_comments=data['ova_comments'],
            
        #     rbcs=data['rbcs'],
        #     rbcs_unit=data['rbcs_unit'],
        #     rbcs_reference_range=data['rbcs_reference_range'],
        #     rbcs_comments=data['rbcs_comments'],
            
        #     others=data['others'],
        #     others_unit=data['others_unit'],
        #     others_reference_range=data['others_reference_range'],
        #     others_comments=data['others_comments']
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

        # mens_pack = MensPack.objects.create(
        #     emp_no=data['emp_no'],
        #     psa=data['psa'],
        #     psa_unit=data['psa_unit'],
        #     psa_reference_range=data['psa_reference_range'],
        #     psa_comments=data['psa_comments']
        # )


        # ophthalmic_report = OphthalmicReport.objects.create(
        #     emp_no=data['emp_no'],
        #     vision=data['vision'],
        #     vision_unit=data['vision_unit'],
        #     vision_reference_range=data['vision_reference_range'],
        #     vision_comments=data['vision_comments'],
            
        #     color_vision=data['color_vision'],
        #     color_vision_unit=data['color_vision_unit'],
        #     color_vision_reference_range=data['color_vision_reference_range'],
        #     color_vision_comments=data['color_vision_comments']
        # )


        # usg_report = USGReport.objects.create(
        #     emp_no=data['emp_no'],
        #     usg_abdomen=data['usg_abdomen'],
        #     usg_abdomen_unit=data['usg_abdomen_unit'],
        #     usg_abdomen_reference_range=data['usg_abdomen_reference_range'],
        #     usg_abdomen_comments=data['usg_abdomen_comments'],
            
        #     usg_kub=data['usg_kub'],
        #     usg_kub_unit=data['usg_kub_unit'],
        #     usg_kub_reference_range=data['usg_kub_reference_range'],
        #     usg_kub_comments=data['usg_kub_comments'],
            
        #     usg_pelvis=data['usg_pelvis'],
        #     usg_pelvis_unit=data['usg_pelvis_unit'],
        #     usg_pelvis_reference_range=data['usg_pelvis_reference_range'],
        #     usg_pelvis_comments=data['usg_pelvis_comments'],
            
        #     usg_neck=data['usg_neck'],
        #     usg_neck_unit=data['usg_neck_unit'],
        #     usg_neck_reference_range=data['usg_neck_reference_range'],
        #     usg_neck_comments=data['usg_neck_comments']
        # )

        # mri_report = MRIReport.objects.create(
        #     emp_no=data['emp_no'],
        #     mri_brain=data['mri_brain'],
        #     mri_brain_unit=data['mri_brain_unit'],
        #     mri_brain_reference_range=data['mri_brain_reference_range'],
        #     mri_brain_comments=data['mri_brain_comments'],
            
        #     mri_lungs=data['mri_lungs'],
        #     mri_lungs_unit=data['mri_lungs_unit'],
        #     mri_lungs_reference_range=data['mri_lungs_reference_range'],
        #     mri_lungs_comments=data['mri_lungs_comments'],
            
        #     mri_abdomen=data['mri_abdomen'],
        #     mri_abdomen_unit=data['mri_abdomen_unit'],
        #     mri_abdomen_reference_range=data['mri_abdomen_reference_range'],
        #     mri_abdomen_comments=data['mri_abdomen_comments'],
            
        #     mri_spine=data['mri_spine'],
        #     mri_spine_unit=data['mri_spine_unit'],
        #     mri_spine_reference_range=data['mri_spine_reference_range'],
        #     mri_spine_comments=data['mri_spine_comments'],
            
        #     mri_pelvis=data['mri_pelvis'],
        #     mri_pelvis_unit=data['mri_pelvis_unit'],
        #     mri_pelvis_reference_range=data['mri_pelvis_reference_range'],
        #     mri_pelvis_comments=data['mri_pelvis_comments']
        # )



        # heamatalogy_details = models.heamatalogy.objects.create(
        #     emp_no=data['emp_no'],
        #     hemoglobin=data['hemoglobin'],
        #     hemoglobin_unit=data['hemoglobin_unit'],
        #     hemoglobin_reference_range=data['hemoglobin_reference_range'],
        #     hemoglobin_comments=data['hemoglobin_comments'],

        #     total_rbc=data['total_rbc'],
        #     total_rbc_unit=data['total_rbc_unit'],
        #     total_rbc_reference_range=data['total_rbc_reference_range'],
        #     total_rbc_comments=data['total_rbc_comments'],

        #     total_wbc=data['total_wbc'],
        #     total_wbc_unit=data['total_wbc_unit'],
        #     total_wbc_reference_range=data['total_wbc_reference_range'],
        #     total_wbc_comments=data['total_wbc_comments'],

        #     neutrophil=data['neutrophil'],
        #     neutrophil_unit=data['neutrophil_unit'],
        #     neutrophil_reference_range=data['neutrophil_reference_range'],
        #     neutrophil_comments=data['neutrophil_comments'],

        #     monocyte=data['monocyte'],
        #     monocyte_unit=data['monocyte_unit'],
        #     monocyte_reference_range=data['monocyte_reference_range'],
        #     monocyte_comments=data['monocyte_comments'],

        #     pcv=data['pcv'],
        #     pcv_unit=data['pcv_unit'],
        #     pcv_reference_range=data['pcv_reference_range'],
        #     pcv_comments=data['pcv_comments'],

        #     mcv=data['mcv'],
        #     mcv_unit=data['mcv_unit'],
        #     mcv_reference_range=data['mcv_reference_range'],
        #     mcv_comments=data['mcv_comments'],

        #     mch=data['mch'],
        #     mch_unit=data['mch_unit'],
        #     mch_reference_range=data['mch_reference_range'],
        #     mch_comments=data['mch_comments'],

        #     lymphocyte=data['lymphocyte'],
        #     lymphocyte_unit=data['lymphocyte_unit'],
        #     lymphocyte_reference_range=data['lymphocyte_reference_range'],
        #     lymphocyte_comments=data['lymphocyte_comments'],

        #     esr=data['esr'],
        #     esr_unit=data['esr_unit'],
        #     esr_reference_range=data['esr_reference_range'],
        #     esr_comments=data['esr_comments'],

        #     mchc=data['mchc'],
        #     mchc_unit=data['mchc_unit'],
        #     mchc_reference_range=data['mchc_reference_range'],
        #     mchc_comments=data['mchc_comments'],

        #     platelet_count=data['platelet_count'],
        #     platelet_count_unit=data['platelet_count_unit'],
        #     platelet_count_reference_range=data['platelet_count_reference_range'],
        #     platelet_count_comments=data['platelet_count_comments'],

        #     rdw=data['rdw'],
        #     rdw_unit=data['rdw_unit'],
        #     rdw_reference_range=data['rdw_reference_range'],
        #     rdw_comments=data['rdw_comments'],

        #     eosinophil=data['eosinophil'],
        #     eosinophil_unit=data['eosinophil_unit'],
        #     eosinophil_reference_range=data['eosinophil_reference_range'],
        #     eosinophil_comments=data['eosinophil_comments'],

        #     basophil=data['basophil'],
        #     basophil_unit=data['basophil_unit'],
        #     basophil_reference_range=data['basophil_reference_range'],
        #     basophil_comments=data['basophil_comments'],

        #     peripheral_blood_smear_rbc_morphology=data['peripheral_blood_smear_rbc_morphology'],
        #     peripheral_blood_smear_parasites=data['peripheral_blood_smear_parasites'],
        #     peripheral_blood_smear_others=data['peripheral_blood_smear_others']
        # )

        # routine_sugar_details = models.RoutineSugarTests.objects.create(
        #     emp_no=data['emp_no'],
        #     glucose_f=data['glucose_f'],
        #     glucose_f_unit=data['glucose_f_unit'],
        #     glucose_f_reference_range=data['glucose_f_reference_range'],
        #     glucose_f_comments=data['glucose_f_comments'],

        #     glucose_pp=data['glucose_pp'],
        #     glucose_pp_unit=data['glucose_pp_unit'],
        #     glucose_pp_reference_range=data['glucose_pp_reference_range'],
        #     glucose_pp_comments=data['glucose_pp_comments'],

        #     random_blood_sugar=data['random_blood_sugar'],
        #     random_blood_sugar_unit=data['random_blood_sugar_unit'],
        #     random_blood_sugar_reference_range=data['random_blood_sugar_reference_range'],
        #     random_blood_sugar_comments=data['random_blood_sugar_comments'],

        #     estimated_average_glucose=data['estimated_average_glucose'],
        #     estimated_average_glucose_unit=data['estimated_average_glucose_unit'],
        #     estimated_average_glucose_reference_range=data['estimated_average_glucose_reference_range'],
        #     estimated_average_glucose_comments=data['estimated_average_glucose_comments'],

        #     hba1c=data['hba1c'],
        #     hba1c_unit=data['hba1c_unit'],
        #     hba1c_reference_range=data['hba1c_reference_range'],
        #     hba1c_comments=data['hba1c_comments']
        # )

        # renal_function_test = RenalFunctionTest.objects.create(
        #     emp_no=data['emp_no'],
        #     urea=data['urea'],
        #     urea_unit=data['urea_unit'],
        #     urea_reference_range=data['urea_reference_range'],
        #     urea_comments=data['urea_comments'],

        #     bun=data['bun'],
        #     bun_unit=data['bun_unit'],
        #     bun_reference_range=data['bun_reference_range'],
        #     bun_comments=data['bun_comments'],

        #     calcium=data['calcium'],
        #     calcium_unit=data['calcium_unit'],
        #     calcium_reference_range=data['calcium_reference_range'],
        #     calcium_comments=data['calcium_comments'],

        #     sodium=data['sodium'],
        #     sodium_unit=data['sodium_unit'],
        #     sodium_reference_range=data['sodium_reference_range'],
        #     sodium_comments=data['sodium_comments'],

        #     potassium=data['potassium'],
        #     potassium_unit=data['potassium_unit'],
        #     potassium_reference_range=data['potassium_reference_range'],
        #     potassium_comments=data['potassium_comments'],

        #     phosphorus=data['phosphorus'],
        #     phosphorus_unit=data['phosphorus_unit'],
        #     phosphorus_reference_range=data['phosphorus_reference_range'],
        #     phosphorus_comments=data['phosphorus_comments'],

        #     serum_creatinine=data['serum_creatinine'],
        #     serum_creatinine_unit=data['serum_creatinine_unit'],
        #     serum_creatinine_reference_range=data['serum_creatinine_reference_range'],
        #     serum_creatinine_comments=data['serum_creatinine_comments'],

        #     uric_acid=data['uric_acid'],
        #     uric_acid_unit=data['uric_acid_unit'],
        #     uric_acid_reference_range=data['uric_acid_reference_range'],
        #     uric_acid_comments=data['uric_acid_comments'],

        #     chloride=data['chloride'],
        #     chloride_unit=data['chloride_unit'],
        #     chloride_reference_range=data['chloride_reference_range'],
        #     chloride_comments=data['chloride_comments']
        # )

        # lipid_profile = LipidProfile.objects.create(
        #     emp_no=data['emp_no'],
        #     calcium=data['calcium'],
        #     calcium_unit=data['calcium_unit'],
        #     calcium_reference_range=data['calcium_reference_range'],
        #     calcium_comments=data['calcium_comments'],

        #     triglycerides=data['triglycerides'],
        #     triglycerides_unit=data['triglycerides_unit'],
        #     triglycerides_reference_range=data['triglycerides_reference_range'],
        #     triglycerides_comments=data['triglycerides_comments'],

        #     hdl_cholesterol=data['hdl_cholesterol'],
        #     hdl_cholesterol_unit=data['hdl_cholesterol_unit'],
        #     hdl_cholesterol_reference_range=data['hdl_cholesterol_reference_range'],
        #     hdl_cholesterol_comments=data['hdl_cholesterol_comments'],

        #     ldl_cholesterol=data['ldl_cholesterol'],
        #     ldl_cholesterol_unit=data['ldl_cholesterol_unit'],
        #     ldl_cholesterol_reference_range=data['ldl_cholesterol_reference_range'],
        #     ldl_cholesterol_comments=data['ldl_cholesterol_comments'],

        #     chol_hdl_ratio=data['chol_hdl_ratio'],
        #     chol_hdl_ratio_unit=data['chol_hdl_ratio_unit'],
        #     chol_hdl_ratio_reference_range=data['chol_hdl_ratio_reference_range'],
        #     chol_hdl_ratio_comments=data['chol_hdl_ratio_comments'],

        #     vldl_cholesterol=data['vldl_cholesterol'],
        #     vldl_cholesterol_unit=data['vldl_cholesterol_unit'],
        #     vldl_cholesterol_reference_range=data['vldl_cholesterol_reference_range'],
        #     vldl_cholesterol_comments=data['vldl_cholesterol_comments'],

        #     ldl_hdl_ratio=data['ldl_hdl_ratio'],
        #     ldl_hdl_ratio_unit=data['ldl_hdl_ratio_unit'],
        #     ldl_hdl_ratio_reference_range=data['ldl_hdl_ratio_reference_range'],
        #     ldl_hdl_ratio_comments=data['ldl_hdl_ratio_comments']
        # )

        # liver_function_test = LiverFunctionTest.objects.create(
        #     emp_no=data['emp_no'],
        #     bilirubin_total=data['bilirubin_total'],
        #     bilirubin_total_unit=data['bilirubin_total_unit'],
        #     bilirubin_total_reference_range=data['bilirubin_total_reference_range'],
        #     bilirubin_total_comments=data['bilirubin_total_comments'],

        #     bilirubin_direct=data['bilirubin_direct'],
        #     bilirubin_direct_unit=data['bilirubin_direct_unit'],
        #     bilirubin_direct_reference_range=data['bilirubin_direct_reference_range'],
        #     bilirubin_direct_comments=data['bilirubin_direct_comments'],

        #     bilirubin_indirect=data['bilirubin_indirect'],
        #     bilirubin_indirect_unit=data['bilirubin_indirect_unit'],
        #     bilirubin_indirect_reference_range=data['bilirubin_indirect_reference_range'],
        #     bilirubin_indirect_comments=data['bilirubin_indirect_comments'],

        #     sgot_ast=data['sgot_ast'],
        #     sgot_ast_unit=data['sgot_ast_unit'],
        #     sgot_ast_reference_range=data['sgot_ast_reference_range'],
        #     sgot_ast_comments=data['sgot_ast_comments'],

        #     sgpt_alt=data['sgpt_alt'],
        #     sgpt_alt_unit=data['sgpt_alt_unit'],
        #     sgpt_alt_reference_range=data['sgpt_alt_reference_range'],
        #     sgpt_alt_comments=data['sgpt_alt_comments'],

        #     alkaline_phosphatase=data['alkaline_phosphatase'],
        #     alkaline_phosphatase_unit=data['alkaline_phosphatase_unit'],
        #     alkaline_phosphatase_reference_range=data['alkaline_phosphatase_reference_range'],
        #     alkaline_phosphatase_comments=data['alkaline_phosphatase_comments'],

        #     total_protein=data['total_protein'],
        #     total_protein_unit=data['total_protein_unit'],
        #     total_protein_reference_range=data['total_protein_reference_range'],
        #     total_protein_comments=data['total_protein_comments'],

        #     albumin_serum=data['albumin_serum'],
        #     albumin_serum_unit=data['albumin_serum_unit'],
        #     albumin_serum_reference_range=data['albumin_serum_reference_range'],
        #     albumin_serum_comments=data['albumin_serum_comments'],

        #     globulin_serum=data['globulin_serum'],
        #     globulin_serum_unit=data['globulin_serum_unit'],
        #     globulin_serum_reference_range=data['globulin_serum_reference_range'],
        #     globulin_serum_comments=data['globulin_serum_comments'],

        #     alb_glob_ratio=data['alb_glob_ratio'],
        #     alb_glob_ratio_unit=data['alb_glob_ratio_unit'],
        #     alb_glob_ratio_reference_range=data['alb_glob_ratio_reference_range'],
        #     alb_glob_ratio_comments=data['alb_glob_ratio_comments'],

        #     gamma_glutamyl_transferase=data['gamma_glutamyl_transferase'],
        #     gamma_glutamyl_transferase_unit=data['gamma_glutamyl_transferase_unit'],
        #     gamma_glutamyl_transferase_reference_range=data['gamma_glutamyl_transferase_reference_range'],
        #     gamma_glutamyl_transferase_comments=data['gamma_glutamyl_transferase_comments']
        # )

        # thyroid_function_test = ThyroidFunctionTest.objects.create(
        #     emp_no=data['emp_no'],
        #     t3_triiodothyronine=data['t3_triiodothyronine'],
        #     t3_unit=data['t3_unit'],
        #     t3_reference_range=data['t3_reference_range'],
        #     t3_comments=data['t3_comments'],

        #     t4_thyroxine=data['t4_thyroxine'],
        #     t4_unit=data['t4_unit'],
        #     t4_reference_range=data['t4_reference_range'],
        #     t4_comments=data['t4_comments'],

        #     tsh_thyroid_stimulating_hormone=data['tsh_thyroid_stimulating_hormone'],
        #     tsh_unit=data['tsh_unit'],
        #     tsh_reference_range=data['tsh_reference_range'],
        #     tsh_comments=data['tsh_comments']
        # )

        # coagulation_test = CoagulationTest.objects.create(
        #     emp_no=data['emp_no'],
        #     prothrombin_time=data['prothrombin_time'],
        #     prothrombin_time_unit=data['prothrombin_time_unit'],
        #     prothrombin_time_reference_range=data['prothrombin_time_reference_range'],
        #     prothrombin_time_comments=data['prothrombin_time_comments'],

        #     pt_inr=data['pt_inr'],
        #     pt_inr_unit=data['pt_inr_unit'],
        #     pt_inr_reference_range=data['pt_inr_reference_range'],
        #     pt_inr_comments=data['pt_inr_comments'],

        #     clotting_time=data['clotting_time'],
        #     clotting_time_unit=data['clotting_time_unit'],
        #     clotting_time_reference_range=data['clotting_time_reference_range'],
        #     clotting_time_comments=data['clotting_time_comments'],

        #     bleeding_time=data['bleeding_time'],
        #     bleeding_time_unit=data['bleeding_time_unit'],
        #     bleeding_time_reference_range=data['bleeding_time_reference_range'],
        #     bleeding_time_comments=data['bleeding_time_comments']
        # )


        # enzymes_cardiac_profile = EnzymesCardiacProfile.objects.create(
        #     emp_no=data['emp_no'],
        #     acid_phosphatase=data['acid_phosphatase'],
        #     acid_phosphatase_unit=data['acid_phosphatase_unit'],
        #     acid_phosphatase_reference_range=data['acid_phosphatase_reference_range'],
        #     acid_phosphatase_comments=data['acid_phosphatase_comments'],

        #     adenosine_deaminase=data['adenosine_deaminase'],
        #     adenosine_deaminase_unit=data['adenosine_deaminase_unit'],
        #     adenosine_deaminase_reference_range=data['adenosine_deaminase_reference_range'],
        #     adenosine_deaminase_comments=data['adenosine_deaminase_comments'],

        #     amylase=data['amylase'],
        #     amylase_unit=data['amylase_unit'],
        #     amylase_reference_range=data['amylase_reference_range'],
        #     amylase_comments=data['amylase_comments'],

        #     ecg=data['ecg'],
        #     ecg_unit=data['ecg_unit'],
        #     ecg_reference_range=data['ecg_reference_range'],
        #     ecg_comments=data['ecg_comments'],

        #     troponin_t=data['troponin_t'],
        #     troponin_t_unit=data['troponin_t_unit'],
        #     troponin_t_reference_range=data['troponin_t_reference_range'],
        #     troponin_t_comments=data['troponin_t_comments'],

        #     cpk_total=data['cpk_total'],
        #     cpk_total_unit=data['cpk_total_unit'],
        #     cpk_total_reference_range=data['cpk_total_reference_range'],
        #     cpk_total_comments=data['cpk_total_comments'],

        #     echo=data['echo'],
        #     echo_unit=data['echo_unit'],
        #     echo_reference_range=data['echo_reference_range'],
        #     echo_comments=data['echo_comments'],

        #     lipase=data['lipase'],
        #     lipase_unit=data['lipase_unit'],
        #     lipase_reference_range=data['lipase_reference_range'],
        #     lipase_comments=data['lipase_comments'],

        #     cpk_mb=data['cpk_mb'],
        #     cpk_mb_unit=data['cpk_mb_unit'],
        #     cpk_mb_reference_range=data['cpk_mb_reference_range'],
        #     cpk_mb_comments=data['cpk_mb_comments'],

        #     tmt_normal=data['tmt_normal'],
        #     tmt_normal_unit=data['tmt_normal_unit'],
        #     tmt_normal_reference_range=data['tmt_normal_reference_range'],
        #     tmt_normal_comments=data['tmt_normal_comments']
        # )

        # urine_routine_test = UrineRoutineTest.objects.create(
        #     emp_no=data['emp_no'],
        #     colour=data['colour'],
        #     colour_unit=data['colour_unit'],
        #     colour_reference_range=data['colour_reference_range'],
        #     colour_comments=data['colour_comments'],

        #     appearance=data['appearance'],
        #     appearance_unit=data['appearance_unit'],
        #     appearance_reference_range=data['appearance_reference_range'],
        #     appearance_comments=data['appearance_comments'],

        #     reaction_ph=data['reaction_ph'],
        #     reaction_ph_unit=data['reaction_ph_unit'],
        #     reaction_ph_reference_range=data['reaction_ph_reference_range'],
        #     reaction_ph_comments=data['reaction_ph_comments'],

        #     specific_gravity=data['specific_gravity'],
        #     specific_gravity_unit=data['specific_gravity_unit'],
        #     specific_gravity_reference_range=data['specific_gravity_reference_range'],
        #     specific_gravity_comments=data['specific_gravity_comments'],

        #     crystals=data['crystals'],
        #     crystals_unit=data['crystals_unit'],
        #     crystals_reference_range=data['crystals_reference_range'],
        #     crystals_comments=data['crystals_comments'],

        #     bacteria=data['bacteria'],
        #     bacteria_unit=data['bacteria_unit'],
        #     bacteria_reference_range=data['bacteria_reference_range'],
        #     bacteria_comments=data['bacteria_comments'],

        #     protein_albumin=data['protein_albumin'],
        #     protein_albumin_unit=data['protein_albumin_unit'],
        #     protein_albumin_reference_range=data['protein_albumin_reference_range'],
        #     protein_albumin_comments=data['protein_albumin_comments'],

        #     glucose_urine=data['glucose_urine'],
        #     glucose_urine_unit=data['glucose_urine_unit'],
        #     glucose_urine_reference_range=data['glucose_urine_reference_range'],
        #     glucose_urine_comments=data['glucose_urine_comments'],

        #     ketone_bodies=data['ketone_bodies'],
        #     ketone_bodies_unit=data['ketone_bodies_unit'],
        #     ketone_bodies_reference_range=data['ketone_bodies_reference_range'],
        #     ketone_bodies_comments=data['ketone_bodies_comments'],

        #     urobilinogen=data['urobilinogen'],
        #     urobilinogen_unit=data['urobilinogen_unit'],
        #     urobilinogen_reference_range=data['urobilinogen_reference_range'],
        #     urobilinogen_comments=data['urobilinogen_comments'],

        #     casts=data['casts'],
        #     casts_unit=data['casts_unit'],
        #     casts_reference_range=data['casts_reference_range'],
        #     casts_comments=data['casts_comments'],

        #     bile_salts=data['bile_salts'],
        #     bile_salts_unit=data['bile_salts_unit'],
        #     bile_salts_reference_range=data['bile_salts_reference_range'],
        #     bile_salts_comments=data['bile_salts_comments'],

        #     bile_pigments=data['bile_pigments'],
        #     bile_pigments_unit=data['bile_pigments_unit'],
        #     bile_pigments_reference_range=data['bile_pigments_reference_range'],
        #     bile_pigments_comments=data['bile_pigments_comments'],

        #     wbc_pus_cells=data['wbc_pus_cells'],
        #     wbc_pus_cells_unit=data['wbc_pus_cells_unit'],
        #     wbc_pus_cells_reference_range=data['wbc_pus_cells_reference_range'],
        #     wbc_pus_cells_comments=data['wbc_pus_cells_comments'],

        #     red_blood_cells=data['red_blood_cells'],
        #     red_blood_cells_unit=data['red_blood_cells_unit'],
        #     red_blood_cells_reference_range=data['red_blood_cells_reference_range'],
        #     red_blood_cells_comments=data['red_blood_cells_comments'],

        #     epithelial_cells=data['epithelial_cells'],
        #     epithelial_cells_unit=data['epithelial_cells_unit'],
        #     epithelial_cells_reference_range=data['epithelial_cells_reference_range'],
        #     epithelial_cells_comments=data['epithelial_cells_comments']
        # )


        # serology_test = SerologyTest.objects.create(
        #     emp_no=data['emp_no'],
        #     screening_hiv=data['screening_hiv'],
        #     screening_hiv_unit=data['screening_hiv_unit'],
        #     screening_hiv_reference_range=data['screening_hiv_reference_range'],
        #     screening_hiv_comments=data['screening_hiv_comments'],

        #     occult_blood=data['occult_blood'],
        #     occult_blood_unit=data['occult_blood_unit'],
        #     occult_blood_reference_range=data['occult_blood_reference_range'],
        #     occult_blood_comments=data['occult_blood_comments'],

        #     cyst=data['cyst'],
        #     cyst_unit=data['cyst_unit'],
        #     cyst_reference_range=data['cyst_reference_range'],
        #     cyst_comments=data['cyst_comments'],

        #     mucus=data['mucus'],
        #     mucus_unit=data['mucus_unit'],
        #     mucus_reference_range=data['mucus_reference_range'],
        #     mucus_comments=data['mucus_comments'],

        #     pus_cells=data['pus_cells'],
        #     pus_cells_unit=data['pus_cells_unit'],
        #     pus_cells_reference_range=data['pus_cells_reference_range'],
        #     pus_cells_comments=data['pus_cells_comments'],

        #     ova=data['ova'],
        #     ova_unit=data['ova_unit'],
        #     ova_reference_range=data['ova_reference_range'],
        #     ova_comments=data['ova_comments']
        # )


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