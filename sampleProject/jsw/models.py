from django.db import models, transaction
from datetime import date, datetime
from django.utils import timezone # Import timezone

# --- Abstract Base Model ---
class BaseModel(models.Model):
    # Assuming ID is handled automatically by Django unless specified
    entry_date = models.DateField(auto_now=True) # Sets on save, consider default=timezone.now or auto_now_add=True for creation date

    class Meta:
        abstract = True

# --- User Model ---
# No emp_no, so no aadhar added here
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
    aadhar = models.CharField(max_length=225, blank=True, null=True) 
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
    nationality = models.CharField(max_length=50, blank=True)
    docName = models.CharField(max_length=50, blank=True)
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
    otherRegister = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.emp_no if self.emp_no else f"Employee {self.id}" # Handle missing emp_no

    def save(self, *args, **kwargs):
        if not self.profilepic:
            self.profilepic_url = ''
        super().save(*args, **kwargs)


# --- Dashboard Model --- *MODIFIED*
class Dashboard(BaseModel):
    # ... (keep all existing fields from Dashboard as they were) ...
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
    otherRegister = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Dashboard Record {self.id} for Emp {self.emp_no}"


# --- Vitals Model --- *MODIFIED*
class vitals(BaseModel):
    # ... (keep all existing fields from vitals as they were) ...
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
    application_form = models.FileField(upload_to= 'application_form/', blank=True, null=True)
    consent = models.FileField(upload_to= 'consent/', blank=True, null=True)
    fc = models.FileField(upload_to= 'fc/', blank = True, null=True)
    report = models.FileField(upload_to= 'report/', blank = True, null=True)
    self_declared = models.FileField(upload_to= 'self_declared/', blank = True, null=True)
    mrdNo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Vitals for Emp {self.emp_no}"


# --- Mock Drills Model --- *MODIFIED*
class mockdrills(BaseModel):
    # ... (keep all existing fields from mockdrills as they were) ...
    date= models.TextField(max_length=200)
    time= models.TextField(max_length=200)
    department= models.TextField(max_length=200)
    location= models.TextField(max_length=200)
    scenario= models.TextField(max_length=200)
    ambulance_timing= models.TextField(max_length=200)
    departure_from_OHC= models.TextField(max_length=200)
    return_to_OHC= models.TextField(max_length=200)
    emp_no= models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
    vitals= models.TextField(max_length=200)
    action_completion= models.TextField(max_length=200)
    responsible= models.TextField(max_length=200)

    def __str__(self):
        return f"Mock Drill for Emp {self.emp_no}"


# --- Events and Camps Model ---
# No emp_no, so no aadhar added here
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
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    hemoglobin = models.TextField(max_length=255)
    hemoglobin_unit = models.TextField(max_length=255)
    hemoglobin_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    hemoglobin_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    hemoglobin_comments = models.TextField(max_length=255)

    total_rbc = models.TextField(max_length=255)
    total_rbc_unit = models.TextField(max_length=255)
    total_rbc_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    total_rbc_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    total_rbc_comments = models.TextField(max_length=255)

    total_wbc = models.TextField(max_length=255)
    total_wbc_unit = models.TextField(max_length=255)
    total_wbc_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    total_wbc_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    total_wbc_comments = models.TextField(max_length=255)

    neutrophil = models.TextField(max_length=255)
    neutrophil_unit = models.TextField(max_length=255)
    neutrophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    neutrophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    neutrophil_comments = models.TextField(max_length=255)

    monocyte = models.TextField(max_length=255)
    monocyte_unit = models.TextField(max_length=255)
    monocyte_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    monocyte_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    monocyte_comments = models.TextField(max_length=255)

    pcv = models.TextField(max_length=255)
    pcv_unit = models.TextField(max_length=255)
    pcv_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    pcv_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    pcv_comments = models.TextField(max_length=255)

    mcv = models.TextField(max_length=255)
    mcv_unit = models.TextField(max_length=255)
    mcv_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    mcv_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    mcv_comments = models.TextField(max_length=255)

    mch = models.TextField(max_length=255)
    mch_unit = models.TextField(max_length=255)
    mch_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    mch_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    mch_comments = models.TextField(max_length=255)

    lymphocyte = models.TextField(max_length=255)
    lymphocyte_unit = models.TextField(max_length=255)
    lymphocyte_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    lymphocyte_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    lymphocyte_comments = models.TextField(max_length=255)

    esr = models.TextField(max_length=255)
    esr_unit = models.TextField(max_length=255)
    esr_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    esr_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    esr_comments = models.TextField(max_length=255)

    mchc = models.TextField(max_length=255)
    mchc_unit = models.TextField(max_length=255)
    mchc_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    mchc_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    mchc_comments = models.TextField(max_length=255)

    platelet_count = models.TextField(max_length=255)
    platelet_count_unit = models.TextField(max_length=255)
    platelet_count_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    platelet_count_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    platelet_count_comments = models.TextField(max_length=255)

    rdw = models.TextField(max_length=255)
    rdw_unit = models.TextField(max_length=255)
    rdw_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    rdw_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    rdw_comments = models.TextField(max_length=255)

    eosinophil = models.TextField(max_length=255)
    eosinophil_unit = models.TextField(max_length=255)
    eosinophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    eosinophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    eosinophil_comments = models.TextField(max_length=255)

    basophil = models.TextField(max_length=255)
    basophil_unit = models.TextField(max_length=255)
    basophil_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    basophil_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    basophil_comments = models.TextField(max_length=255)

    peripheral_blood_smear_rbc_morphology = models.TextField(max_length=255)
    peripheral_blood_smear_parasites = models.TextField(max_length=255)
    peripheral_blood_smear_others = models.TextField(max_length=255)

    def __str__(self):
        return f"Haematology Report {self.id} for Emp {self.emp_no}"

