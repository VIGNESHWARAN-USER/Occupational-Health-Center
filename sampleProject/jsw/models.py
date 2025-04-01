from django.db import models, transaction
from datetime import date, datetime



class BaseModel(models.Model):
    entry_date = models.DateField(auto_now=True)

    class Meta:
        abstract = True


class user(BaseModel):
    name = models.TextField(max_length=50)
    password = models.TextField(max_length=50)
    accessLevel = models.TextField(max_length=50)

    def __str__(self):
        return self.name



class employee_details(BaseModel):
    EMPLOYEE_TYPES = [
        ('Employee', 'Employee'),
        ('Contractor', 'Contractor'),
        ('Visitor', 'Visitor'),
    ]

    MARITAL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Other', 'Other'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
        ('Separated', 'Separated'),
    ]
    type = models.CharField(max_length=50, choices=EMPLOYEE_TYPES, default='Employee')
    type_of_visit = models.CharField(max_length=255, blank=True)
    register = models.CharField(max_length=255, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    name = models.CharField(max_length=225)
    dob = models.DateField(null=True, blank=True)  # Store as Date
    sex = models.CharField(max_length=50, blank=True)
    aadhar = models.CharField(max_length=225, blank=True)
    bloodgrp = models.CharField(max_length=225, blank=True)
    identification_marks1 = models.CharField(max_length=225, blank=True)
    identification_marks2 = models.CharField(max_length=225, blank=True)
    marital_status = models.CharField(
        max_length=50,
        choices=MARITAL_STATUS_CHOICES,
        blank=True
    )
    emp_no = models.CharField(max_length=200,blank=True)  # Consider unique=True
    employer = models.CharField(max_length=225, blank=True)
    designation = models.CharField(max_length=225, blank=True)
    department = models.CharField(max_length=225, blank=True)
    job_nature = models.CharField(max_length=225, blank=True)
    doj = models.DateField(null=True, blank=True) # Store as Date
    moj = models.CharField(max_length=225, blank=True)
    phone_Personal = models.CharField(max_length=225, blank=True)
    mail_id_Personal = models.EmailField(max_length=225, blank=True) # Use EmailField
    emergency_contact_person = models.CharField(max_length=225, blank=True)
    phone_Office = models.CharField(max_length=225, blank=True)
    mail_id_Office = models.EmailField(max_length=225, blank=True) # Use EmailField
    emergency_contact_relation = models.CharField(max_length=225, blank=True)
    mail_id_Emergency_Contact_Person = models.EmailField(max_length=225, blank=True) # Use EmailField
    emergency_contact_phone = models.CharField(max_length=225, blank=True)
    role = models.CharField(max_length=50, blank=True)  # Consider choices here too
    permanent_address = models.TextField(blank=True) # Remove max_length
    permanent_area = models.CharField(max_length=50, blank=True)
    permanent_nationality = models.CharField(max_length=50, blank=True)
    permanent_state = models.CharField(max_length=50, blank=True)
    residential_address = models.TextField(blank=True) # Remove max_length
    residential_area = models.CharField(max_length=50, blank=True)
    residential_nationality = models.CharField(max_length=50, blank=True)
    residential_state = models.CharField(max_length=50, blank=True)
    profilepic = models.ImageField(upload_to='profilepics', blank=True, null=True)  # Allow null for new records
    profilepic_url = models.URLField(max_length=255, blank=True)
    other_site_id = models.CharField(max_length=255, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    addressOrganization = models.CharField(max_length=255, blank=True)
    visiting_department = models.CharField(max_length=255, blank=True)
    visiting_date_from = models.DateField(null=True, blank=True)
    stay_in_guest_house = models.CharField(max_length=50, blank=True)
    visiting_purpose = models.CharField(max_length=255, blank=True)

    # Extra fields for conditional registers
    year = models.CharField(max_length=4, blank=True)
    batch = models.CharField(max_length=255, blank=True)
    hospitalName = models.CharField(max_length=255, blank=True)
    campName = models.CharField(max_length=255, blank=True)
    contractName = models.CharField(max_length=255, blank=True)
    prevcontractName = models.CharField(max_length=255, blank=True)
    old_emp_no = models.CharField(max_length=200, blank=True)
    reason = models.CharField(max_length=255, blank=True)  # For Special Work Fitness
    status = models.CharField(max_length=255, blank=True)  # For BP Sugar Check

    def __str__(self):
        return self.emp_no

    def save(self, *args, **kwargs):
        if not self.profilepic:
            self.profilepic_url = ''
        super().save(*args, **kwargs)


class Dashboard(BaseModel):
    emp_no = models.TextField(max_length=200)
    type = models.TextField(max_length=255)  # Represents "Type"
    type_of_visit = models.TextField(max_length=255)  # Represents "Type of visit"
    register = models.TextField(max_length=255)
    purpose = models.TextField(max_length=255)
    date = models.DateField(auto_now=True)

    # Extra fields for conditional registers
    year = models.CharField(max_length=4, blank=True)
    batch = models.CharField(max_length=255, blank=True)
    hospitalName = models.CharField(max_length=255, blank=True)
    campName = models.CharField(max_length=255, blank=True)
    contractName = models.CharField(max_length=255, blank=True)
    prevcontractName = models.CharField(max_length=255, blank=True)
    old_emp_no = models.CharField(max_length=200, blank=True)
    reason = models.CharField(max_length=255, blank=True)  # For Special Work Fitness
    status = models.CharField(max_length=255, blank=True)  # For BP Sugar Check


    def _str_(self):
        return f"Dashboard Record {self.id}"



class vitals(BaseModel):
    emp_no = models.TextField(max_length=200)

    systolic = models.TextField(max_length=50)
    systolic_status = models.TextField(max_length=50, null=True, blank=True)
    systolic_comment = models.TextField(max_length=255, null=True, blank=True)

    diastolic = models.TextField(max_length=50)
    diastolic_status = models.TextField(max_length=50, null=True, blank=True)
    diastolic_comment = models.TextField(max_length=255, null=True, blank=True)

    pulse = models.TextField(max_length=50)
    pulse_status = models.TextField(max_length=50, null=True, blank=True)
    pulse_comment = models.TextField(max_length=255, null=True, blank=True)

    respiratory_rate = models.TextField(max_length=50)
    respiratory_rate_status = models.TextField(max_length=50, null=True, blank=True)
    respiratory_rate_comment = models.TextField(max_length=255, null=True, blank=True)

    temperature = models.TextField(max_length=50)
    temperature_status = models.TextField(max_length=50, null=True, blank=True)
    temperature_comment = models.TextField(max_length=255, null=True, blank=True)

    spO2 = models.TextField(max_length=50)
    spO2_status = models.TextField(max_length=50, null=True, blank=True)
    spO2_comment = models.TextField(max_length=255, null=True, blank=True)

    weight = models.TextField(max_length=50)
    weight_status = models.TextField(max_length=50, null=True, blank=True)
    weight_comment = models.TextField(max_length=255, null=True, blank=True)

    height = models.TextField(max_length=50)
    height_status = models.TextField(max_length=50, null=True, blank=True)
    height_comment = models.TextField(max_length=255, null=True, blank=True)

    bmi = models.TextField(max_length=50)
    bmi_status = models.TextField(max_length=50, null=True, blank=True)
    bmi_comment = models.TextField(max_length=255, null=True, blank=True)


    def __str__(self):
        return self.emp_no
    
class mockdrills(BaseModel):
    emp_no = models.TextField(max_length=200)
    date= models.TextField(max_length=200)
    time= models.TextField(max_length=200)
    department= models.TextField(max_length=200)
    location= models.TextField(max_length=200)
    scenario= models.TextField(max_length=200)
    ambulance_timing= models.TextField(max_length=200)
    departure_from_OHC= models.TextField(max_length=200)
    return_to_OHC= models.TextField(max_length=200)
    emp_no= models.TextField(max_length=200)
    victim_name= models.TextField(max_length=200)
    age= models.TextField(max_length=200)
    gender= models.TextField(max_length=200)
    victim_department= models.TextField(max_length=200)
    nature_of_job= models.TextField(max_length=200)
    mobile_no= models.TextField(max_length=200)
    vitals= models.TextField(max_length=200)
    complaints= models.TextField(max_length=200)
    treatment= models.TextField(max_length=200)
    referal= models.TextField(max_length=200)
    ambulance_driver= models.TextField(max_length=200)
    staff_name= models.TextField(max_length=200)
    OHC_doctor= models.TextField(max_length=200)
    staff_nurse= models.TextField(max_length=200)
    vitals= models.TextField(max_length=200)
    action_completion= models.TextField(max_length=200)
    responsible= models.TextField(max_length=200)

    def __str__(self):
        return self.emp_no
    


class eventsandcamps(BaseModel):
    camp_name = models.TextField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    hospital_name = models.TextField(max_length=255)
    camp_details = models.TextField(max_length=225)
    camp_type = models.TextField(max_length=100, default="Upcoming")
    report1 = models.FileField(upload_to='camp_reports/', blank=True, null=True)
    report2 = models.FileField(upload_to='camp_reports/', blank=True, null=True)
    photos = models.ImageField(upload_to='camp_photos/', blank=True, null=True)
    ppt = models.FileField(upload_to='camp_presentations/', blank=True, null=True)

    def _str_(self):
        return self.camp_name

    def save(self, *args, **kwargs):
        today = date.today()

        if self.start_date > today:
            self.camp_type = "Upcoming"
        elif self.start_date <= today <= self.end_date:
            self.camp_type = "Live"
        else:
            self.camp_type = "Previous"

        super().save(*args, **kwargs)


class heamatalogy(BaseModel):
    emp_no = models.TextField(max_length=200)
    hemoglobin = models.TextField(max_length=255)
    hemoglobin_unit = models.TextField(max_length=255)
    hemoglobin_reference_range = models.TextField(max_length=255)
    hemoglobin_comments = models.TextField(max_length=255)

    total_rbc = models.TextField(max_length=255)
    total_rbc_unit = models.TextField(max_length=255)
    total_rbc_reference_range = models.TextField(max_length=255)
    total_rbc_comments = models.TextField(max_length=255)

    total_wbc = models.TextField(max_length=255)
    total_wbc_unit = models.TextField(max_length=255)
    total_wbc_reference_range = models.TextField(max_length=255)
    total_wbc_comments = models.TextField(max_length=255)

    neutrophil = models.TextField(max_length=255)
    neutrophil_unit = models.TextField(max_length=255)
    neutrophil_reference_range = models.TextField(max_length=255)
    neutrophil_comments = models.TextField(max_length=255)

    monocyte = models.TextField(max_length=255)
    monocyte_unit = models.TextField(max_length=255)
    monocyte_reference_range = models.TextField(max_length=255)
    monocyte_comments = models.TextField(max_length=255)

    pcv = models.TextField(max_length=255)
    pcv_unit = models.TextField(max_length=255)
    pcv_reference_range = models.TextField(max_length=255)
    pcv_comments = models.TextField(max_length=255)

    mcv = models.TextField(max_length=255)
    mcv_unit = models.TextField(max_length=255)
    mcv_reference_range = models.TextField(max_length=255)
    mcv_comments = models.TextField(max_length=255)

    mch = models.TextField(max_length=255)
    mch_unit = models.TextField(max_length=255)
    mch_reference_range = models.TextField(max_length=255)
    mch_comments = models.TextField(max_length=255)

    lymphocyte = models.TextField(max_length=255)
    lymphocyte_unit = models.TextField(max_length=255)
    lymphocyte_reference_range = models.TextField(max_length=255)
    lymphocyte_comments = models.TextField(max_length=255)

    esr = models.TextField(max_length=255)
    esr_unit = models.TextField(max_length=255)
    esr_reference_range = models.TextField(max_length=255)
    esr_comments = models.TextField(max_length=255)

    mchc = models.TextField(max_length=255)
    mchc_unit = models.TextField(max_length=255)
    mchc_reference_range = models.TextField(max_length=255)
    mchc_comments = models.TextField(max_length=255)

    platelet_count = models.TextField(max_length=255)
    platelet_count_unit = models.TextField(max_length=255)
    platelet_count_reference_range = models.TextField(max_length=255)
    platelet_count_comments = models.TextField(max_length=255)

    rdw = models.TextField(max_length=255)
    rdw_unit = models.TextField(max_length=255)
    rdw_reference_range = models.TextField(max_length=255)
    rdw_comments = models.TextField(max_length=255)

    eosinophil = models.TextField(max_length=255)
    eosinophil_unit = models.TextField(max_length=255)
    eosinophil_reference_range = models.TextField(max_length=255)
    eosinophil_comments = models.TextField(max_length=255)

    basophil = models.TextField(max_length=255)
    basophil_unit = models.TextField(max_length=255)
    basophil_reference_range = models.TextField(max_length=255)
    basophil_comments = models.TextField(max_length=255)

    peripheral_blood_smear_rbc_morphology = models.TextField(max_length=255)
    peripheral_blood_smear_parasites = models.TextField(max_length=255)
    peripheral_blood_smear_others = models.TextField(max_length=255)

    def __str__(self):
        return f"Blood Test Report {self.id}"

    
class RoutineSugarTests(BaseModel):
    emp_no = models.TextField(max_length=200)
    glucose_f = models.TextField(max_length=255)
    glucose_f_unit = models.TextField(max_length=255)
    glucose_f_reference_range = models.TextField(max_length=255)
    glucose_f_comments = models.TextField(max_length=255)

    glucose_pp = models.TextField(max_length=255)
    glucose_pp_unit = models.TextField(max_length=255)
    glucose_pp_reference_range = models.TextField(max_length=255)
    glucose_pp_comments = models.TextField(max_length=255)

    random_blood_sugar = models.TextField(max_length=255)
    random_blood_sugar_unit = models.TextField(max_length=255)
    random_blood_sugar_reference_range = models.TextField(max_length=255)
    random_blood_sugar_comments = models.TextField(max_length=255)

    estimated_average_glucose = models.TextField(max_length=255)
    estimated_average_glucose_unit = models.TextField(max_length=255)
    estimated_average_glucose_reference_range = models.TextField(max_length=255)
    estimated_average_glucose_comments = models.TextField(max_length=255)

    hba1c = models.TextField(max_length=255)
    hba1c_unit = models.TextField(max_length=255)
    hba1c_reference_range = models.TextField(max_length=255)
    hba1c_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Routine Sugar Test Report {self.id}"
    


class RenalFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    urea = models.TextField(max_length=255)
    urea_unit = models.TextField(max_length=255)
    urea_reference_range = models.TextField(max_length=255)
    urea_comments = models.TextField(max_length=255)

    bun = models.TextField(max_length=255)
    bun_unit = models.TextField(max_length=255)
    bun_reference_range = models.TextField(max_length=255)
    bun_comments = models.TextField(max_length=255)

    calcium = models.TextField(max_length=255)
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range = models.TextField(max_length=255)
    calcium_comments = models.TextField(max_length=255)

    sodium = models.TextField(max_length=255)
    sodium_unit = models.TextField(max_length=255)
    sodium_reference_range = models.TextField(max_length=255)
    sodium_comments = models.TextField(max_length=255)

    potassium = models.TextField(max_length=255)
    potassium_unit = models.TextField(max_length=255)
    potassium_reference_range = models.TextField(max_length=255)
    potassium_comments = models.TextField(max_length=255)

    phosphorus = models.TextField(max_length=255)
    phosphorus_unit = models.TextField(max_length=255)
    phosphorus_reference_range = models.TextField(max_length=255)
    phosphorus_comments = models.TextField(max_length=255)

    serum_creatinine = models.TextField(max_length=255)
    serum_creatinine_unit = models.TextField(max_length=255)
    serum_creatinine_reference_range = models.TextField(max_length=255)
    serum_creatinine_comments = models.TextField(max_length=255)

    uric_acid = models.TextField(max_length=255)
    uric_acid_unit = models.TextField(max_length=255)
    uric_acid_reference_range = models.TextField(max_length=255)
    uric_acid_comments = models.TextField(max_length=255)

    chloride = models.TextField(max_length=255)
    chloride_unit = models.TextField(max_length=255)
    chloride_reference_range = models.TextField(max_length=255)
    chloride_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Renal Function Test Report {self.id}"



class LipidProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    calcium = models.TextField(max_length=255)
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range = models.TextField(max_length=255)
    calcium_comments = models.TextField(max_length=255)

    triglycerides = models.TextField(max_length=255)
    triglycerides_unit = models.TextField(max_length=255)
    triglycerides_reference_range = models.TextField(max_length=255)
    triglycerides_comments = models.TextField(max_length=255)

    hdl_cholesterol = models.TextField(max_length=255)
    hdl_cholesterol_unit = models.TextField(max_length=255)
    hdl_cholesterol_reference_range = models.TextField(max_length=255)
    hdl_cholesterol_comments = models.TextField(max_length=255)

    ldl_cholesterol = models.TextField(max_length=255)
    ldl_cholesterol_unit = models.TextField(max_length=255)
    ldl_cholesterol_reference_range = models.TextField(max_length=255)
    ldl_cholesterol_comments = models.TextField(max_length=255)

    chol_hdl_ratio = models.TextField(max_length=255)
    chol_hdl_ratio_unit = models.TextField(max_length=255)
    chol_hdl_ratio_reference_range = models.TextField(max_length=255)
    chol_hdl_ratio_comments = models.TextField(max_length=255)

    vldl_cholesterol = models.TextField(max_length=255)
    vldl_cholesterol_unit = models.TextField(max_length=255)
    vldl_cholesterol_reference_range = models.TextField(max_length=255)
    vldl_cholesterol_comments = models.TextField(max_length=255)

    ldl_hdl_ratio = models.TextField(max_length=255)
    ldl_hdl_ratio_unit = models.TextField(max_length=255)
    ldl_hdl_ratio_reference_range = models.TextField(max_length=255)
    ldl_hdl_ratio_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Lipid Profile Report {self.id}"




class LiverFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    bilirubin_total = models.TextField(max_length=255)
    bilirubin_total_unit = models.TextField(max_length=255)
    bilirubin_total_reference_range = models.TextField(max_length=255)
    bilirubin_total_comments = models.TextField(max_length=255)

    bilirubin_direct = models.TextField(max_length=255)
    bilirubin_direct_unit = models.TextField(max_length=255)
    bilirubin_direct_reference_range = models.TextField(max_length=255)
    bilirubin_direct_comments = models.TextField(max_length=255)

    bilirubin_indirect = models.TextField(max_length=255)
    bilirubin_indirect_unit = models.TextField(max_length=255)
    bilirubin_indirect_reference_range = models.TextField(max_length=255)
    bilirubin_indirect_comments = models.TextField(max_length=255)

    sgot_ast = models.TextField(max_length=255)
    sgot_ast_unit = models.TextField(max_length=255)
    sgot_ast_reference_range = models.TextField(max_length=255)
    sgot_ast_comments = models.TextField(max_length=255)

    sgpt_alt = models.TextField(max_length=255)
    sgpt_alt_unit = models.TextField(max_length=255)
    sgpt_alt_reference_range = models.TextField(max_length=255)
    sgpt_alt_comments = models.TextField(max_length=255)

    alkaline_phosphatase = models.TextField(max_length=255)
    alkaline_phosphatase_unit = models.TextField(max_length=255)
    alkaline_phosphatase_reference_range = models.TextField(max_length=255)
    alkaline_phosphatase_comments = models.TextField(max_length=255)

    total_protein = models.TextField(max_length=255)
    total_protein_unit = models.TextField(max_length=255)
    total_protein_reference_range = models.TextField(max_length=255)
    total_protein_comments = models.TextField(max_length=255)

    albumin_serum = models.TextField(max_length=255)
    albumin_serum_unit = models.TextField(max_length=255)
    albumin_serum_reference_range = models.TextField(max_length=255)
    albumin_serum_comments = models.TextField(max_length=255)

    globulin_serum = models.TextField(max_length=255)
    globulin_serum_unit = models.TextField(max_length=255)
    globulin_serum_reference_range = models.TextField(max_length=255)
    globulin_serum_comments = models.TextField(max_length=255)

    alb_glob_ratio = models.TextField(max_length=255)
    alb_glob_ratio_unit = models.TextField(max_length=255)
    alb_glob_ratio_reference_range = models.TextField(max_length=255)
    alb_glob_ratio_comments = models.TextField(max_length=255)

    gamma_glutamyl_transferase = models.TextField(max_length=255)
    gamma_glutamyl_transferase_unit = models.TextField(max_length=255)
    gamma_glutamyl_transferase_reference_range = models.TextField(max_length=255)
    gamma_glutamyl_transferase_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Liver Function Test Report {self.id}"
    



class ThyroidFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    t3_triiodothyronine = models.TextField(max_length=255)
    t3_unit = models.TextField(max_length=255)
    t3_reference_range = models.TextField(max_length=255)
    t3_comments = models.TextField(max_length=255)

    t4_thyroxine = models.TextField(max_length=255)
    t4_unit = models.TextField(max_length=255)
    t4_reference_range = models.TextField(max_length=255)
    t4_comments = models.TextField(max_length=255)

    tsh_thyroid_stimulating_hormone = models.TextField(max_length=255)
    tsh_unit = models.TextField(max_length=255)
    tsh_reference_range = models.TextField(max_length=255)
    tsh_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Thyroid Function Test Report {self.id}"



class CoagulationTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    prothrombin_time = models.TextField(max_length=255)
    prothrombin_time_unit = models.TextField(max_length=255)
    prothrombin_time_reference_range = models.TextField(max_length=255)
    prothrombin_time_comments = models.TextField(max_length=255)

    pt_inr = models.TextField(max_length=255)
    pt_inr_unit = models.TextField(max_length=255)
    pt_inr_reference_range = models.TextField(max_length=255)
    pt_inr_comments = models.TextField(max_length=255)

    clotting_time = models.TextField(max_length=255)
    clotting_time_unit = models.TextField(max_length=255)
    clotting_time_reference_range = models.TextField(max_length=255)
    clotting_time_comments = models.TextField(max_length=255)

    bleeding_time = models.TextField(max_length=255)
    bleeding_time_unit = models.TextField(max_length=255)
    bleeding_time_reference_range = models.TextField(max_length=255)
    bleeding_time_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Coagulation Test Report {self.id}"
    


class EnzymesCardiacProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    acid_phosphatase = models.TextField(max_length=255)
    acid_phosphatase_unit = models.TextField(max_length=255)
    acid_phosphatase_reference_range = models.TextField(max_length=255)
    acid_phosphatase_comments = models.TextField(max_length=255)

    adenosine_deaminase = models.TextField(max_length=255)
    adenosine_deaminase_unit = models.TextField(max_length=255)
    adenosine_deaminase_reference_range = models.TextField(max_length=255)
    adenosine_deaminase_comments = models.TextField(max_length=255)

    amylase = models.TextField(max_length=255)
    amylase_unit = models.TextField(max_length=255)
    amylase_reference_range = models.TextField(max_length=255)
    amylase_comments = models.TextField(max_length=255)

    ecg = models.TextField(max_length=255)
    ecg_unit = models.TextField(max_length=255)
    ecg_reference_range = models.TextField(max_length=255)
    ecg_comments = models.TextField(max_length=255)

    troponin_t = models.TextField(max_length=255)
    troponin_t_unit = models.TextField(max_length=255)
    troponin_t_reference_range = models.TextField(max_length=255)
    troponin_t_comments = models.TextField(max_length=255)

    cpk_total = models.TextField(max_length=255)
    cpk_total_unit = models.TextField(max_length=255)
    cpk_total_reference_range = models.TextField(max_length=255)
    cpk_total_comments = models.TextField(max_length=255)

    echo = models.TextField(max_length=255)
    echo_unit = models.TextField(max_length=255)
    echo_reference_range = models.TextField(max_length=255)
    echo_comments = models.TextField(max_length=255)

    lipase = models.TextField(max_length=255)
    lipase_unit = models.TextField(max_length=255)
    lipase_reference_range = models.TextField(max_length=255)
    lipase_comments = models.TextField(max_length=255)

    cpk_mb = models.TextField(max_length=255)
    cpk_mb_unit = models.TextField(max_length=255)
    cpk_mb_reference_range = models.TextField(max_length=255)
    cpk_mb_comments = models.TextField(max_length=255)

    tmt_normal = models.TextField(max_length=255)
    tmt_normal_unit = models.TextField(max_length=255)
    tmt_normal_reference_range = models.TextField(max_length=255)
    tmt_normal_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Enzymes & Cardiac Profile Report {self.id}"
    




class UrineRoutineTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    colour = models.TextField(max_length=255)
    colour_unit = models.TextField(max_length=255)
    colour_reference_range = models.TextField(max_length=255)
    colour_comments = models.TextField(max_length=255)

    appearance = models.TextField(max_length=255)
    appearance_unit = models.TextField(max_length=255)
    appearance_reference_range = models.TextField(max_length=255)
    appearance_comments = models.TextField(max_length=255)

    reaction_ph = models.TextField(max_length=255)
    reaction_ph_unit = models.TextField(max_length=255)
    reaction_ph_reference_range = models.TextField(max_length=255)
    reaction_ph_comments = models.TextField(max_length=255)

    specific_gravity = models.TextField(max_length=255)
    specific_gravity_unit = models.TextField(max_length=255)
    specific_gravity_reference_range = models.TextField(max_length=255)
    specific_gravity_comments = models.TextField(max_length=255)

    crystals = models.TextField(max_length=255)
    crystals_unit = models.TextField(max_length=255)
    crystals_reference_range = models.TextField(max_length=255)
    crystals_comments = models.TextField(max_length=255)

    bacteria = models.TextField(max_length=255)
    bacteria_unit = models.TextField(max_length=255)
    bacteria_reference_range = models.TextField(max_length=255)
    bacteria_comments = models.TextField(max_length=255)

    protein_albumin = models.TextField(max_length=255)
    protein_albumin_unit = models.TextField(max_length=255)
    protein_albumin_reference_range = models.TextField(max_length=255)
    protein_albumin_comments = models.TextField(max_length=255)

    glucose_urine = models.TextField(max_length=255)
    glucose_urine_unit = models.TextField(max_length=255)
    glucose_urine_reference_range = models.TextField(max_length=255)
    glucose_urine_comments = models.TextField(max_length=255)

    ketone_bodies = models.TextField(max_length=255)
    ketone_bodies_unit = models.TextField(max_length=255)
    ketone_bodies_reference_range = models.TextField(max_length=255)
    ketone_bodies_comments = models.TextField(max_length=255)

    urobilinogen = models.TextField(max_length=255)
    urobilinogen_unit = models.TextField(max_length=255)
    urobilinogen_reference_range = models.TextField(max_length=255)
    urobilinogen_comments = models.TextField(max_length=255)

    casts = models.TextField(max_length=255)
    casts_unit = models.TextField(max_length=255)
    casts_reference_range = models.TextField(max_length=255)
    casts_comments = models.TextField(max_length=255)

    bile_salts = models.TextField(max_length=255)
    bile_salts_unit = models.TextField(max_length=255)
    bile_salts_reference_range = models.TextField(max_length=255)
    bile_salts_comments = models.TextField(max_length=255)

    bile_pigments = models.TextField(max_length=255)
    bile_pigments_unit = models.TextField(max_length=255)
    bile_pigments_reference_range = models.TextField(max_length=255)
    bile_pigments_comments = models.TextField(max_length=255)

    wbc_pus_cells = models.TextField(max_length=255)
    wbc_pus_cells_unit = models.TextField(max_length=255)
    wbc_pus_cells_reference_range = models.TextField(max_length=255)
    wbc_pus_cells_comments = models.TextField(max_length=255)

    red_blood_cells = models.TextField(max_length=255)
    red_blood_cells_unit = models.TextField(max_length=255)
    red_blood_cells_reference_range = models.TextField(max_length=255)
    red_blood_cells_comments = models.TextField(max_length=255)

    epithelial_cells = models.TextField(max_length=255)
    epithelial_cells_unit = models.TextField(max_length=255)
    epithelial_cells_reference_range = models.TextField(max_length=255)
    epithelial_cells_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Urine Routine Test Report {self.id}"
    





class SerologyTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    screening_hiv = models.TextField(max_length=255)
    screening_hiv_unit = models.TextField(max_length=255)
    screening_hiv_reference_range = models.TextField(max_length=255)
    screening_hiv_comments = models.TextField(max_length=255)

    occult_blood = models.TextField(max_length=255)
    occult_blood_unit = models.TextField(max_length=255)
    occult_blood_reference_range = models.TextField(max_length=255)
    occult_blood_comments = models.TextField(max_length=255)

    cyst = models.TextField(max_length=255)
    cyst_unit = models.TextField(max_length=255)
    cyst_reference_range = models.TextField(max_length=255)
    cyst_comments = models.TextField(max_length=255)

    mucus = models.TextField(max_length=255)
    mucus_unit = models.TextField(max_length=255)
    mucus_reference_range = models.TextField(max_length=255)
    mucus_comments = models.TextField(max_length=255)

    pus_cells = models.TextField(max_length=255)
    pus_cells_unit = models.TextField(max_length=255)
    pus_cells_reference_range = models.TextField(max_length=255)
    pus_cells_comments = models.TextField(max_length=255)

    ova = models.TextField(max_length=255)
    ova_unit = models.TextField(max_length=255)
    ova_reference_range = models.TextField(max_length=255)
    ova_comments = models.TextField(max_length=255)

    rbcs = models.TextField(max_length=255)
    rbcs_unit = models.TextField(max_length=255)
    rbcs_reference_range = models.TextField(max_length=255)
    rbcs_comments = models.TextField(max_length=255)

    others = models.TextField(max_length=255)
    others_unit = models.TextField(max_length=255)
    others_reference_range = models.TextField(max_length=255)
    others_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Serology Test Report {self.id}"





class MotionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    colour_motion = models.TextField(max_length=255)
    colour_motion_unit = models.TextField(max_length=255)
    colour_motion_reference_range = models.TextField(max_length=255)
    colour_motion_comments = models.TextField(max_length=255)

    appearance_motion = models.TextField(max_length=255)
    appearance_motion_unit = models.TextField(max_length=255)
    appearance_motion_reference_range = models.TextField(max_length=255)
    appearance_motion_comments = models.TextField(max_length=255)

    occult_blood = models.TextField(max_length=255)
    occult_blood_unit = models.TextField(max_length=255)
    occult_blood_reference_range = models.TextField(max_length=255)
    occult_blood_comments = models.TextField(max_length=255)

    cyst = models.TextField(max_length=255)
    cyst_unit = models.TextField(max_length=255)
    cyst_reference_range = models.TextField(max_length=255)
    cyst_comments = models.TextField(max_length=255)

    mucus = models.TextField(max_length=255)
    mucus_unit = models.TextField(max_length=255)
    mucus_reference_range = models.TextField(max_length=255)
    mucus_comments = models.TextField(max_length=255)

    pus_cells = models.TextField(max_length=255)
    pus_cells_unit = models.TextField(max_length=255)
    pus_cells_reference_range = models.TextField(max_length=255)
    pus_cells_comments = models.TextField(max_length=255)

    ova = models.TextField(max_length=255)
    ova_unit = models.TextField(max_length=255)
    ova_reference_range = models.TextField(max_length=255)
    ova_comments = models.TextField(max_length=255)

    rbcs = models.TextField(max_length=255)
    rbcs_unit = models.TextField(max_length=255)
    rbcs_reference_range = models.TextField(max_length=255)
    rbcs_comments = models.TextField(max_length=255)

    others = models.TextField(max_length=255)
    others_unit = models.TextField(max_length=255)
    others_reference_range = models.TextField(max_length=255)
    others_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Motion Test Report {self.id}"





class CultureSensitivityTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    urine = models.TextField(max_length=255)
    urine_unit = models.TextField(max_length=255)
    urine_reference_range = models.TextField(max_length=255)
    urine_comments = models.TextField(max_length=255)

    motion = models.TextField(max_length=255)
    motion_unit = models.TextField(max_length=255)
    motion_reference_range = models.TextField(max_length=255)
    motion_comments = models.TextField(max_length=255)

    sputum = models.TextField(max_length=255)
    sputum_unit = models.TextField(max_length=255)
    sputum_reference_range = models.TextField(max_length=255)
    sputum_comments = models.TextField(max_length=255)

    blood = models.TextField(max_length=255)
    blood_unit = models.TextField(max_length=255)
    blood_reference_range = models.TextField(max_length=255)
    blood_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Culture & Sensitivity Test Report {self.id}"






class MensPack(BaseModel):
    emp_no = models.TextField(max_length=200)
    psa = models.TextField(max_length=255)
    psa_unit = models.TextField(max_length=255)
    psa_reference_range = models.TextField(max_length=255)
    psa_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Men's Pack Test Report {self.id}"


class OphthalmicReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    vision = models.TextField(max_length=255)
    vision_unit = models.TextField(max_length=255)
    vision_reference_range = models.TextField(max_length=255)
    vision_comments = models.TextField(max_length=255)

    color_vision = models.TextField(max_length=255)
    color_vision_unit = models.TextField(max_length=255)
    color_vision_reference_range = models.TextField(max_length=255)
    color_vision_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Ophthalmic Report {self.id}"



class USGReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    usg_abdomen = models.TextField(max_length=255)
    usg_abdomen_unit = models.TextField(max_length=255)
    usg_abdomen_reference_range = models.TextField(max_length=255)
    usg_abdomen_comments = models.TextField(max_length=255)

    usg_kub = models.TextField(max_length=255)
    usg_kub_unit = models.TextField(max_length=255)
    usg_kub_reference_range = models.TextField(max_length=255)
    usg_kub_comments = models.TextField(max_length=255)

    usg_pelvis = models.TextField(max_length=255)
    usg_pelvis_unit = models.TextField(max_length=255)
    usg_pelvis_reference_range = models.TextField(max_length=255)
    usg_pelvis_comments = models.TextField(max_length=255)

    usg_neck = models.TextField(max_length=255)
    usg_neck_unit = models.TextField(max_length=255)
    usg_neck_reference_range = models.TextField(max_length=255)
    usg_neck_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"USG Report {self.id}"




class MRIReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    mri_brain = models.TextField(max_length=255)
    mri_brain_unit = models.TextField(max_length=255)
    mri_brain_reference_range = models.TextField(max_length=255)
    mri_brain_comments = models.TextField(max_length=255)

    mri_lungs = models.TextField(max_length=255)
    mri_lungs_unit = models.TextField(max_length=255)
    mri_lungs_reference_range = models.TextField(max_length=255)
    mri_lungs_comments = models.TextField(max_length=255)

    mri_abdomen = models.TextField(max_length=255)
    mri_abdomen_unit = models.TextField(max_length=255)
    mri_abdomen_reference_range = models.TextField(max_length=255)
    mri_abdomen_comments = models.TextField(max_length=255)

    mri_spine = models.TextField(max_length=255)
    mri_spine_unit = models.TextField(max_length=255)
    mri_spine_reference_range = models.TextField(max_length=255)
    mri_spine_comments = models.TextField(max_length=255)

    mri_pelvis = models.TextField(max_length=255)
    mri_pelvis_unit = models.TextField(max_length=255)
    mri_pelvis_reference_range = models.TextField(max_length=255)
    mri_pelvis_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"MRI Report {self.id}"



class Appointment(BaseModel):
    class StatusChoices(models.TextChoices):
        INITIATE = 'initiate', 'Initiate'
        IN_PROGRESS = 'inprogress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        DEFAULT = 'default', 'Default'
    
    appointment_no = models.TextField(max_length = 255, blank=True)
    booked_date = models.DateField()
    role = models.TextField(max_length=100 , blank=True)
    name = models.TextField(max_length=100, blank=True)
    organization_name = models.TextField(max_length=100, blank=True)
    contractor_name = models.TextField(max_length=100, blank=True)
    consultated_by =models.TextField(max_length=100, blank=True)
    employer = models.TextField(max_length=255, blank=True)
    emp_no = models.TextField(max_length=255, blank=True)
    aadhar_no = models.TextField(max_length=225, blank=True)
    doctor_name = models.TextField(max_length=255, blank=True)
    purpose = models.TextField()
    date = models.DateField()
    time = models.TextField(max_length=225, blank=True)
    booked_by = models.TextField(max_length=255, blank=True)
    mrd_no = models.TextField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.INITIATE
    )

    def str(self):
        return f"{self.name} - {self.appointment_date}"


class FitnessAssessment(BaseModel):
    class PositiveNegativeChoices(models.TextChoices):
        POSITIVE = 'Positive', 'Positive'
        NEGATIVE = 'Negative', 'Negative'

    emp_no = models.CharField(max_length = 20)
    tremors = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices)
    romberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices)
    acrophobia = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices)
    trendelenberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices)
    conditional_fit_feilds = models.JSONField(blank=True)
    validity = models.DateField(blank=True, null=True)
    job_nature = models.JSONField(blank=True, null=True)
    overall_fitness = models.TextField()
    comments = models.TextField(blank=True, null=True)
    employer = models.TextField(blank=True, null=True)
    def _str_(self):
        return f"Fitness Assessment for {self.emp_no.emp_no} - {self.overall_fitness}"



