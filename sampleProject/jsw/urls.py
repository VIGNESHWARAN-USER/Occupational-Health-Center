# urls.py

from . import views
from django.urls import path
# from .views import get_categories, get_reviews, add_review # Already imported via views
from django.conf.urls.static import static
from django.conf import settings # Import settings

urlpatterns = [
    # Authentication & Member Management (Unchanged)
    path('login', views.login, name='login'),
    path('forgot_password/', views.forgot_password, name='forgot_password'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('reset_password/', views.reset_password, name='reset_password'),
    path('find_member_by_email/', views.find_member_by_email, name='find_member_by_email'),
    path('members/add/', views.add_member, name='member-add'), # Renamed for clarity
    path('members/update/<int:member_id>/', views.update_member, name='update_member'),
    path('members/delete/<int:member_id>/', views.delete_member, name='delete_member'),
    path('addUsers/', views.create_users, name='addusers'), # For initial setup

    # Core Data Fetching / Entry (Using Aadhar)
    path('userData', views.fetchdata, name = 'userData'), # Fetches latest based on aadhar
    path('addEntries', views.addEntries, name='add_Entries'), # Uses aadhar from payload
    path('addbasicdetails', views.add_basic_details, name = 'addDetails'), # Uses aadhar from payload
    path('updateProfileImage/<str:aadhar>', views.uploadImage, name='upload_image'), # CHANGED: emp_no -> aadhar
    path('visitData/<str:aadhar>', views.fetchVisitdata, name = 'fetchVisitdata'), # CHANGED: emp_no -> aadhar
    path('visitData/<str:aadhar>/<str:date_str>', views.fetchVisitDataWithDate, name = 'fetchVisitdataWithDate'), # CHANGED: emp_no -> aadhar, date -> date_str
    path('update_employee_status/', views.update_employee_status, name='update_employee_status'), # Uses aadhar from payload

    # Vitals & Investigations (Using Aadhar from payload)
    path('addvitals', views.add_vital_details, name = 'addVitals'),
    path("addInvestigation", views.add_haem_report, name="addInvestigation"), # Keep alias, uses aadhar
    path("addRoutineSugarTest", views.add_routine_sugar, name="addRoutineSugarTest"), # uses aadhar
    path("addRenalFunctionTest", views.add_renel_function, name="addRenalFunctionTest"), # uses aadhar
    path("addLipidProfile", views.add_lipid_profile, name="addLipidProfile"), # uses aadhar
    path("addLiverFunctionTest", views.add_liver_function, name="addLiverFunctionTest"), # uses aadhar
    path("addThyroidFunctionTest", views.add_thyroid_function, name="addThyroidFunctionTest"), # uses aadhar
    path("addAutoimmuneFunctionTest", views.add_autoimmune_function, name="addAutoimmuneFunctionTest"), # uses aadhar    
    path("addCoagulationTest", views.add_coagulation_function, name="addCoagulationTest"), # Assuming view exists and uses aadhar
    path("addEnzymesAndCardiacProfile", views.add_enzymes_cardiac, name="addEnzymesAndCardiacProfile"), # uses aadhar
    path("addUrineRoutine", views.add_urine_routine, name="addUrineRoutine"), # uses aadhar
    path("addSerology", views.add_serology, name="addSerology"), # Corrected view, uses aadhar
    path("addMotion", views.add_motion_test, name="addMotion"), # uses aadhar
    path("addCultureSensitivityTest", views.add_culturalsensitivity_function, name="addCultureSensitivityTest"), # uses aadhar

    # Other Medical Data (Using Aadhar from payload)
    path("medical-history/", views.create_medical_history, name="create_medical_history"), # uses aadhar
    path("addMensPack", views.add_mens_pack, name="addMensPack"), # uses aadhar
    path("addWomensPack", views.add_womens_function, name="addWomensPack"),
    path("addOccupationalprofile", views.add_occupationalprofile_function, name="addMensPack"),
    path("addOtherstest", views.add_otherstest_function, name="addOtherstest"),

    path("addOpthalmicReport", views.add_opthalmic_report, name="addOpthalmicReport"), # uses aadhar
    path("addUSG", views.add_usg_report, name="addUSG"), # uses aadhar
    path("addMRI", views.add_mri_report, name="addMRI"), # uses aadhar
    path("addXRay", views.add_xray_function, name="addXRay"), # uses aadhar
    path("addCT", views.add_ct_function, name="addCT"), # uses aadhar
    
    path("vaccination/", views.insert_vaccination, name="insert_vaccination"), # uses aadhar
    path("getvaccinations/", views.fetch_vaccinations, name="get_vaccination"), # Optional aadhar filter?
    path("fitness-tests/", views.fitness_test, name="fitness_test"), # uses aadhar
    path('consultations/add/', views.add_consultation, name='add_consultation'), # uses aadhar
    path('significant_notes/add/', views.add_significant_notes, name='add_significant_note'), # uses aadhar
    path('get_notes/<str:aadhar>', views.get_notes, name='get_notes_by_aadhar'), # CHANGED: emp_no -> aadhar
    path('get_notes/', views.get_notes_all, name='get_notes_all'), # Fetches all

    # Forms (Using Aadhar from payload - Check Models!)
    path('form17/', views.create_form17, name='create_form17'), # uses aadhar
    path('form38/', views.create_form38, name='create_form38'), # uses aadhar
    path('form39/', views.create_form39, name='create_form39'), # uses aadhar
    path('form40/', views.create_form40, name='create_form40'), # uses aadhar
    path('form27/', views.create_form27, name='create_form27'), # uses aadhar

    # Appointments (Using AadharNo / ID)
    path('bookAppointment/', views.BookAppointment, name='book_appointment'), # Renamed for clarity
    path('uploadAppointment/', views.uploadAppointment, name='uploadAppointment'),
    path('appointments/', views.get_appointments, name='get_appointments'), # Can filter by aadharNo query param
    path('update-appointment-status/', views.update_appointment_status, name='update_appointment_status'), # Uses appointment ID

    # Prescriptions (Using Aadhar / ID)
    path('prescriptions/add/', views.add_prescription, name='add_prescription'), # Uses aadhar from payload
    path('prescriptions/view/', views.view_prescriptions, name='view_prescriptions'), # Lists all
    path('prescriptions/view/<str:aadhar>/', views.view_prescriptions_emp, name='view_update_prescriptions_by_aadhar'), # CHANGED: emp_no -> aadhar (Handles GET/PUT)
    path('prescriptions/view/id/<int:prescription_id>/', views.view_prescription_by_id, name='view_prescription_by_id'),
    # path('prescriptions/update/<int:prescription_id>/', views.update_prescription, name='update_prescription'), # Covered by PUT in view_prescriptions_emp

    # Pharmacy / Inventory / Calibration (Unchanged - No apparent emp_no/aadhar link)
    path("add-stock/", views.add_stock, name="add-stock"),
    path('current_stock/', views.get_current_stock, name='current_stock'),
    path('stock_history/', views.get_stock_history, name='stock_history'),
    path('current_expiry/', views.get_current_expiry, name='current_expiry'),
    path('remove_expiry/', views.remove_expired_medicine, name='remove_expiry'),
    path("expiry_register/", views.get_expiry_register, name="expiry_register"),
    path("get-brand-names/", views.get_brand_names, name="get_brand_names"),
    path("get_chemical_name/", views.get_chemical_name, name="get_chemical_name"),
    path("discarded_medicines/", views.get_discarded_medicines, name="discarded_medicines"),
    path("add_discarded_medicine/", views.add_discarded_medicine, name="add_discarded_medicine"),
    path("get_ward_consumable/", views.get_ward_consumables, name="get_ward_consumable"),
    path("add_ward_consumable/", views.add_ward_consumable, name="add_ward_consumable"),
    path("get-dose-volume/", views.get_dose_volume, name="get-dose-volume"),
    path("get-chemical-name-by-brand/", views.get_chemical_name_by_brand, name="get-chemical-name-by-brand"),
    path("get_pending_calibrations/", views.get_pending_calibrations, name="get_pending_calibrations"),
    path("get_calibration_history/", views.get_calibration_history, name="get_calibration_history"),
    path("complete_calibration/", views.complete_calibration, name="complete_calibration"),
    path("add_instrument/", views.add_instrument, name="add_instrument"),
    path("archive_stock/", views.archive_zero_quantity_stock, name="archive_stock"),
    path("get_pending_next_month_count/", views.get_pending_next_month_count, name="get_pending_next_month_count"),


    # Mock Drills / Camps / Reviews (Check identifier usage)
    path('save-mockdrills/', views.save_mockdrills, name='save_mockdrills'), # Uses aadhar from payload if applicable
    path('get-mockdrills/', views.get_mockdrills, name='get_mockdrills'),
    path('add-camp/', views.add_camp, name='add_camp'),
    path('get-camps/', views.get_camps, name='get_camps'),
    path('upload-files/', views.upload_files, name='upload_files'),
    path('download-file/', views.download_file, name='download_file'),
    path('delete-file/', views.delete_file, name='delete_file'),
    path("categories/", views.get_categories, name="get_categories"), # Renamed view import usage
    path("reviews/<str:status>/", views.get_reviews, name="get_reviews"), # Renamed view import usage
    path("add-review/", views.add_review, name="add_review"), # Renamed view import usage

    # Dashboard Stats / General Fetch (Unaffected by primary key change)
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('visitData/', views.fetchVisitdataAll, name = 'fetchVisitdataAll'), # Fetches all dashboard
    path('fitnessData/', views.fetchFitnessData, name = 'fetchFitnessDataAll'), # Fetches all fitness
    path('get_current_expiry_count/', views.get_current_expiry_count, name='get_current_expiry_count'),
    path('get_red_status_count/', views.get_red_status_count, name='get_red_status_count'),


]

# Add static files serving during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)