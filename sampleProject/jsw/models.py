from django.db import models, transaction
from datetime import date, datetime

# --- Abstract Base Model ---
class BaseModel(models.Model):
    entry_date = models.DateField(auto_now=True)

    class Meta:
        abstract = True

# --- User Model ---
class user(BaseModel):
    name = models.TextField(max_length=50)
    password = models.TextField(max_length=50)
    accessLevel = models.TextField(max_length=50)

    def __str__(self):
        return self.name

# --- Employee Details Model ---
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
    # ... (keep all existing fields from employee_details as they were) ...
    type = models.CharField(max_length=50, choices=EMPLOYEE_TYPES, default='Employee')
    type_of_visit = models.CharField(max_length=255, blank=True)
    register = models.CharField(max_length=255, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    name = models.CharField(max_length=225)
    dob = models.DateField(null=True, blank=True)
    sex = models.CharField(max_length=50, blank=True)
    aadhar = models.CharField(max_length=225, blank=True)
    bloodgrp = models.CharField(max_length=225, blank=True)
    identification_marks1 = models.CharField(max_length=225, blank=True)
    identification_marks2 = models.CharField(max_length=225, blank=True)
    marital_status = models.CharField(max_length=50, choices=MARITAL_STATUS_CHOICES, blank=True)
    emp_no = models.CharField(max_length=200,blank=True)
    employer = models.CharField(max_length=225, blank=True)
    designation = models.CharField(max_length=225, blank=True)
    department = models.CharField(max_length=225, blank=True)
    job_nature = models.CharField(max_length=225, blank=True)
    doj = models.DateField(null=True, blank=True)
    moj = models.CharField(max_length=225, blank=True)
    phone_Personal = models.CharField(max_length=225, blank=True)
    mail_id_Personal = models.EmailField(max_length=225, blank=True)
    emergency_contact_person = models.CharField(max_length=225, blank=True)
    phone_Office = models.CharField(max_length=225, blank=True)
    mail_id_Office = models.EmailField(max_length=225, blank=True)
    emergency_contact_relation = models.CharField(max_length=225, blank=True)
    mail_id_Emergency_Contact_Person = models.EmailField(max_length=225, blank=True)
    emergency_contact_phone = models.CharField(max_length=225, blank=True)
    role = models.CharField(max_length=50, blank=True)
    permanent_address = models.TextField(blank=True)
    permanent_area = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=50, blank=True)
    permanent_nationality = models.CharField(max_length=50, blank=True)
    permanent_state = models.CharField(max_length=50, blank=True)
    residential_address = models.TextField(blank=True)
    residential_area = models.CharField(max_length=50, blank=True)
    residential_nationality = models.CharField(max_length=50, blank=True)
    residential_state = models.CharField(max_length=50, blank=True)
    profilepic = models.ImageField(upload_to='profilepics', blank=True, null=True)
    profilepic_url = models.URLField(max_length=255, blank=True)
    country_id = models.CharField(max_length=255, blank=True)
    other_site_id = models.CharField(max_length=255, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    addressOrganization = models.CharField(max_length=255, blank=True)
    visiting_department = models.CharField(max_length=255, blank=True)
    visiting_date_from = models.DateField(null=True, blank=True)
    stay_in_guest_house = models.CharField(max_length=50, blank=True)
    visiting_purpose = models.CharField(max_length=255, blank=True)
    year = models.CharField(max_length=4, blank=True)
    batch = models.CharField(max_length=255, blank=True)
    hospitalName = models.CharField(max_length=255, blank=True)
    campName = models.CharField(max_length=255, blank=True)
    contractName = models.CharField(max_length=255, blank=True)
    prevcontractName = models.CharField(max_length=255, blank=True)
    old_emp_no = models.CharField(max_length=200, blank=True)
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    employee_status = models.CharField(max_length=255, blank=True)
    since_date = models.DateField(blank=True, null=True)
    transfer_details = models.TextField(blank=True, null=True)
    other_reason_details = models.TextField(blank=True, null=True)
    mrdNo = models.CharField(max_length=255, blank=True)
    guardian = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.emp_no if self.emp_no else f"Employee {self.id}" # Handle missing emp_no

    def save(self, *args, **kwargs):
        if not self.profilepic:
            self.profilepic_url = ''
        super().save(*args, **kwargs)


# --- Dashboard Model ---
class Dashboard(BaseModel):
    # ... (keep all existing fields from Dashboard as they were) ...
    
    emp_no = models.TextField(max_length=200)
    type = models.TextField(max_length=255)
    type_of_visit = models.TextField(max_length=255)
    register = models.TextField(max_length=255)
    purpose = models.TextField(max_length=255)
    date = models.DateField(auto_now=True)
    year = models.CharField(max_length=4, blank=True)
    batch = models.CharField(max_length=255, blank=True)
    hospitalName = models.CharField(max_length=255, blank=True)
    campName = models.CharField(max_length=255, blank=True)
    contractName = models.CharField(max_length=255, blank=True)
    prevcontractName = models.CharField(max_length=255, blank=True)
    old_emp_no = models.CharField(max_length=200, blank=True)
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    mrdNo = models.CharField(max_length=255, blank=True)
    visitOutcome = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Dashboard Record {self.id}"


# --- Vitals Model ---
class vitals(BaseModel):
    # ... (keep all existing fields from vitals as they were) ...
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
    manual = models.FileField(upload_to= 'manual/', blank=True, null=True)
    fc = models.FileField(upload_to= 'fc/', blank = True, null=True)
    report = models.FileField(upload_to= 'report/', blank = True, null=True)
    self_declared = models.FileField(upload_to= 'self_declared/', blank = True, null=True)

    def __str__(self):
        return self.emp_no


# --- Mock Drills Model ---
class mockdrills(BaseModel):
    # ... (keep all existing fields from mockdrills as they were) ...
    # Note: emp_no appears twice, removed the second one. vitals appears twice, kept the second.
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
    complaints= models.TextField(max_length=200)
    treatment= models.TextField(max_length=200)
    referal= models.TextField(max_length=200)
    ambulance_driver= models.TextField(max_length=200)
    staff_name= models.TextField(max_length=200)
    OHC_doctor= models.TextField(max_length=200)
    staff_nurse= models.TextField(max_length=200)
    vitals= models.TextField(max_length=200) # Second instance, kept this one
    action_completion= models.TextField(max_length=200)
    responsible= models.TextField(max_length=200)

    def __str__(self):
        return self.emp_no


# --- Events and Camps Model ---
class eventsandcamps(BaseModel):
    # ... (keep all existing fields from eventsandcamps as they were) ...
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

    def __str__(self):
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


# --- Haematology Model --- *MODIFIED*
class heamatalogy(BaseModel):
    emp_no = models.TextField(max_length=200)
    hemoglobin = models.TextField(max_length=255)
    hemoglobin_unit = models.TextField(max_length=255)
    hemoglobin_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    hemoglobin_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    hemoglobin_comments = models.TextField(max_length=255)

    total_rbc = models.TextField(max_length=255)
    total_rbc_unit = models.TextField(max_length=255)
    total_rbc_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_rbc_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_rbc_comments = models.TextField(max_length=255)

    total_wbc = models.TextField(max_length=255)
    total_wbc_unit = models.TextField(max_length=255)
    total_wbc_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_wbc_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_wbc_comments = models.TextField(max_length=255)

    neutrophil = models.TextField(max_length=255)
    neutrophil_unit = models.TextField(max_length=255)
    neutrophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    neutrophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    neutrophil_comments = models.TextField(max_length=255)

    monocyte = models.TextField(max_length=255)
    monocyte_unit = models.TextField(max_length=255)
    monocyte_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    monocyte_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    monocyte_comments = models.TextField(max_length=255)

    pcv = models.TextField(max_length=255)
    pcv_unit = models.TextField(max_length=255)
    pcv_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    pcv_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    pcv_comments = models.TextField(max_length=255)

    mcv = models.TextField(max_length=255)
    mcv_unit = models.TextField(max_length=255)
    mcv_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mcv_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mcv_comments = models.TextField(max_length=255)

    mch = models.TextField(max_length=255)
    mch_unit = models.TextField(max_length=255)
    mch_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mch_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mch_comments = models.TextField(max_length=255)

    lymphocyte = models.TextField(max_length=255)
    lymphocyte_unit = models.TextField(max_length=255)
    lymphocyte_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    lymphocyte_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    lymphocyte_comments = models.TextField(max_length=255)

    esr = models.TextField(max_length=255)
    esr_unit = models.TextField(max_length=255)
    esr_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    esr_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    esr_comments = models.TextField(max_length=255)

    mchc = models.TextField(max_length=255)
    mchc_unit = models.TextField(max_length=255)
    mchc_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mchc_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mchc_comments = models.TextField(max_length=255)

    platelet_count = models.TextField(max_length=255)
    platelet_count_unit = models.TextField(max_length=255)
    platelet_count_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    platelet_count_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    platelet_count_comments = models.TextField(max_length=255)

    rdw = models.TextField(max_length=255)
    rdw_unit = models.TextField(max_length=255)
    rdw_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    rdw_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    rdw_comments = models.TextField(max_length=255)

    eosinophil = models.TextField(max_length=255)
    eosinophil_unit = models.TextField(max_length=255)
    eosinophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    eosinophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    eosinophil_comments = models.TextField(max_length=255)

    basophil = models.TextField(max_length=255)
    basophil_unit = models.TextField(max_length=255)
    basophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    basophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    basophil_comments = models.TextField(max_length=255)

    peripheral_blood_smear_rbc_morphology = models.TextField(max_length=255)
    peripheral_blood_smear_parasites = models.TextField(max_length=255)
    peripheral_blood_smear_others = models.TextField(max_length=255)

    def __str__(self):
        return f"Blood Test Report {self.id}"

# --- Routine Sugar Tests Model --- *MODIFIED*
class RoutineSugarTests(BaseModel):
    emp_no = models.TextField(max_length=200)
    glucose_f = models.TextField(max_length=255)
    glucose_f_unit = models.TextField(max_length=255)
    glucose_f_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_f_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_f_comments = models.TextField(max_length=255)

    glucose_pp = models.TextField(max_length=255)
    glucose_pp_unit = models.TextField(max_length=255)
    glucose_pp_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_pp_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_pp_comments = models.TextField(max_length=255)

    random_blood_sugar = models.TextField(max_length=255)
    random_blood_sugar_unit = models.TextField(max_length=255)
    random_blood_sugar_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    random_blood_sugar_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    random_blood_sugar_comments = models.TextField(max_length=255)

    estimated_average_glucose = models.TextField(max_length=255)
    estimated_average_glucose_unit = models.TextField(max_length=255)
    estimated_average_glucose_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    estimated_average_glucose_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    estimated_average_glucose_comments = models.TextField(max_length=255)

    hba1c = models.TextField(max_length=255)
    hba1c_unit = models.TextField(max_length=255)
    hba1c_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    hba1c_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    hba1c_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Routine Sugar Test Report {self.id}"

# --- Renal Function Test Model --- *MODIFIED*
class RenalFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    urea = models.TextField(max_length=255)
    urea_unit = models.TextField(max_length=255)
    urea_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    urea_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    urea_comments = models.TextField(max_length=255)

    bun = models.TextField(max_length=255)
    bun_unit = models.TextField(max_length=255)
    bun_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bun_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bun_comments = models.TextField(max_length=255)

    calcium = models.TextField(max_length=255)
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    calcium_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    calcium_comments = models.TextField(max_length=255)

    sodium = models.TextField(max_length=255)
    sodium_unit = models.TextField(max_length=255)
    sodium_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    sodium_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    sodium_comments = models.TextField(max_length=255)

    potassium = models.TextField(max_length=255)
    potassium_unit = models.TextField(max_length=255)
    potassium_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    potassium_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    potassium_comments = models.TextField(max_length=255)

    phosphorus = models.TextField(max_length=255)
    phosphorus_unit = models.TextField(max_length=255)
    phosphorus_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    phosphorus_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    phosphorus_comments = models.TextField(max_length=255)

    serum_creatinine = models.TextField(max_length=255)
    serum_creatinine_unit = models.TextField(max_length=255)
    serum_creatinine_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    serum_creatinine_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    serum_creatinine_comments = models.TextField(max_length=255)

    uric_acid = models.TextField(max_length=255)
    uric_acid_unit = models.TextField(max_length=255)
    uric_acid_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    uric_acid_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    uric_acid_comments = models.TextField(max_length=255)

    chloride = models.TextField(max_length=255)
    chloride_unit = models.TextField(max_length=255)
    chloride_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    chloride_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    chloride_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Renal Function Test Report {self.id}"

# --- Lipid Profile Model --- *MODIFIED*
class LipidProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    calcium = models.TextField(max_length=255) # Note: Calcium usually in RFT, consider if intended here
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    calcium_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    calcium_comments = models.TextField(max_length=255)

    triglycerides = models.TextField(max_length=255)
    triglycerides_unit = models.TextField(max_length=255)
    triglycerides_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    triglycerides_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    triglycerides_comments = models.TextField(max_length=255)

    hdl_cholesterol = models.TextField(max_length=255)
    hdl_cholesterol_unit = models.TextField(max_length=255)
    hdl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    hdl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    hdl_cholesterol_comments = models.TextField(max_length=255)

    ldl_cholesterol = models.TextField(max_length=255)
    ldl_cholesterol_unit = models.TextField(max_length=255)
    ldl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ldl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ldl_cholesterol_comments = models.TextField(max_length=255)

    chol_hdl_ratio = models.TextField(max_length=255)
    chol_hdl_ratio_unit = models.TextField(max_length=255)
    chol_hdl_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    chol_hdl_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    chol_hdl_ratio_comments = models.TextField(max_length=255)

    vldl_cholesterol = models.TextField(max_length=255)
    vldl_cholesterol_unit = models.TextField(max_length=255)
    vldl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    vldl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    vldl_cholesterol_comments = models.TextField(max_length=255)

    ldl_hdl_ratio = models.TextField(max_length=255)
    ldl_hdl_ratio_unit = models.TextField(max_length=255)
    ldl_hdl_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ldl_hdl_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ldl_hdl_ratio_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Lipid Profile Report {self.id}"

# --- Liver Function Test Model --- *MODIFIED*
class LiverFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    bilirubin_total = models.TextField(max_length=255)
    bilirubin_total_unit = models.TextField(max_length=255)
    bilirubin_total_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_total_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_total_comments = models.TextField(max_length=255)

    bilirubin_direct = models.TextField(max_length=255)
    bilirubin_direct_unit = models.TextField(max_length=255)
    bilirubin_direct_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_direct_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_direct_comments = models.TextField(max_length=255)

    bilirubin_indirect = models.TextField(max_length=255)
    bilirubin_indirect_unit = models.TextField(max_length=255)
    bilirubin_indirect_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_indirect_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bilirubin_indirect_comments = models.TextField(max_length=255)

    sgot_ast = models.TextField(max_length=255)
    sgot_ast_unit = models.TextField(max_length=255)
    sgot_ast_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    sgot_ast_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    sgot_ast_comments = models.TextField(max_length=255)

    sgpt_alt = models.TextField(max_length=255)
    sgpt_alt_unit = models.TextField(max_length=255)
    sgpt_alt_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    sgpt_alt_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    sgpt_alt_comments = models.TextField(max_length=255)

    alkaline_phosphatase = models.TextField(max_length=255)
    alkaline_phosphatase_unit = models.TextField(max_length=255)
    alkaline_phosphatase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    alkaline_phosphatase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    alkaline_phosphatase_comments = models.TextField(max_length=255)

    total_protein = models.TextField(max_length=255)
    total_protein_unit = models.TextField(max_length=255)
    total_protein_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_protein_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    total_protein_comments = models.TextField(max_length=255)

    albumin_serum = models.TextField(max_length=255)
    albumin_serum_unit = models.TextField(max_length=255)
    albumin_serum_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    albumin_serum_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    albumin_serum_comments = models.TextField(max_length=255)

    globulin_serum = models.TextField(max_length=255)
    globulin_serum_unit = models.TextField(max_length=255)
    globulin_serum_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    globulin_serum_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    globulin_serum_comments = models.TextField(max_length=255)

    alb_glob_ratio = models.TextField(max_length=255)
    alb_glob_ratio_unit = models.TextField(max_length=255)
    alb_glob_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    alb_glob_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    alb_glob_ratio_comments = models.TextField(max_length=255)

    gamma_glutamyl_transferase = models.TextField(max_length=255)
    gamma_glutamyl_transferase_unit = models.TextField(max_length=255)
    gamma_glutamyl_transferase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    gamma_glutamyl_transferase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    gamma_glutamyl_transferase_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Liver Function Test Report {self.id}"

# --- Thyroid Function Test Model --- *MODIFIED*
class ThyroidFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    t3_triiodothyronine = models.TextField(max_length=255)
    t3_unit = models.TextField(max_length=255)
    t3_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    t3_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    t3_comments = models.TextField(max_length=255)

    t4_thyroxine = models.TextField(max_length=255)
    t4_unit = models.TextField(max_length=255)
    t4_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    t4_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    t4_comments = models.TextField(max_length=255)

    tsh_thyroid_stimulating_hormone = models.TextField(max_length=255)
    tsh_unit = models.TextField(max_length=255)
    tsh_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    tsh_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    tsh_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Thyroid Function Test Report {self.id}"

# --- Coagulation Test Model --- *MODIFIED*
class CoagulationTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    prothrombin_time = models.TextField(max_length=255)
    prothrombin_time_unit = models.TextField(max_length=255)
    prothrombin_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    prothrombin_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    prothrombin_time_comments = models.TextField(max_length=255)

    pt_inr = models.TextField(max_length=255)
    pt_inr_unit = models.TextField(max_length=255)
    pt_inr_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    pt_inr_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    pt_inr_comments = models.TextField(max_length=255)

    clotting_time = models.TextField(max_length=255)
    clotting_time_unit = models.TextField(max_length=255)
    clotting_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    clotting_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    clotting_time_comments = models.TextField(max_length=255)

    bleeding_time = models.TextField(max_length=255)
    bleeding_time_unit = models.TextField(max_length=255)
    bleeding_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bleeding_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bleeding_time_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Coagulation Test Report {self.id}"

# --- Enzymes Cardiac Profile Model --- *MODIFIED*
class EnzymesCardiacProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    acid_phosphatase = models.TextField(max_length=255)
    acid_phosphatase_unit = models.TextField(max_length=255)
    acid_phosphatase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    acid_phosphatase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    acid_phosphatase_comments = models.TextField(max_length=255)

    adenosine_deaminase = models.TextField(max_length=255)
    adenosine_deaminase_unit = models.TextField(max_length=255)
    adenosine_deaminase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    adenosine_deaminase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    adenosine_deaminase_comments = models.TextField(max_length=255)

    amylase = models.TextField(max_length=255)
    amylase_unit = models.TextField(max_length=255)
    amylase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    amylase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    amylase_comments = models.TextField(max_length=255)

    ecg = models.TextField(max_length=255)
    ecg_unit = models.TextField(max_length=255)
    ecg_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ecg_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ecg_comments = models.TextField(max_length=255)

    troponin_t = models.TextField(max_length=255)
    troponin_t_unit = models.TextField(max_length=255)
    troponin_t_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    troponin_t_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    troponin_t_comments = models.TextField(max_length=255)

    cpk_total = models.TextField(max_length=255)
    cpk_total_unit = models.TextField(max_length=255)
    cpk_total_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    cpk_total_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    cpk_total_comments = models.TextField(max_length=255)

    echo = models.TextField(max_length=255)
    echo_unit = models.TextField(max_length=255)
    echo_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    echo_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    echo_comments = models.TextField(max_length=255)

    lipase = models.TextField(max_length=255)
    lipase_unit = models.TextField(max_length=255)
    lipase_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    lipase_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    lipase_comments = models.TextField(max_length=255)

    cpk_mb = models.TextField(max_length=255)
    cpk_mb_unit = models.TextField(max_length=255)
    cpk_mb_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    cpk_mb_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    cpk_mb_comments = models.TextField(max_length=255)

    tmt_normal = models.TextField(max_length=255)
    tmt_normal_unit = models.TextField(max_length=255)
    tmt_normal_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    tmt_normal_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    tmt_normal_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Enzymes & Cardiac Profile Report {self.id}"

# --- Urine Routine Test Model --- *MODIFIED*
class UrineRoutineTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    colour = models.TextField(max_length=255)
    colour_unit = models.TextField(max_length=255)
    colour_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    colour_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    colour_comments = models.TextField(max_length=255)

    appearance = models.TextField(max_length=255)
    appearance_unit = models.TextField(max_length=255)
    appearance_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    appearance_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    appearance_comments = models.TextField(max_length=255)

    reaction_ph = models.TextField(max_length=255)
    reaction_ph_unit = models.TextField(max_length=255)
    reaction_ph_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    reaction_ph_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    reaction_ph_comments = models.TextField(max_length=255)

    specific_gravity = models.TextField(max_length=255)
    specific_gravity_unit = models.TextField(max_length=255)
    specific_gravity_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    specific_gravity_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    specific_gravity_comments = models.TextField(max_length=255)

    crystals = models.TextField(max_length=255)
    crystals_unit = models.TextField(max_length=255)
    crystals_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    crystals_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    crystals_comments = models.TextField(max_length=255)

    bacteria = models.TextField(max_length=255)
    bacteria_unit = models.TextField(max_length=255)
    bacteria_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bacteria_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bacteria_comments = models.TextField(max_length=255)

    protein_albumin = models.TextField(max_length=255)
    protein_albumin_unit = models.TextField(max_length=255)
    protein_albumin_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    protein_albumin_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    protein_albumin_comments = models.TextField(max_length=255)

    glucose_urine = models.TextField(max_length=255)
    glucose_urine_unit = models.TextField(max_length=255)
    glucose_urine_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_urine_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    glucose_urine_comments = models.TextField(max_length=255)

    ketone_bodies = models.TextField(max_length=255)
    ketone_bodies_unit = models.TextField(max_length=255)
    ketone_bodies_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ketone_bodies_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ketone_bodies_comments = models.TextField(max_length=255)

    urobilinogen = models.TextField(max_length=255)
    urobilinogen_unit = models.TextField(max_length=255)
    urobilinogen_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    urobilinogen_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    urobilinogen_comments = models.TextField(max_length=255)

    casts = models.TextField(max_length=255)
    casts_unit = models.TextField(max_length=255)
    casts_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    casts_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    casts_comments = models.TextField(max_length=255)

    bile_salts = models.TextField(max_length=255)
    bile_salts_unit = models.TextField(max_length=255)
    bile_salts_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bile_salts_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bile_salts_comments = models.TextField(max_length=255)

    bile_pigments = models.TextField(max_length=255)
    bile_pigments_unit = models.TextField(max_length=255)
    bile_pigments_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    bile_pigments_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    bile_pigments_comments = models.TextField(max_length=255)

    wbc_pus_cells = models.TextField(max_length=255)
    wbc_pus_cells_unit = models.TextField(max_length=255)
    wbc_pus_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    wbc_pus_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    wbc_pus_cells_comments = models.TextField(max_length=255)

    red_blood_cells = models.TextField(max_length=255)
    red_blood_cells_unit = models.TextField(max_length=255)
    red_blood_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    red_blood_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    red_blood_cells_comments = models.TextField(max_length=255)

    epithelial_cells = models.TextField(max_length=255)
    epithelial_cells_unit = models.TextField(max_length=255)
    epithelial_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    epithelial_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    epithelial_cells_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Urine Routine Test Report {self.id}"

# --- Serology Test Model --- *MODIFIED*
class SerologyTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    screening_hiv = models.TextField(max_length=255)
    screening_hiv_unit = models.TextField(max_length=255)
    screening_hiv_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    screening_hiv_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    screening_hiv_comments = models.TextField(max_length=255)

    occult_blood = models.TextField(max_length=255)
    occult_blood_unit = models.TextField(max_length=255)
    occult_blood_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    occult_blood_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    occult_blood_comments = models.TextField(max_length=255)

    cyst = models.TextField(max_length=255)
    cyst_unit = models.TextField(max_length=255)
    cyst_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    cyst_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    cyst_comments = models.TextField(max_length=255)

    mucus = models.TextField(max_length=255)
    mucus_unit = models.TextField(max_length=255)
    mucus_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mucus_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mucus_comments = models.TextField(max_length=255)

    pus_cells = models.TextField(max_length=255)
    pus_cells_unit = models.TextField(max_length=255)
    pus_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    pus_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    pus_cells_comments = models.TextField(max_length=255)

    ova = models.TextField(max_length=255)
    ova_unit = models.TextField(max_length=255)
    ova_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ova_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ova_comments = models.TextField(max_length=255)

    rbcs = models.TextField(max_length=255)
    rbcs_unit = models.TextField(max_length=255)
    rbcs_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    rbcs_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    rbcs_comments = models.TextField(max_length=255)

    others = models.TextField(max_length=255)
    others_unit = models.TextField(max_length=255)
    others_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    others_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    others_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Serology Test Report {self.id}"

# --- Motion Test Model --- *MODIFIED*
class MotionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    colour_motion = models.TextField(max_length=255)
    colour_motion_unit = models.TextField(max_length=255)
    colour_motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    colour_motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    colour_motion_comments = models.TextField(max_length=255)

    appearance_motion = models.TextField(max_length=255)
    appearance_motion_unit = models.TextField(max_length=255)
    appearance_motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    appearance_motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    appearance_motion_comments = models.TextField(max_length=255)

    occult_blood = models.TextField(max_length=255)
    occult_blood_unit = models.TextField(max_length=255)
    occult_blood_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    occult_blood_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    occult_blood_comments = models.TextField(max_length=255)

    cyst = models.TextField(max_length=255)
    cyst_unit = models.TextField(max_length=255)
    cyst_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    cyst_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    cyst_comments = models.TextField(max_length=255)

    mucus = models.TextField(max_length=255)
    mucus_unit = models.TextField(max_length=255)
    mucus_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mucus_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mucus_comments = models.TextField(max_length=255)

    pus_cells = models.TextField(max_length=255)
    pus_cells_unit = models.TextField(max_length=255)
    pus_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    pus_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    pus_cells_comments = models.TextField(max_length=255)

    ova = models.TextField(max_length=255)
    ova_unit = models.TextField(max_length=255)
    ova_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    ova_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    ova_comments = models.TextField(max_length=255)

    rbcs = models.TextField(max_length=255)
    rbcs_unit = models.TextField(max_length=255)
    rbcs_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    rbcs_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    rbcs_comments = models.TextField(max_length=255)

    others = models.TextField(max_length=255)
    others_unit = models.TextField(max_length=255)
    others_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    others_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    others_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Motion Test Report {self.id}"

# --- Culture Sensitivity Test Model --- *MODIFIED*
class CultureSensitivityTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    urine = models.TextField(max_length=255)
    urine_unit = models.TextField(max_length=255)
    urine_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    urine_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    urine_comments = models.TextField(max_length=255)

    motion = models.TextField(max_length=255)
    motion_unit = models.TextField(max_length=255)
    motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    motion_comments = models.TextField(max_length=255)

    sputum = models.TextField(max_length=255)
    sputum_unit = models.TextField(max_length=255)
    sputum_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    sputum_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    sputum_comments = models.TextField(max_length=255)

    blood = models.TextField(max_length=255)
    blood_unit = models.TextField(max_length=255)
    blood_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    blood_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    blood_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Culture & Sensitivity Test Report {self.id}"

# --- Mens Pack Model --- *MODIFIED*
class MensPack(BaseModel):
    emp_no = models.TextField(max_length=200)
    psa = models.TextField(max_length=255)
    psa_unit = models.TextField(max_length=255)
    psa_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    psa_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    psa_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Men's Pack Test Report {self.id}"

# --- Ophthalmic Report Model --- *MODIFIED*
class OphthalmicReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    vision = models.TextField(max_length=255)
    vision_unit = models.TextField(max_length=255)
    vision_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    vision_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    vision_comments = models.TextField(max_length=255)

    color_vision = models.TextField(max_length=255)
    color_vision_unit = models.TextField(max_length=255)
    color_vision_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    color_vision_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    color_vision_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Ophthalmic Report {self.id}"

# --- USG Report Model --- *MODIFIED*
class USGReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    usg_abdomen = models.TextField(max_length=255)
    usg_abdomen_unit = models.TextField(max_length=255)
    usg_abdomen_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_abdomen_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_abdomen_comments = models.TextField(max_length=255)

    usg_kub = models.TextField(max_length=255)
    usg_kub_unit = models.TextField(max_length=255)
    usg_kub_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_kub_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_kub_comments = models.TextField(max_length=255)

    usg_pelvis = models.TextField(max_length=255)
    usg_pelvis_unit = models.TextField(max_length=255)
    usg_pelvis_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_pelvis_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_pelvis_comments = models.TextField(max_length=255)

    usg_neck = models.TextField(max_length=255)
    usg_neck_unit = models.TextField(max_length=255)
    usg_neck_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_neck_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    usg_neck_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"USG Report {self.id}"

# --- MRI Report Model --- *MODIFIED*
class MRIReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    mri_brain = models.TextField(max_length=255)
    mri_brain_unit = models.TextField(max_length=255)
    mri_brain_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_brain_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_brain_comments = models.TextField(max_length=255)

    mri_lungs = models.TextField(max_length=255)
    mri_lungs_unit = models.TextField(max_length=255)
    mri_lungs_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_lungs_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_lungs_comments = models.TextField(max_length=255)

    mri_abdomen = models.TextField(max_length=255)
    mri_abdomen_unit = models.TextField(max_length=255)
    mri_abdomen_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_abdomen_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_abdomen_comments = models.TextField(max_length=255)

    mri_spine = models.TextField(max_length=255)
    mri_spine_unit = models.TextField(max_length=255)
    mri_spine_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_spine_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_spine_comments = models.TextField(max_length=255)

    mri_pelvis = models.TextField(max_length=255)
    mri_pelvis_unit = models.TextField(max_length=255)
    mri_pelvis_reference_range_from = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_pelvis_reference_range_to = models.TextField(max_length=50, null=True, blank=True) # Changed
    mri_pelvis_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"MRI Report {self.id}"

# --- Appointment Model ---
class Appointment(BaseModel):
    class StatusChoices(models.TextChoices):
        INITIATE = 'initiate', 'Initiate'
        IN_PROGRESS = 'inprogress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        DEFAULT = 'default', 'Default'
    
    appointment_no = models.TextField(max_length = 255, blank=True)
    booked_date = models.DateField()
    mrd_no = models.TextField(max_length=255, blank=True)
    role = models.TextField(max_length=100 , blank=True)
    emp_no = models.TextField(max_length=255, blank=True)
    aadhar_no = models.TextField(max_length=225, blank=True)
    name = models.TextField(max_length=100, blank=True)
    organization_name = models.TextField(max_length=100, blank=True)
    contractor_name = models.TextField(max_length=100, blank=True)
    purpose = models.TextField()
    date = models.DateField()
    time = models.TextField(max_length=225, blank=True)
    booked_by = models.TextField(max_length=255, blank=True)
    submitted_by_nurse = models.TextField(max_length=255, blank=True)
    submitted_Dr = models.TextField(max_length=255, blank=True)
    consultated_Dr =models.TextField(max_length=100, blank=True)
    employer = models.TextField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.INITIATE
    )

    def str(self):
        return f"{self.name} - {self.appointment_date}"