class Prescription(BaseModel):

    tablets = models.JSONField(blank=True, null=True)
    injections = models.JSONField(blank=True, null=True)
    creams = models.JSONField(blank=True, null=True)
    others = models.JSONField(blank=True, null=True)
    submitted_by = models.CharField(max_length=50)
    issued_by = models.CharField(max_length=50)
    nurse_notes= models.TextField(blank=True, null=True)
    emp_no = models.CharField(max_length=20, blank=True, null=True)  

    def __str__(self):
        return f"Prescription #{self.id} - {self.patient_id or 'No Patient ID'}"

    class Meta:
        verbose_name = "Prescription"
        verbose_name_plural = "Prescriptions"


class VaccinationRecord(BaseModel):
    emp_no = models.CharField(max_length=30)  # Employee number
    vaccination = models.JSONField(default=list)

    def __str__(self):
        return f"Vaccination Record for {self.emp_no}"




class ReviewCategory(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    def _str_(self):
        return self.name

class Review(BaseModel):
    category = models.ForeignKey(ReviewCategory, on_delete=models.CASCADE, related_name="reviews")
    pid = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[("Male", "Male"), ("Female", "Female")])
    appointment_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[("Today", "Today"), ("Tomorrow", "Tomorrow"), ("Not Attempted", "Not Attempted")],
        default="Today"
    )

    def _str_(self):
        return f"{self.name} - {self.category.name}"
    