# --- Routine Sugar Tests Model --- *MODIFIED*
class RoutineSugarTests(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    glucose_f = models.TextField(max_length=255)
    glucose_f_unit = models.TextField(max_length=255)
    glucose_f_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    glucose_f_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    glucose_f_comments = models.TextField(max_length=255)

    glucose_pp = models.TextField(max_length=255)
    glucose_pp_unit = models.TextField(max_length=255)
    glucose_pp_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    glucose_pp_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    glucose_pp_comments = models.TextField(max_length=255)

    random_blood_sugar = models.TextField(max_length=255)
    random_blood_sugar_unit = models.TextField(max_length=255)
    random_blood_sugar_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    random_blood_sugar_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    random_blood_sugar_comments = models.TextField(max_length=255)

    estimated_average_glucose = models.TextField(max_length=255)
    estimated_average_glucose_unit = models.TextField(max_length=255)
    estimated_average_glucose_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    estimated_average_glucose_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    estimated_average_glucose_comments = models.TextField(max_length=255)

    hba1c = models.TextField(max_length=255)
    hba1c_unit = models.TextField(max_length=255)
    hba1c_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    hba1c_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    hba1c_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Routine Sugar Test Report {self.id} for Emp {self.emp_no}"

# --- Renal Function Test Model --- *MODIFIED*
class RenalFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    urea = models.TextField(max_length=255)
    urea_unit = models.TextField(max_length=255)
    urea_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    urea_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    urea_comments = models.TextField(max_length=255)

    bun = models.TextField(max_length=255)
    bun_unit = models.TextField(max_length=255)
    bun_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bun_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bun_comments = models.TextField(max_length=255)

    calcium = models.TextField(max_length=255)
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    calcium_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    calcium_comments = models.TextField(max_length=255)

    sodium = models.TextField(max_length=255)
    sodium_unit = models.TextField(max_length=255)
    sodium_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    sodium_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    sodium_comments = models.TextField(max_length=255)

    potassium = models.TextField(max_length=255)
    potassium_unit = models.TextField(max_length=255)
    potassium_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    potassium_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    potassium_comments = models.TextField(max_length=255)

    phosphorus = models.TextField(max_length=255)
    phosphorus_unit = models.TextField(max_length=255)
    phosphorus_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    phosphorus_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    phosphorus_comments = models.TextField(max_length=255)

    serum_creatinine = models.TextField(max_length=255)
    serum_creatinine_unit = models.TextField(max_length=255)
    serum_creatinine_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    serum_creatinine_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    serum_creatinine_comments = models.TextField(max_length=255)

    uric_acid = models.TextField(max_length=255)
    uric_acid_unit = models.TextField(max_length=255)
    uric_acid_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    uric_acid_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    uric_acid_comments = models.TextField(max_length=255)

    chloride = models.TextField(max_length=255)
    chloride_unit = models.TextField(max_length=255)
    chloride_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    chloride_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    chloride_comments = models.TextField(max_length=255)
    
    bicarbonate = models.TextField(max_length=255)
    bicarbonate_unit = models.TextField(max_length=255)
    bicarbonate_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bicarbonate_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bicarbonate_comments = models.TextField(max_length=255)
    
    eGFR = models.TextField(max_length=255)
    eGFR_unit = models.TextField(max_length=255)
    eGFR_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    eGFR_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    eGFR_comments = models.TextField(max_length=255)
    

    def __str__(self):
        return f"Renal Function Test Report {self.id} for Emp {self.emp_no}"

# --- Lipid Profile Model --- *MODIFIED*
class LipidProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    calcium = models.TextField(max_length=255) # Note: Calcium usually in RFT, consider if intended here
    calcium_unit = models.TextField(max_length=255)
    calcium_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    calcium_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    calcium_comments = models.TextField(max_length=255)

    triglycerides = models.TextField(max_length=255)
    triglycerides_unit = models.TextField(max_length=255)
    triglycerides_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    triglycerides_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    triglycerides_comments = models.TextField(max_length=255)

    hdl_cholesterol = models.TextField(max_length=255)
    hdl_cholesterol_unit = models.TextField(max_length=255)
    hdl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    hdl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    hdl_cholesterol_comments = models.TextField(max_length=255)

    ldl_cholesterol = models.TextField(max_length=255)
    ldl_cholesterol_unit = models.TextField(max_length=255)
    ldl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ldl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ldl_cholesterol_comments = models.TextField(max_length=255)

    chol_hdl_ratio = models.TextField(max_length=255)
    chol_hdl_ratio_unit = models.TextField(max_length=255)
    chol_hdl_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    chol_hdl_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    chol_hdl_ratio_comments = models.TextField(max_length=255)

    vldl_cholesterol = models.TextField(max_length=255)
    vldl_cholesterol_unit = models.TextField(max_length=255)
    vldl_cholesterol_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    vldl_cholesterol_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    vldl_cholesterol_comments = models.TextField(max_length=255)

    ldl_hdl_ratio = models.TextField(max_length=255)
    ldl_hdl_ratio_unit = models.TextField(max_length=255)
    ldl_hdl_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ldl_hdl_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ldl_hdl_ratio_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Lipid Profile Report {self.id} for Emp {self.emp_no}"

# --- Liver Function Test Model --- *MODIFIED*
class LiverFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    bilirubin_total = models.TextField(max_length=255)
    bilirubin_total_unit = models.TextField(max_length=255)
    bilirubin_total_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_total_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_total_comments = models.TextField(max_length=255)

    bilirubin_direct = models.TextField(max_length=255)
    bilirubin_direct_unit = models.TextField(max_length=255)
    bilirubin_direct_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_direct_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_direct_comments = models.TextField(max_length=255)

    bilirubin_indirect = models.TextField(max_length=255)
    bilirubin_indirect_unit = models.TextField(max_length=255)
    bilirubin_indirect_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_indirect_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bilirubin_indirect_comments = models.TextField(max_length=255)

    sgot_ast = models.TextField(max_length=255)
    sgot_ast_unit = models.TextField(max_length=255)
    sgot_ast_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    sgot_ast_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    sgot_ast_comments = models.TextField(max_length=255)

    sgpt_alt = models.TextField(max_length=255)
    sgpt_alt_unit = models.TextField(max_length=255)
    sgpt_alt_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    sgpt_alt_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    sgpt_alt_comments = models.TextField(max_length=255)

    alkaline_phosphatase = models.TextField(max_length=255)
    alkaline_phosphatase_unit = models.TextField(max_length=255)
    alkaline_phosphatase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    alkaline_phosphatase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    alkaline_phosphatase_comments = models.TextField(max_length=255)

    total_protein = models.TextField(max_length=255)
    total_protein_unit = models.TextField(max_length=255)
    total_protein_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    total_protein_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    total_protein_comments = models.TextField(max_length=255)

    albumin_serum = models.TextField(max_length=255)
    albumin_serum_unit = models.TextField(max_length=255)
    albumin_serum_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    albumin_serum_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    albumin_serum_comments = models.TextField(max_length=255)

    globulin_serum = models.TextField(max_length=255)
    globulin_serum_unit = models.TextField(max_length=255)
    globulin_serum_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    globulin_serum_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    globulin_serum_comments = models.TextField(max_length=255)

    alb_glob_ratio = models.TextField(max_length=255)
    alb_glob_ratio_unit = models.TextField(max_length=255)
    alb_glob_ratio_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    alb_glob_ratio_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    alb_glob_ratio_comments = models.TextField(max_length=255)

    gamma_glutamyl_transferase = models.TextField(max_length=255)
    gamma_glutamyl_transferase_unit = models.TextField(max_length=255)
    gamma_glutamyl_transferase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    gamma_glutamyl_transferase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    gamma_glutamyl_transferase_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Liver Function Test Report {self.id} for Emp {self.emp_no}"

# --- Thyroid Function Test Model --- *MODIFIED*
class ThyroidFunctionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    t3_triiodothyronine = models.TextField(max_length=255)
    t3_unit = models.TextField(max_length=255)
    t3_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    t3_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    t3_comments = models.TextField(max_length=255)

    t4_thyroxine = models.TextField(max_length=255)
    t4_unit = models.TextField(max_length=255)
    t4_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    t4_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    t4_comments = models.TextField(max_length=255)

    tsh_thyroid_stimulating_hormone = models.TextField(max_length=255)
    tsh_unit = models.TextField(max_length=255)
    tsh_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    tsh_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    tsh_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Thyroid Function Test Report {self.id} for Emp {self.emp_no}"

# --- Autoimmune test Model --- *MODIFIED*
 
class AutoimmuneTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    ANA = models.TextField(max_length=255)
    ANA_unit = models.TextField(max_length=255)
    ANA_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ANA_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ANA_comments = models.TextField(max_length=255)
    
    Anti_ds_dna = models.TextField(max_length=255)
    Anti_ds_dna_unit = models.TextField(max_length=255)
    Anti_ds_dna_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Anti_ds_dna_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Anti_ds_dna_comments = models.TextField(max_length=255)
    
    Anticardiolipin_Antibodies= models.TextField(max_length=255)
    Anticardiolipin_Antibodies_unit = models.TextField(max_length=255)
    Anticardiolipin_Antibodies_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Anticardiolipin_Antibodies_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Anticardiolipin_Antibodies_comments = models.TextField(max_length=255)
    
        
    Rheumatoid_factor= models.TextField(max_length=255)
    Rheumatoid_factor_unit = models.TextField(max_length=255)
    Rheumatoid_factor_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Rheumatoid_factor_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Rheumatoid_factor_comments = models.TextField(max_length=255)
    
    def __str__(self):
        return f"Autoimmune Test {self.id} for Emp {self.emp_no}"
    
    

# --- Coagulation Test Model --- *MODIFIED*
class CoagulationTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    prothrombin_time = models.TextField(max_length=255)
    prothrombin_time_unit = models.TextField(max_length=255)
    prothrombin_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    prothrombin_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    prothrombin_time_comments = models.TextField(max_length=255)

    pt_inr = models.TextField(max_length=255)
    pt_inr_unit = models.TextField(max_length=255)
    pt_inr_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    pt_inr_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    pt_inr_comments = models.TextField(max_length=255)

    clotting_time = models.TextField(max_length=255)
    clotting_time_unit = models.TextField(max_length=255)
    clotting_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    clotting_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    clotting_time_comments = models.TextField(max_length=255)

    bleeding_time = models.TextField(max_length=255)
    bleeding_time_unit = models.TextField(max_length=255)
    bleeding_time_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bleeding_time_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bleeding_time_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Coagulation Test Report {self.id} for Emp {self.emp_no}"

# --- Enzymes Cardiac Profile Model --- *MODIFIED*
class EnzymesCardiacProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    acid_phosphatase = models.TextField(max_length=255)
    acid_phosphatase_unit = models.TextField(max_length=255)
    acid_phosphatase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    acid_phosphatase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    acid_phosphatase_comments = models.TextField(max_length=255)

    adenosine_deaminase = models.TextField(max_length=255)
    adenosine_deaminase_unit = models.TextField(max_length=255)
    adenosine_deaminase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    adenosine_deaminase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    adenosine_deaminase_comments = models.TextField(max_length=255)

    amylase = models.TextField(max_length=255)
    amylase_unit = models.TextField(max_length=255)
    amylase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    amylase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    amylase_comments = models.TextField(max_length=255)

    ecg = models.TextField(max_length=255)
    ecg_unit = models.TextField(max_length=255)
    ecg_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ecg_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ecg_comments = models.TextField(max_length=255)

    troponin_t = models.TextField(max_length=255)
    troponin_t_unit = models.TextField(max_length=255)
    troponin_t_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    troponin_t_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    troponin_t_comments = models.TextField(max_length=255)
    
    #troponin I
    troponin_i = models.TextField(max_length=255)
    troponin_i_unit = models.TextField(max_length=255)
    troponin_i_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    troponin_i_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    troponin_i_comments = models.TextField(max_length=255)

    cpk_total = models.TextField(max_length=255)
    cpk_total_unit = models.TextField(max_length=255)
    cpk_total_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    cpk_total_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    cpk_total_comments = models.TextField(max_length=255)

    echo = models.TextField(max_length=255)
    echo_unit = models.TextField(max_length=255)
    echo_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    echo_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    echo_comments = models.TextField(max_length=255)

    lipase = models.TextField(max_length=255)
    lipase_unit = models.TextField(max_length=255)
    lipase_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    lipase_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    lipase_comments = models.TextField(max_length=255)

    cpk_mb = models.TextField(max_length=255)
    cpk_mb_unit = models.TextField(max_length=255)
    cpk_mb_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    cpk_mb_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    cpk_mb_comments = models.TextField(max_length=255)

    tmt_normal = models.TextField(max_length=255)
    tmt_normal_unit = models.TextField(max_length=255)
    tmt_normal_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    tmt_normal_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    tmt_normal_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Enzymes & Cardiac Profile Report {self.id} for Emp {self.emp_no}"

# --- Urine Routine Test Model --- *MODIFIED*
class UrineRoutineTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    colour = models.TextField(max_length=255)
    colour_unit = models.TextField(max_length=255)
    colour_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    colour_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    colour_comments = models.TextField(max_length=255)

    appearance = models.TextField(max_length=255)
    appearance_unit = models.TextField(max_length=255)
    appearance_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    appearance_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    appearance_comments = models.TextField(max_length=255)

    reaction_ph = models.TextField(max_length=255)
    reaction_ph_unit = models.TextField(max_length=255)
    reaction_ph_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    reaction_ph_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    reaction_ph_comments = models.TextField(max_length=255)

    specific_gravity = models.TextField(max_length=255)
    specific_gravity_unit = models.TextField(max_length=255)
    specific_gravity_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    specific_gravity_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    specific_gravity_comments = models.TextField(max_length=255)

    crystals = models.TextField(max_length=255)
    crystals_unit = models.TextField(max_length=255)
    crystals_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    crystals_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    crystals_comments = models.TextField(max_length=255)

    bacteria = models.TextField(max_length=255)
    bacteria_unit = models.TextField(max_length=255)
    bacteria_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bacteria_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bacteria_comments = models.TextField(max_length=255)

    protein_albumin = models.TextField(max_length=255)
    protein_albumin_unit = models.TextField(max_length=255)
    protein_albumin_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    protein_albumin_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    protein_albumin_comments = models.TextField(max_length=255)

    glucose_urine = models.TextField(max_length=255)
    glucose_urine_unit = models.TextField(max_length=255)
    glucose_urine_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    glucose_urine_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    glucose_urine_comments = models.TextField(max_length=255)

    ketone_bodies = models.TextField(max_length=255)
    ketone_bodies_unit = models.TextField(max_length=255)
    ketone_bodies_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ketone_bodies_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ketone_bodies_comments = models.TextField(max_length=255)

    urobilinogen = models.TextField(max_length=255)
    urobilinogen_unit = models.TextField(max_length=255)
    urobilinogen_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    urobilinogen_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    urobilinogen_comments = models.TextField(max_length=255)

    casts = models.TextField(max_length=255)
    casts_unit = models.TextField(max_length=255)
    casts_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    casts_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    casts_comments = models.TextField(max_length=255)

    bile_salts = models.TextField(max_length=255)
    bile_salts_unit = models.TextField(max_length=255)
    bile_salts_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bile_salts_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bile_salts_comments = models.TextField(max_length=255)

    bile_pigments = models.TextField(max_length=255)
    bile_pigments_unit = models.TextField(max_length=255)
    bile_pigments_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    bile_pigments_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    bile_pigments_comments = models.TextField(max_length=255)

    wbc_pus_cells = models.TextField(max_length=255)
    wbc_pus_cells_unit = models.TextField(max_length=255)
    wbc_pus_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    wbc_pus_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    wbc_pus_cells_comments = models.TextField(max_length=255)

    red_blood_cells = models.TextField(max_length=255)
    red_blood_cells_unit = models.TextField(max_length=255)
    red_blood_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    red_blood_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    red_blood_cells_comments = models.TextField(max_length=255)

    epithelial_cells = models.TextField(max_length=255)
    epithelial_cells_unit = models.TextField(max_length=255)
    epithelial_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    epithelial_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    epithelial_cells_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Urine Routine Test Report {self.id} for Emp {self.emp_no}"

# --- Serology Test Model --- *MODIFIED*
class SerologyTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    screening_hiv = models.TextField(max_length=255)
    screening_hiv_unit = models.TextField(max_length=255)
    screening_hiv_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    screening_hiv_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    screening_hiv_comments = models.TextField(max_length=255)
    
    screening_hiv2 = models.TextField(max_length=255)
    screening_hiv2_unit = models.TextField(max_length=255)
    screening_hiv2_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    screening_hiv2_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    screening_hiv2_comments = models.TextField(max_length=255)
    
    HBsAG = models.TextField(max_length=255)
    HBsAG_unit = models.TextField(max_length=255)
    HBsAG_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    HBsAG_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    HBsAG_comments = models.TextField(max_length=255)
    
    HCV = models.TextField(max_length=255)
    HCV_unit = models.TextField(max_length=255)
    HCV_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    HCV_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    HCV_comments = models.TextField(max_length=255)
    
    WIDAL = models.TextField(max_length=255)
    WIDAL_unit = models.TextField(max_length=255)
    WIDAL_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    WIDAL_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    WIDAL_comments = models.TextField(max_length=255)
    
    VDRL = models.TextField(max_length=255)
    VDRL_unit = models.TextField(max_length=255)
    VDRL_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    VDRL_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    VDRL_comments = models.TextField(max_length=255)
    
    Dengue_NS1Ag = models.TextField(max_length=255)
    Dengue_NS1Ag_unit = models.TextField(max_length=255)
    Dengue_NS1Ag_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Dengue_NS1Ag_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Dengue_NS1Ag_comments = models.TextField(max_length=255)

    Dengue_IgG = models.TextField(max_length=255)
    Dengue_IgG_unit = models.TextField(max_length=255)
    Dengue_IgG_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Dengue_IgG_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Dengue_IgG_comments = models.TextField(max_length=255)
    
    Dengue_IgM = models.TextField(max_length=255)
    Dengue_IgM_unit = models.TextField(max_length=255)
    Dengue_IgM_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    Dengue_IgM_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    Dengue_IgM_comments = models.TextField(max_length=255)
    

    def __str__(self):
        return f"Serology Test Report {self.id} for Emp {self.emp_no}"

# --- Motion Test Model --- *MODIFIED*
class MotionTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    colour_motion = models.TextField(max_length=255)
    colour_motion_unit = models.TextField(max_length=255)
    colour_motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    colour_motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    colour_motion_comments = models.TextField(max_length=255)

    appearance_motion = models.TextField(max_length=255)
    appearance_motion_unit = models.TextField(max_length=255)
    appearance_motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    appearance_motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    appearance_motion_comments = models.TextField(max_length=255)

    occult_blood = models.TextField(max_length=255)
    occult_blood_unit = models.TextField(max_length=255)
    occult_blood_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    occult_blood_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    occult_blood_comments = models.TextField(max_length=255)

    cyst = models.TextField(max_length=255)
    cyst_unit = models.TextField(max_length=255)
    cyst_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    cyst_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    cyst_comments = models.TextField(max_length=255)

    mucus = models.TextField(max_length=255)
    mucus_unit = models.TextField(max_length=255)
    mucus_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    mucus_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    mucus_comments = models.TextField(max_length=255)

    pus_cells = models.TextField(max_length=255)
    pus_cells_unit = models.TextField(max_length=255)
    pus_cells_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    pus_cells_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    pus_cells_comments = models.TextField(max_length=255)

    ova = models.TextField(max_length=255)
    ova_unit = models.TextField(max_length=255)
    ova_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    ova_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    ova_comments = models.TextField(max_length=255)

    rbcs = models.TextField(max_length=255)
    rbcs_unit = models.TextField(max_length=255)
    rbcs_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    rbcs_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    rbcs_comments = models.TextField(max_length=255)

    others = models.TextField(max_length=255)
    others_unit = models.TextField(max_length=255)
    others_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    others_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    others_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Motion Test Report {self.id} for Emp {self.emp_no}"
    
   


# --- Culture Sensitivity Test Model --- *MODIFIED*
class CultureSensitivityTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    urine = models.TextField(max_length=255)
    urine_unit = models.TextField(max_length=255)
    urine_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    urine_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    urine_comments = models.TextField(max_length=255)

    motion = models.TextField(max_length=255)
    motion_unit = models.TextField(max_length=255)
    motion_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    motion_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    motion_comments = models.TextField(max_length=255)

    sputum = models.TextField(max_length=255)
    sputum_unit = models.TextField(max_length=255)
    sputum_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    sputum_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    sputum_comments = models.TextField(max_length=255)

    blood = models.TextField(max_length=255)
    blood_unit = models.TextField(max_length=255)
    blood_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    blood_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    blood_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Culture & Sensitivity Test Report {self.id} for Emp {self.emp_no}"

# --- Mens Pack Model --- *MODIFIED*
class MensPack(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    psa = models.TextField(max_length=255)
    psa_unit = models.TextField(max_length=255)
    psa_reference_range_from = models.TextField(max_length=50, null=True, blank=True)
    psa_reference_range_to = models.TextField(max_length=50, null=True, blank=True)
    psa_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Men's Pack Test Report {self.id} for Emp {self.emp_no}"
 
 # --- Womens Pack Model --- *MODIFIED*
class WomensPack(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar 
    Mammogaram  = models.TextField(max_length=255)
    Mammogaram_comments = models.TextField(max_length=255)
    
    PAP_Smear  = models.TextField(max_length=255)
    PAP_Smear_comments = models.TextField(max_length=255)
    
    def __str__(self):
        return f"Women's Pack {self.id} for Emp {self.emp_no}"
    
 # --- OccupationalProfile Model --- *MODIFIED*    
class OccupationalProfile(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar     
    Audiometry  = models.TextField(max_length=255)
    Audiometry_comments = models.TextField(max_length=255)
    
    PFT  = models.TextField(max_length=255)
    PFT_comments = models.TextField(max_length=255)
    
    def __str__(self):
        return f"Occupational Profile {self.id} for Emp {self.emp_no}"
   
 # --- Others Test Model --- *MODIFIED*      
class OthersTest(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar   
    Bone_Densitometry = models.TextField(max_length=255)
    Bone_Densitometry_comments = models.TextField(max_length=255)
    
    Dental = models.TextField(max_length=255)
    Dental_comments = models.TextField(max_length=255)
    
    Pathology = models.TextField(max_length=255)
    Pathology_comments = models.TextField(max_length=255)
    
    def __str__(self):
        return f"Others Test {self.id} for Emp {self.emp_no}"
    

# --- Ophthalmic Report Model --- *MODIFIED*
class OphthalmicReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    vision = models.TextField(max_length=255)
    vision_comments = models.TextField(max_length=255)

    color_vision = models.TextField(max_length=255)
    color_vision_comments = models.TextField(max_length=255)
    
    Cataract_glaucoma = models.TextField(max_length=255)
    Cataract_glaucoma_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"Ophthalmic Report {self.id} for Emp {self.emp_no}"

class XRay(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    Chest = models.TextField(max_length=255)
    Chest_comments = models.TextField(max_length=255)
    
    Spine = models.TextField(max_length=255)
    Spine_comments = models.TextField(max_length=255)
    
    Abdomen = models.TextField(max_length=255)
    Abdomen_comments = models.TextField(max_length=255)
    
    KUB = models.TextField(max_length=255)
    KUB_comments = models.TextField(max_length=255)
    
    Pelvis = models.TextField(max_length=255)
    Pelvis_comments = models.TextField(max_length=255)   
    
    def __str__(self):
        return f"X-Ray {self.id} for Emp {self.emp_no}"
    
# --- USG Report Model --- *MODIFIED*
class USGReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    usg_abdomen = models.TextField(max_length=255)
    usg_abdomen_comments = models.TextField(max_length=255)

    usg_kub = models.TextField(max_length=255)
    usg_kub_comments = models.TextField(max_length=255)

    usg_pelvis = models.TextField(max_length=255)
    usg_pelvis_comments = models.TextField(max_length=255)

    usg_neck = models.TextField(max_length=255)
    usg_neck_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"USG Report {self.id} for Emp {self.emp_no}"
    
# --- CT Report Model --- *MODIFIED*

class CTReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    CT_brain = models.TextField(max_length=255)
    CT_brain_comments = models.TextField(max_length=255)

    CT_lungs = models.TextField(max_length=255)
    CT_lungs_comments = models.TextField(max_length=255)

    CT_abdomen = models.TextField(max_length=255)
    CT_abdomen_comments = models.TextField(max_length=255)

    CT_spine = models.TextField(max_length=255)
    CT_spine_comments = models.TextField(max_length=255)

    CT_pelvis = models.TextField(max_length=255)
    CT_pelvis_comments = models.TextField(max_length=255)
    
    def __str__(self):
        return f"CT {self.id} for Emp {self.emp_no}"
    
# --- MRI Report Model --- *MODIFIED*
class MRIReport(BaseModel):
    emp_no = models.TextField(max_length=200)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    mri_brain = models.TextField(max_length=255)
    mri_brain_comments = models.TextField(max_length=255)

    mri_lungs = models.TextField(max_length=255)
    mri_lungs_comments = models.TextField(max_length=255)

    mri_abdomen = models.TextField(max_length=255)
    mri_abdomen_comments = models.TextField(max_length=255)

    mri_spine = models.TextField(max_length=255)
    mri_spine_comments = models.TextField(max_length=255)

    mri_pelvis = models.TextField(max_length=255)
    mri_pelvis_comments = models.TextField(max_length=255)

    def __str__(self):
        return f"MRI Report {self.id} for Emp {self.emp_no}"

# --- Appointment Model --- *MODIFIED*
class Appointment(BaseModel):
    class StatusChoices(models.TextChoices):
        INITIATE = 'initiate', 'Initiate'
        IN_PROGRESS = 'inprogress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        DEFAULT = 'default', 'Default'

    appointment_no = models.TextField(max_length = 255, blank=True)
    booked_date = models.DateField()
    mrdNo = models.TextField(max_length=255, blank=True)
    role = models.TextField(max_length=100 , blank=True)
    emp_no = models.TextField(max_length=255, blank=True)
    # aadhar_no = models.TextField(max_length=225, blank=True) # Original aadhar_no
    # Let's use the consistent name 'aadhar'
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added/Renamed Aadhar
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

    def __str__(self): # Changed from str to __str__
        apt_date_str = self.date.strftime('%Y-%m-%d') if self.date else 'N/A'
        return f"Appointment for {self.name} ({self.emp_no or 'N/A'}) on {apt_date_str}"

# --- Fitness Assessment Model --- *MODIFIED*
class FitnessAssessment(BaseModel):

    # --- Choices ---
    class PositiveNegativeChoices(models.TextChoices):
        POSITIVE = 'positive', 'Positive'
        NEGATIVE = 'negative', 'Negative'

    class EyeExamFitStatusChoices(models.TextChoices):
        FIT = 'Fit', 'Fit'
        FIT_NEW_GLASS = 'Fit when newly prescribed glass', 'Fit when newly prescribed glass'
        FIT_EXISTING_GLASS = 'Fit with existing glass', 'Fit with existing glass'
        FIT_ADVICE_CHANGE_GLASS = 'Fit with an advice to change existing glass with newly prescribed glass', 'Fit with an advice to change existing glass with newly prescribed glass'
        UNFIT = 'Unfit', 'Unfit'

    class OverallFitnessChoices(models.TextChoices):
        FIT = 'fit', 'Fit'
        UNFIT = 'unfit', 'Unfit'
        CONDITIONAL = 'conditional', 'Conditional Fit'

    # --- Fields ---
    emp_no = models.CharField(max_length=50) # Consider making this non-nullable if always required
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    employer = models.TextField(blank=True, null=True)

    # Basic Tests
    tremors = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    romberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    acrophobia = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    trendelenberg_test = models.CharField(max_length=10, choices=PositiveNegativeChoices.choices, blank=True, null=True)
    otherJobNature = models.CharField(max_length=225, blank=True, null=True)
    conditionalotherJobNature = models.CharField(max_length=225, blank=True, null=True)
    #special cases
    special_cases=models.CharField(max_length=10,blank=True,null=True)
    mrdNo = models.CharField(max_length=255, blank=True, null=True)
    # Job & Fitness Status
    job_nature = models.JSONField(blank=True, null=True)
    overall_fitness = models.CharField(max_length=20, choices=OverallFitnessChoices.choices, blank=True, null=True)
    conditional_fit_feilds = models.JSONField(blank=True, null=True)
    
    submittedDoctor = models.CharField(max_length=255, blank=True, null=True)

    # Examinations
    general_examination = models.TextField(blank=True, null=True)
    systematic_examination = models.TextField(blank=True, null=True)
    eye_exam_fit_status = models.CharField(
        max_length=100,
        choices=EyeExamFitStatusChoices.choices,
        blank=True,
        null=True
    )

    # Comments & Validity
    comments = models.TextField(blank=True, null=True)
    validity = models.DateField(blank=True, null=True)

    def __str__(self):
        fit_status = self.get_overall_fitness_display() or 'Pending'
        return f"Fitness Assessment for {self.emp_no} - {fit_status}"

    class Meta:
        verbose_name = "Fitness Assessment"
        verbose_name_plural = "Fitness Assessments"


# --- Vaccination Record Model --- *MODIFIED*
class VaccinationRecord(BaseModel):
    emp_no = models.CharField(max_length=30)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    vaccination = models.JSONField(default=list)

    def __str__(self):
        return f"Vaccination Record for {self.emp_no}"

# --- Review Category Model ---
# No emp_no, so no aadhar added here
class ReviewCategory(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# --- Review Model ---
# No emp_no, so no aadhar added here (pid seems to be the identifier)
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
# Has employee_number, not emp_no, but also has aadhar. Keeping as is.
class Member(BaseModel):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=255, blank=True)
    job_nature = models.CharField(max_length=255, blank=True)
    date_exited = models.DateField(null=True, blank=True)
    doj = models.DateField(null=True, blank=True)
    employee_number = models.CharField(max_length=50, unique=True, null=True, blank=True) # Different from emp_no
    hospital_name = models.CharField(max_length=255, null=True, blank=True)
    aadhar = models.CharField(max_length=20, blank=True, null=True) # Already present, different length
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

# --- Medical History Model --- *MODIFIED*
class MedicalHistory(BaseModel):
    # ... (keep all existing fields from MedicalHistory as they were) ...
    emp_no = models.CharField(max_length=255, null=True, blank=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
    spouse_data=models.JSONField(null=True,blank=True)
    mrdNo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Medical History for Emp No: {self.emp_no or 'N/A'}"


# --- Consultation Model --- *MODIFIED*
# Using models.Model directly as per original, ensure BaseModel features are replicated if needed
class Consultation(models.Model): # Changed inheritance, ensure ID/entry_date are handled
    # id = models.AutoField(primary_key=True) # Explicitly define if not inheriting from BaseModel
    # entry_date = models.DateField(default=timezone.now) # Add if not inheriting from BaseModel

    # --- Identifiers ---
    emp_no = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    entry_date = models.DateField(default=timezone.now) # Kept as per original code

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
    advice = models.TextField(blank=True, null=True)                # Advice details
    follow_up_date = models.DateField(blank=True, null=True)        # Review Date

    # --- Case Details ---
    case_type = models.CharField(max_length=100, blank=True, null=True)
    illness_or_injury = models.CharField(max_length=255, blank=True, null=True)
    other_case_details = models.TextField(blank=True, null=True)
    notifiable_remarks = models.TextField(blank=True, null=True)

    # --- Referral Details ---
    referral = models.CharField(max_length=10, blank=True, null=True)
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    speciality = models.CharField(max_length=255, blank=True, null=True)
    doctor_name = models.CharField(max_length=255, blank=True, null=True)

    shifting_required = models.CharField(max_length=10, blank=True, null=True) 
    shifting_notes = models.TextField(blank=True, null=True)
    ambulance_details = models.TextField(blank=True, null=True)
    
    #special cases
    special_cases=models.CharField(max_length=10, blank=True, null=True)
    mrdNo = models.CharField(max_length=255, blank=True, null=True)
    # --- Submission Metadata ---
    submittedDoctor = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # Optional: Unique constraint if needed
        unique_together = ('emp_no', 'entry_date')
        ordering = ['-entry_date', '-id']

    def __str__(self):
        entry_date_str = self.entry_date.strftime('%Y-%m-%d') if self.entry_date else 'N/A'
        return f"Consultation {self.pk} - Emp: {self.emp_no or 'N/A'} on {entry_date_str}"


# --- Pharmacy Stock Model ---
# No emp_no, so no aadhar added here
class PharmacyStock(BaseModel):
    class MedicineFormChoices(models.TextChoices):
        TABLET = "Tablet", "Tablet"
        SYRUP = "Syrup", "Syrup"
        INJECTION = "Injection", "Injection"
        CREAMS = "Creams", "Creams"
        DROPS = "Drops", "Drops"
        FLUIDS = "Fluids", "Fluids"
        OTHER = "Other", "Other"
        LOTIONS = "Lotions", "Lotions"
        POWDER = "Powder", "Powder"
        RESPULES = "Respules", "Respules"
    medicine_form = models.CharField(max_length=20, choices=MedicineFormChoices.choices)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    total_quantity = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()

    def save(self, *args, **kwargs):
        if not self.pk: # Only set total_quantity on initial creation
            self.total_quantity = self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand_name} ({self.chemical_name})"

# --- Expiry Register Model ---
# No emp_no, so no aadhar added here
class ExpiryRegister(BaseModel):
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
# No emp_no, so no aadhar added here
class DiscardedMedicine(BaseModel):
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    reason = models.TextField()


    def __str__(self):
        discard_date_str = self.discarded_date.strftime('%Y-%m-%d') if self.discarded_date else 'N/A'
        return f"{self.brand_name} ({self.dose_volume}) - Discarded {discard_date_str}"

# --- Ward Consumables Model ---
# No emp_no, so no aadhar added here
class WardConsumables(BaseModel):
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    consumed_date = models.DateField(auto_now_add=True) # Sets on creation

    def __str__(self):
        consumed_date_str = self.consumed_date.strftime('%Y-%m-%d') if self.consumed_date else 'N/A'
        return f"{self.brand_name} ({self.dose_volume}) - Consumed {consumed_date_str}"
    

class AmbulanceConsumables(models.Model):
    entry_date = models.DateField(default=timezone.now)
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)  # Medicine name given by the company
    chemical_name = models.CharField(max_length=255)  # Active ingredient
    dose_volume = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    consumed_date = models.DateField(auto_now_add=True)  # Date when medicine was discarded

    def _str_(self):
        return f"{self.brand_name} ({self.dose_volume}) - {self.discarded_date}"

# --- Pharmacy Medicine Model ---
# No emp_no, so no aadhar added here
class PharmacyMedicine(BaseModel):
    MEDICINE_FORMS = [("Tablet", "Tablet"), ("Syrup", "Syrup"), ("Injection", "Injection"), ("Creams", "Creams"),("Lotions","Lotions"),("Powder","Powder"),("Respules","Respules"), ("Drops", "Drops"), ("Fluids", "Fluids"), ("Other", "Other"),]
    medicine_form = models.CharField(max_length=20, choices=MEDICINE_FORMS)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)

    class Meta:
        unique_together = ("brand_name", "chemical_name", "dose_volume")

    def __str__(self):
        return f"{self.brand_name} ({self.chemical_name})"

# --- Instrument Calibration Model ---
# No emp_no, so no aadhar added here
class InstrumentCalibration(BaseModel): # Not inheriting BaseModel
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

    def __str__(self): # Corrected from _str_
        return self.instrument_name

# --- Prescription Model --- *MODIFIED*
class Prescription(BaseModel):
    emp_no = models.CharField(max_length=20, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    name = models.CharField(max_length=50) # Assuming patient name?
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
    issued_status = models.IntegerField(default=0) # 0 = Not Issued, 1 = Issued ?
    mrdNo = models.CharField(max_length=255, blank=True, null=True)

    # id = models.AutoField(primary_key=True) # Usually handled by Django unless custom needed

    def __str__(self): # Changed from str to __str__
        return f"Prescription #{self.pk} for {self.name} (Emp: {self.emp_no or 'N/A'})"

# --- Form Models (17, 38, 39, 40, 27) --- *MODIFIED*
class Form17(BaseModel):
    emp_no = models.CharField(max_length=255, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
        return f"Form 17 - {self.workerName or 'N/A'} (Emp: {self.emp_no or 'N/A'})"

class Form38(BaseModel):
    emp_no = models.CharField(max_length=255, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    workerName = models.CharField(max_length=255, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    age = models.IntegerField(blank=True, null=True)
    jobNature = models.CharField(max_length=255, blank=True, null=True)
    employmentDate = models.DateField(blank=True, null=True)
    eyeExamDate = models.DateField(blank=True, null=True)
    result = models.CharField(max_length=255, blank=True, null=True)
    opthamologistSignature = models.TextField(blank=True, null=True) # Corrected typo 'opthamologist' -> 'ophthalmologist' if possible later
    fmoSignature = models.TextField(blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Form 38 - {self.workerName or 'N/A'} (Emp: {self.emp_no or 'N/A'})"

class Form39(BaseModel):
    emp_no = models.CharField(max_length=255, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
        return f"Form 39 - {self.workerName or 'N/A'} (Emp: {self.emp_no or 'N/A'})"

class Form40(BaseModel):
    emp_no = models.CharField(max_length=255, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
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
    mrdNo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Form 40 - {self.workerName or 'N/A'} (Emp: {self.emp_no or 'N/A'})"

class Form27(BaseModel):
    emp_no = models.CharField(max_length=255, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) 
    serialNumber = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    nameOfWorks = models.CharField(max_length=255, blank=True, null=True) # Worker name? Renamed for clarity
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    dateOfBirth = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    nameOfTheFather = models.CharField(max_length=255, blank=True, null=True)
    natureOfJobOrOccupation = models.CharField(max_length=255, blank=True, null=True)
    signatureOfFMO = models.TextField(blank=True, null=True)
    descriptiveMarks = models.CharField(max_length=255, blank=True, null=True)
    signatureOfCertifyingSurgeon = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Form 27 - {self.nameOfWorks or 'N/A'} (Emp: {self.emp_no or 'N/A'})"

# --- Significant Notes Model --- *MODIFIED*
class SignificantNotes(BaseModel):
    COMMUNICABLE_DISEASE_CHOICES = [('CD1', 'CD1'), ('CD2', 'CD2'), ('Unknown', 'Unknown'), ('', 'Select...'),]
    INCIDENT_TYPE_CHOICES = [('FAC', 'Fac'), ('LTI', 'LTI'), ('MTC', 'MTC'), ('FATAL', 'Fatal'), ('', 'Select...'),]
    INCIDENT_CHOICES = [('Occupational Injury', 'Occupational Injury'), ('Domestic Injury', 'Domestic Injury'), ('Communication Injury', 'Communication Injury'), ('Other Injury', 'Other Injury'), ('', 'Select...'),]
    ILLNESS_TYPE_CHOICES = [('Occupational Illness', 'Occupational Illness'), ('Occupational Disease', 'Occupational Disease'), ('', 'Select...'),]

    emp_no = models.CharField(max_length=20, blank=True, null=True)
    aadhar = models.CharField(max_length=225, blank=True, null=True) # Added Aadhar
    healthsummary = models.JSONField(default=list, blank=True, null=True)
    remarks = models.JSONField(default=list, blank=True, null=True)
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


# --- Pharmacy Stock History Model ---
# No emp_no, so no aadhar added here
#Don't add the BaseModel Here.
class PharmacyStockHistory(models.Model):
    entry_date = models.DateField(default = timezone.now)
    medicine_form = models.CharField(max_length=20)
    brand_name = models.CharField(max_length=255)
    chemical_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=50)
    total_quantity = models.PositiveIntegerField(default=0) # Quantity at time of archival
    expiry_date = models.DateField()
    # Consider adding a field for the date it was moved to history,
    # e.g., archived_date = models.DateTimeField(auto_now_add=True)

    def __str__(self): # Corrected from _str_
        return f"{self.brand_name} ({self.chemical_name}) - Archived History"


class DailyQuantity(models.Model):
    chemical_name = models.CharField(max_length=255, db_index=True)
    brand_name = models.CharField(max_length=255)
    dose_volume = models.CharField(max_length=100)
    # Add expiry_date. Allow it to be null if some items might not have one.
    expiry_date = models.DateField(null=True, blank=True, db_index=True) # Add expiry date

    date = models.DateField(db_index=True) # Date for which the quantity applies
    quantity = models.PositiveIntegerField(default=0) # The quantity entered/used for that day
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Update uniqueness constraint to include expiry_date
        unique_together = [['chemical_name', 'brand_name', 'dose_volume', 'expiry_date', 'date']]
        verbose_name = "Daily Quantity"
        verbose_name_plural = "Daily Quantities"
        ordering = ['date', 'chemical_name', 'brand_name', 'expiry_date'] # Add expiry to ordering

    def __str__(self):
        expiry_str = f" (Exp: {self.expiry_date})" if self.expiry_date else ""
        return f"{self.chemical_name} ({self.brand_name} - {self.dose_volume}{expiry_str}) on {self.date}: {self.quantity}"