class FitnessAssessment(BaseModel): # Inherit from your base or models.Model

    # --- Choices ---
    class PositiveNegativeChoices(models.TextChoices):
        POSITIVE = 'positive', 'Positive' # Use lowercase for keys generally
        NEGATIVE = 'negative', 'Negative'

    class EyeExamResultChoices(models.TextChoices):
        NORMAL = 'Normal', 'Normal'
        DEFECTIVE = 'Defective', 'Defective'
        COLOR_BLINDNESS = 'Color Blindness', 'Color Blindness'
        # Add an empty choice if needed for the initial "-- Select Result --" state,
        # though typically handled by allowing blank/null in the field.

    class EyeExamFitStatusChoices(models.TextChoices):
        FIT = 'Fit', 'Fit'
        FIT_NEW_GLASS = 'Fit when newly prescribed glass', 'Fit when newly prescribed glass'
        FIT_EXISTING_GLASS = 'Fit with existing glass', 'Fit with existing glass'
        FIT_ADVICE_CHANGE_GLASS = 'Fit with an advice to change existing glass with newly prescribed glass', 'Fit with an advice to change existing glass with newly prescribed glass'
        UNFIT = 'Unfit', 'Unfit'
        # Add an empty choice if needed

    class OverallFitnessChoices(models.TextChoices): # Optional: More constrained than TextField
        FIT = 'fit', 'Fit'
        UNFIT = 'unfit', 'Unfit'
        CONDITIONAL = 'conditional', 'Conditional Fit'


    # --- Fields ---
    emp_no = models.CharField(max_length=50) # Increased length slightly just in case
    employer = models.TextField(blank=True, null=True)

    # Basic Tests
    tremors = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    romberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    acrophobia = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    trendelenberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)

    # Job & Fitness Status
    job_nature = models.JSONField(blank=True, null=True) # Stores selected job nature list
    overall_fitness = models.CharField(max_length=20, choices=OverallFitnessChoices.choices, blank=True, null=True) # Changed to CharField with choices
    conditional_fit_feilds = models.JSONField(blank=True, null=True) # Stores list if overall_fitness is 'conditional'

    # Examinations (New)
    general_examination = models.TextField(blank=True, null=True)
    systematic_examination = models.TextField(blank=True, null=True)
    eye_exam_result = models.CharField(
        max_length=20,
        choices=EyeExamResultChoices.choices,
        blank=True,
        null=True
    )
    eye_exam_fit_status = models.CharField(
        max_length=100, # Needs to be long enough for the longest option
        choices=EyeExamFitStatusChoices.choices,
        blank=True,
        null=True
    )

    # Comments & Validity
    comments = models.TextField(blank=True, null=True)
    validity = models.DateField(blank=True, null=True) # Auto-calculated in frontend

    def __str__(self):
        # Use f-string correctly
        return f"Fitness Assessment for {self.emp_no} - {self.get_overall_fitness_display() or 'Pending'}"

    class Meta:
        verbose_name = "Fitness Assessment"
        verbose_name_plural = "Fitness Assessments"