class Member(BaseModel):
    # Common fields
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=255, blank=True)
    job_nature = models.CharField(max_length=255, blank=True)
    date_exited = models.DateField(null=True, blank=True)
    doj = models.DateField(null=True, blank=True)

    # OHC Staff Specific Fields (Nullable)
    employee_number = models.CharField(max_length=50, unique=True, null=True, blank=True) #making unique property to false also
    

    # External Hospital Specific Fields (Nullable)
    hospital_name = models.CharField(max_length=255, null=True, blank=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True) #validation is needed
    aadhar = models.CharField(max_length=20, blank=True, null=True)  #validation is needed
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    

    def _str_(self):
        return self.name

class MedicalHistory(BaseModel):
    emp_no = models.CharField(max_length=255, null=True, blank=True)  # Add emp_no field
    personal_history = models.JSONField(null=True, blank=True)
    medical_data = models.JSONField(null=True, blank=True)
    female_worker = models.JSONField(null=True, blank=True)
    surgical_history = models.JSONField(null=True, blank=True)
    family_history = models.JSONField(null=True, blank=True)
    health_conditions = models.JSONField(null=True, blank=True)
    allergy_fields = models.JSONField(null=True, blank=True)
    allergy_comments = models.JSONField(null=True, blank=True)
    children_data = models.JSONField(null=True, blank=True)
    conditions = models.JSONField(null=True, blank=True)

    def _str_(self):
        return f"Medical History for Emp No: {self.emp_no}"
    

class Consultation(BaseModel):
    emp_no = models.CharField(max_length=20, blank=True, null=True)  # Employee number
    complaints = models.TextField(blank=True, null=True)  # Allowing empty complaints
    diagnosis = models.TextField(blank=True, null=True)
    notifiable_remarks = models.TextField(blank=True, null=True)
    examination = models.TextField(blank=True, null=True)
    lexamination = models.TextField(blank=True, null=True)
    obsnotes = models.TextField(blank=True, null=True)
    case_type = models.CharField(max_length=100, blank=True, null=True)  # You might want to use a CharField with choices here
    other_case_details = models.TextField(blank=True, null=True)
    investigation_details = models.TextField(blank=True, null=True)
    referral = models.CharField(max_length=10, blank=True, null=True)  # Could use a BooleanField if just Yes/No
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    doctor_name = models.CharField(max_length=255, blank=True, null=True)
    submitted_by_doctor = models.CharField(max_length=50, blank=True, null=True)
    submitted_by_nurse = models.CharField(max_length=50, blank=True, null=True)
    follow_up_date = models.DateField(blank=True, null=True)
    speaciality = models.CharField(max_length=50, blank = True, null = True)

    def __str__(self):
        return f"Consultation {self.id} - Emp No: {self.emp_no}"
    