# --- Vaccination Record Model --- (Corrected the second definition)
class VaccinationRecord(BaseModel):
    emp_no = models.CharField(max_length=30)  # Employee number
    vaccination = models.JSONField(default=list)

    def __str__(self):
        return f"Vaccination Record for {self.emp_no}"

# --- Review Category Model ---
class ReviewCategory(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# --- Review Model ---
class Review(BaseModel):
    # ... (keep all existing fields from Review as they were) ...
    category = models.ForeignKey(ReviewCategory, on_delete=models.CASCADE, related_name="reviews")
    pid = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[("Male", "Male"), ("Female", "Female")])
    appointment_date = models.DateField()
    status = models.CharField(max_length=20, choices=[("Today", "Today"), ("Tomorrow", "Tomorrow"), ("Not Attempted", "Not Attempted")], default="Today")

    def __str__(self):
        return f"{self.name} - {self.category.name}"

# --- Member Model ---
class Member(BaseModel):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=255, blank=True)
    job_nature = models.CharField(max_length=255, blank=True)
    date_exited = models.DateField(null=True, blank=True)
    doj = models.DateField(null=True, blank=True)
    employee_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    hospital_name = models.CharField(max_length=255, null=True, blank=True)
    aadhar = models.CharField(max_length=20, blank=True, null=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

# --- Medical History Model ---
class MedicalHistory(BaseModel):
    # ... (keep all existing fields from MedicalHistory as they were) ...
    emp_no = models.CharField(max_length=255, null=True, blank=True)
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

    def __str__(self):
        return f"Medical History for Emp No: {self.emp_no or 'N/A'}"



# models.py (or wherever your Consultation model is defined)

from django.db import models
from django.utils import timezone # Import timezone if using default=timezone.now

# Assuming 'BaseModel' provides 'id' and 'entry_date'
# If not, you need to add them explicitly:
# from django.db import models
# class BaseModel(models.Model):
#     id = models.AutoField(primary_key=True)
#     entry_date = models.DateField(default=timezone.now) # Or auto_now_add=True if appropriate
#     class Meta:
#         abstract = True

# Make sure your actual BaseModel definition is compatible or adjust below
class Consultation(models.Model): # Or inherit from your actual BaseModel if it exists
    # --- Identifiers ---
    emp_no = models.CharField(max_length=50, blank=True, null=True, db_index=True) # Increased length slightly, added index
    entry_date = models.DateField(default=timezone.now) # Assuming entry_date is needed here or comes from BaseModel

    # --- Clinical Notes ---
    complaints = models.TextField(blank=True, null=True)
    examination = models.TextField(blank=True, null=True)           # General Examination
    systematic = models.TextField(blank=True, null=True)            # NEW: Systemic Examination
    lexamination = models.TextField(blank=True, null=True)          # Local Examination
    diagnosis = models.TextField(blank=True, null=True)             # Diagnosis Notes (clarified meaning)
    procedure_notes = models.TextField(blank=True, null=True)       # NEW: Procedure Notes
    obsnotes = models.TextField(blank=True, null=True)              # Observation / Ward Notes

    # --- Investigation, Advice, Follow-up ---
    investigation_details = models.TextField(blank=True, null=True) # Investigation suggestions
    advice = models.TextField(blank=True, null=True)                # Advice details (matches frontend key 'advice')
    follow_up_date = models.DateField(blank=True, null=True)        # Review Date

    # --- Case Details ---
    case_type = models.CharField(max_length=100, blank=True, null=True)
    illness_or_injury = models.CharField(max_length=255, blank=True, null=True) # (Matches frontend)
    other_case_details = models.TextField(blank=True, null=True)    # Details if case_type is 'other'
    notifiable_remarks = models.TextField(blank=True, null=True)    # Specific notifiable disease remarks

    # --- Referral Details ---
    referral = models.CharField(max_length=10, blank=True, null=True) # 'yes', 'no', or potentially null/empty string
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    speciality = models.CharField(max_length=255, blank=True, null=True) # CORRECTED SPELLING from 'speaciality'
    doctor_name = models.CharField(max_length=255, blank=True, null=True) # Referred Doctor Name

    # --- Submission Metadata ---
    submitted_by_doctor = models.CharField(max_length=100, blank=True, null=True) # Name/ID of consulting doctor
    submitted_by_nurse = models.CharField(max_length=100, blank=True, null=True)  # Name/ID of assisting/submitting nurse (if used)

    class Meta:
        # Optional: Ensure uniqueness for emp_no and entry_date if only one record per day per employee is allowed
        unique_together = ('emp_no', 'entry_date')
        ordering = ['-entry_date', '-id'] # Example ordering

    def __str__(self):
        entry_date_str = self.entry_date.strftime('%Y-%m-%d') if self.entry_date else 'N/A'
        return f"Consultation {self.id} - Emp: {self.emp_no or 'N/A'} on {entry_date_str}"

# --- Pharmacy Stock Model ---
class PharmacyStock(BaseModel):
    # ... (keep all existing fields from PharmacyStock as they were) ...
    class MedicineFormChoices(models.TextChoices):
        TABLET = "Tablet", "Tablet"
        SYRUP = "Syrup", "Syrup"
        INJECTION = "Injection", "Injection"
        CREAMS = "Creams", "Creams"
        DROPS = "Drops", "Drops"
        FLUIDS = "Fluids", "Fluids"
        OTHER = "Other", "Other"
    medicine_form = models.CharField(max_length=20, choices=MedicineFormChoices.choices)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    total_quantity = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.total_quantity = self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand_name} ({self.chemical_name})"