class PharmacyStock(BaseModel):
    class MedicineFormChoices(models.TextChoices):
        TABLET = "Tablet", "Tablet"
        SYRUP = "Syrup", "Syrup"
        INJECTION = "Injection", "Injection"
        CREAMS = "Creams", "Creams"
        DROPS = "Drops", "Drops"
        FLUIDS = "Fluids", "Fluids"
        OTHER = "Other", "Other"

    medicine_form = models.CharField(max_length=20, choices=MedicineFormChoices.choices)
    item_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    removed_month = models.DateField(blank=True, null=True)  # Optional field

    def _str_(self):
        return f"{self.item_name} - {self.medicine_form}"


class ExpiryRegister(BaseModel):
    medicine_form = models.CharField(max_length=20)
    item_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    removed_date = models.DateField(auto_now_add=True)  # Date when it was removed

    def _str_(self):
        return f"{self.item_name} - {self.dose_volume} ({self.expiry_date})"
    
class Form17(models.Model):
    dept = models.CharField(max_length=255, blank=True, null=True)
    worksNumber = models.CharField(max_length=255, blank=True, null=True)
    workerName = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    dob = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    employmentDate = models.DateField(blank=True, null=True)
    leavingDate = models.DateField(blank=True, null=True)
    reason = models.CharField(max_length=255, blank=True, null=True)
    transferredTo = models.CharField(max_length=255, blank=True, null=True)
    jobNature = models.CharField(max_length=255, blank=True, null=True)
    rawMaterial = models.CharField(max_length=255, blank=True, null=True)
    medicalExamDate = models.DateField(blank=True, null=True)
    medicalExamResult = models.CharField(max_length=255, blank=True, null=True)
    suspensionDetails = models.CharField(max_length=255, blank=True, null=True)
    recertifiedDate = models.DateField(blank=True, null=True)
    unfitnessCertificate = models.CharField(max_length=255, blank=True, null=True)
    surgeonSignature = models.TextField(blank=True, null=True) # Store as text (base64 encoded)
    fmoSignature = models.TextField(blank=True, null=True)

    def _str_(self):
        return f"Form 17 - {self.workerName}"