# --- Expiry Register Model ---
class ExpiryRegister(BaseModel):
    # ... (keep all existing fields from ExpiryRegister as they were) ...
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    removed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.brand_name} - {self.dose_volume} ({self.expiry_date})"

# --- Discarded Medicine Model ---
class DiscardedMedicine(BaseModel):
    # ... (keep all existing fields from DiscardedMedicine as they were) ...
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    reason = models.TextField()
    discarded_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand_name} ({self.dose_volume}) - {self.discarded_date}"

# --- Ward Consumables Model ---
class WardConsumables(BaseModel):
    # ... (keep all existing fields from WardConsumables as they were) ...
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    consumed_date = models.DateField(auto_now_add=True)

    def __str__(self):
        # Use consumed_date in __str__ if that's more relevant
        return f"{self.brand_name} ({self.dose_volume}) - {self.consumed_date}"

# --- Pharmacy Medicine Model ---
class PharmacyMedicine(BaseModel):
    # ... (keep all existing fields from PharmacyMedicine as they were) ...
    MEDICINE_FORMS = [("Tablet", "Tablet"), ("Syrup", "Syrup"), ("Injection", "Injection"), ("Creams", "Creams"), ("Drops", "Drops"), ("Fluids", "Fluids"), ("Other", "Other"),]
    medicine_form = models.CharField(max_length=20, choices=MEDICINE_FORMS)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)

    class Meta:
        unique_together = ("brand_name", "chemical_name", "dose_volume")

    def __str__(self):
        return f"{self.brand_name} ({self.chemical_name})"

# --- Instrument Calibration Model ---
class InstrumentCalibration(models.Model):
    equipment_sl_no = models.CharField(max_length=255)
    instrument_name = models.CharField(max_length=255)
    numbers = models.IntegerField()
    certificate_number = models.CharField(max_length=255, null=True, blank=True)
    make = models.CharField(max_length=255, null=True, blank=True)
    model_number = models.CharField(max_length=255, null=True, blank=True)
    freq = models.CharField(max_length=255, null=True, blank=True)
    calibration_date = models.DateField()
    next_due_date = models.DateField()
    calibration_status = models.BooleanField()

    def _str_(self):
        return self.instrument_name
class Prescription(BaseModel):
    tablets = models.JSONField(blank=True, null=True)
    syrups = models.JSONField(blank=True, null=True)
    injections = models.JSONField(blank=True, null=True)
    creams = models.JSONField(blank=True, null=True)
    drops = models.JSONField(blank=True, null=True)
    fluids = models.JSONField(blank=True, null=True)
    lotions = models.JSONField(blank=True, null=True)
    powder = models.JSONField(blank=True, null=True)
    respules = models.JSONField(blank=True, null=True)
    suture_procedure = models.JSONField(blank=True, null=True)
    dressing = models.JSONField(blank=True, null=True)
    others = models.JSONField(blank=True, null=True)
    submitted_by = models.CharField(max_length=50)
    issued_by = models.CharField(max_length=50)
    nurse_notes = models.TextField(blank=True, null=True)
    emp_no = models.CharField(max_length=20, blank=True, null=True)  # Added for creation date
    issued_status = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
      # Added status field with default value 0
      # Added status field with default value 0
    # id = models.AutoField(primary_key=True)  #Explicitly define primary key if needed

    def str(self):
        return f"Prescription #{self.id} - {self.emp_no or 'No Employee No'}"