class Form38(models.Model):
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    workerName = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    age = models.IntegerField(blank=True, null=True)
    jobNature = models.CharField(max_length=255, blank=True, null=True)
    employmentDate = models.DateField(blank=True, null=True)
    eyeExamDate = models.DateField(blank=True, null=True)
    result = models.CharField(max_length=255, blank=True, null=True)
    opthamologistSignature = models.TextField(blank=True, null=True)
    fmoSignature = models.TextField(blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def _str_(self):
        return f"Form 38 - {self.workerName}"

class Form39(models.Model):
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    workerName = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    age = models.IntegerField(blank=True, null=True)
    proposedEmploymentDate = models.DateField(blank=True, null=True)
    jobOccupation = models.CharField(max_length=255, blank=True, null=True)
    rawMaterialHandled = models.CharField(max_length=255, blank=True, null=True)
    medicalExamDate = models.DateField(blank=True, null=True)
    medicalExamResult = models.CharField(max_length=255, blank=True, null=True)
    certifiedFit = models.CharField(max_length=20, choices=[('fit', 'Fit'), ('unfit', 'Unfit'), ('conditional', 'Conditional')], blank=True, null=True)
    certifyingSurgeonSignature = models.TextField(blank=True, null=True)
    departmentSection = models.CharField(max_length=255, blank=True, null=True)

    def _str_(self):
        return f"Form 39 - {self.workerName}"

class Form40(models.Model):
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    dateOfEmployment = models.DateField(blank=True, null=True)
    workerName = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    age = models.IntegerField(blank=True, null=True)
    sonWifeDaughterOf = models.CharField(max_length=255, blank=True, null=True)
    natureOfJob = models.CharField(max_length=255, blank=True, null=True)
    urineResult = models.CharField(max_length=255, blank=True, null=True)
    bloodResult = models.CharField(max_length=255, blank=True, null=True)
    fecesResult = models.CharField(max_length=255, blank=True, null=True)
    xrayResult = models.CharField(max_length=255, blank=True, null=True)
    otherExamResult = models.CharField(max_length=255, blank=True, null=True)
    deworming = models.CharField(max_length=255, blank=True, null=True)
    typhoidVaccinationDate = models.DateField(blank=True, null=True)
    signatureOfFMO = models.TextField(blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def _str_(self):
        return f"Form 40 - {self.workerName}"


class Form27(models.Model):
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    nameOfWorks = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    dateOfBirth = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    nameOfTheFather = models.CharField(max_length=255, blank=True, null=True)
    natureOfJobOrOccupation = models.CharField(max_length=255, blank=True, null=True)
    signatureOfFMO = models.TextField(blank=True, null=True)
    descriptiveMarks = models.CharField(max_length=255, blank=True, null=True)
    signatureOfCertifyingSurgeon = models.TextField(blank=True, null=True)

    def _str_(self):
        return f"Form 27 - {self.nameOfWorks}"
    

from django.db import models
# Assuming you have a BaseModel or just use models.Model
# from .base import BaseModel # If you have a base model

# If not using a custom BaseModel, inherit from models.Model
class BaseModel(models.Model): # Example placeholder if you don't have one
    entry_date = models.DateField(auto_now_add=True, null=True, blank=True) # Example common field
    # Add other common fields like created_at, updated_at if needed
    class Meta:
        abstract = True # Important if this is just for inheritance


class SignificantNotes(BaseModel):
    # Choices based on React component's options (can be refined)
    COMMUNICABLE_DISEASE_CHOICES = [
        ('CD1', 'CD1'),
        ('CD2', 'CD2'),
        ('Unknown', 'Unknown'),
        ('', 'Select...'), # Optional: Allow empty selection
    ]
    INCIDENT_TYPE_CHOICES = [
        ('FAC', 'Fac'),
        ('LTI', 'LTI'),
        ('MTC', 'MTC'),
        ('FATAL', 'Fatal'),
         ('', 'Select...'),
    ]
    INCIDENT_CHOICES = [
        ('Occupational Injury', 'Occupational Injury'),
        ('Domestic Injury', 'Domestic Injury'),
        ('Communication Injury', 'Communication Injury'),
        ('Other Injury', 'Other Injury'),
         ('', 'Select...'),
    ]
    ILLNESS_TYPE_CHOICES = [
        ('Occupational Illness', 'Occupational Illness'),
        ('Occupational Disease', 'Occupational Disease'),
         ('', 'Select...'),
    ]

    emp_no = models.CharField(max_length=20, blank=True, null=True) # Link to employee
    # entry_date inherited from BaseModel or add here: models.DateField(null=True, blank=True)

    # Fields corresponding to the React state
    healthsummary = models.JSONField(default=list, blank=True, null=True)
    remarks = models.JSONField(default=list, blank=True, null=True)
    communicable_disease = models.CharField(
        max_length=50,
        choices=COMMUNICABLE_DISEASE_CHOICES,
        blank=True,
        null=True,
        default='', # Default to empty string for dropdowns
        verbose_name="Communicable Disease"
    )
    incident_type = models.CharField(
        max_length=50,
        choices=INCIDENT_TYPE_CHOICES,
        blank=True,
        null=True,
        default='',
        verbose_name="Incident Type"
    )
    incident = models.CharField(
        max_length=100,
        choices=INCIDENT_CHOICES,
        blank=True,
        null=True,
        default='',
        verbose_name="Incident"
    )
    illness_type = models.CharField(
        max_length=100,
        choices=ILLNESS_TYPE_CHOICES,
        blank=True,
        null=True,
        default='',
        verbose_name="Illness Type"
    )

    # Add other fields if necessary (e.g., submitted_by)

    def __str__(self):
        # Handle potential None for entry_date if not inheriting or not set
        date_str = self.entry_date.strftime('%Y-%m-%d') if self.entry_date else 'No Date'
        return f"Significant Notes for Emp {self.emp_no or 'N/A'} on {date_str}"

    class Meta:
        verbose_name = "Significant Note"
        verbose_name_plural = "Significant Notes"
        # Optional: Add ordering
        # ordering = ['-entry_date', 'emp_no']