# --- Form Models (17, 38, 39, 40, 27) ---
class Form17(BaseModel):
    # ... (keep all existing fields from Form17 as they were) ...
    emp_no = models.CharField(max_length=255, blank=True, null=True)
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
    surgeonSignature = models.TextField(blank=True, null=True)
    fmoSignature = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Form 17 - {self.workerName or 'N/A'}"

class Form38(BaseModel):
    # ... (keep all existing fields from Form38 as they were) ...
    emp_no = models.CharField(max_length=255, blank=True, null=True)
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

    def __str__(self):
        return f"Form 38 - {self.workerName or 'N/A'}"

class Form39(BaseModel):
    # ... (keep all existing fields from Form39 as they were) ...
    emp_no = models.CharField(max_length=255, blank=True, null=True)
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

    def __str__(self):
        return f"Form 39 - {self.workerName or 'N/A'}"

class Form40(BaseModel):
    # ... (keep all existing fields from Form40 as they were) ...
    emp_no = models.CharField(max_length=255, blank=True, null=True)
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

    def __str__(self):
        return f"Form 40 - {self.workerName or 'N/A'}"

class Form27(BaseModel):
    # ... (keep all existing fields from Form27 as they were) ...
    emp_no = models.CharField(max_length=255, blank=True, null=True)
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

    def __str__(self):
        return f"Form 27 - {self.nameOfWorks or 'N/A'}"

# --- Significant Notes Model ---
class SignificantNotes(BaseModel):
    # ... (keep all existing fields from SignificantNotes as they were) ...
    COMMUNICABLE_DISEASE_CHOICES = [('CD1', 'CD1'), ('CD2', 'CD2'), ('Unknown', 'Unknown'), ('', 'Select...'),]
    INCIDENT_TYPE_CHOICES = [('FAC', 'Fac'), ('LTI', 'LTI'), ('MTC', 'MTC'), ('FATAL', 'Fatal'), ('', 'Select...'),]
    INCIDENT_CHOICES = [('Occupational Injury', 'Occupational Injury'), ('Domestic Injury', 'Domestic Injury'), ('Communication Injury', 'Communication Injury'), ('Other Injury', 'Other Injury'), ('', 'Select...'),]
    ILLNESS_TYPE_CHOICES = [('Occupational Illness', 'Occupational Illness'), ('Occupational Disease', 'Occupational Disease'), ('', 'Select...'),]
    emp_no = models.CharField(max_length=20, blank=True, null=True)
    healthsummary = models.JSONField(default=list, blank=True, null=True) # Consider TextField if simple text
    remarks = models.JSONField(default=list, blank=True, null=True) # Consider TextField if simple text
    communicable_disease = models.CharField(max_length=50, choices=COMMUNICABLE_DISEASE_CHOICES, blank=True, null=True, default='', verbose_name="Communicable Disease")
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPE_CHOICES, blank=True, null=True, default='', verbose_name="Incident Type")
    incident = models.CharField(max_length=100, choices=INCIDENT_CHOICES, blank=True, null=True, default='', verbose_name="Incident")
    illness_type = models.CharField(max_length=100, choices=ILLNESS_TYPE_CHOICES, blank=True, null=True, default='', verbose_name="Illness Type")

    def __str__(self):
        date_str = self.entry_date.strftime('%Y-%m-%d') if self.entry_date else 'No Date'
        return f"Significant Notes for Emp {self.emp_no or 'N/A'} on {date_str}"

    class Meta:
        verbose_name = "Significant Note"
        verbose_name_plural = "Significant Notes"
        ordering = ['-entry_date', 'emp_no']


class PharmacyStockHistory(BaseModel):
    
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    total_quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()

    def _str_(self):
        return f"{self.brand_name} ({self.chemical_name}) - Archived"