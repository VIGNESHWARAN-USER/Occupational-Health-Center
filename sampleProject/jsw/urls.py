from . import views
from django.urls import path
from .views import get_categories, get_reviews, add_review
from django.conf.urls.static import static


urlpatterns = [
    path('login', views.login, name='login'),
    path('userData', views.fetchdata, name = 'userData'),
    path('addbasicdetails', views.add_basic_details, name = 'addDetails'),
    path('bookAppointment/', views.BookAppointment, name='Appointments'),
    path('uploadAppointment/', views.uploadAppointment, name='uploadAppointment'),
    path('appointments/', views.get_appointments, name='get_appointments'),
    path('addUsers/', views.create_users, name='addusers'),
    path('save-mockdrills/', views.save_mockdrills, name='save_mockdrills'),
    path('get-mockdrills/', views.get_mockdrills, name='get_mockdrills'),
    path('add-camp/', views.add_camp, name='add_camp'),
    path('get-camps/', views.get_camps, name='get_camps'),
    path('upload-files/', views.upload_files, name='upload_files'),
    path('download-file/', views.download_file, name='download_file'),
    path('delete-file/', views.delete_file, name='delete_file'),
    path('update-appointment-status/', views.update_appointment_status, name='update_appointment_status'),
    path('addEntries', views.addEntries, name='add_Entries'),
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('addvitals', views.add_vital_details, name = 'addVitals'),
    path("vaccination/", views.insert_vaccination, name="insert_vaccination"),
    path("getvaccinations/", views.fetch_vaccinations, name="get_vaccination"),
    path("fitness-tests/", views.fitness_test, name="fitness_test"),
    path("categories/", get_categories, name="get_categories"),
    path("reviews/<str:status>/", get_reviews, name="get_reviews"),
    path("add-review/", add_review, name="add_review"),
    path("addInvestigation", views.add_haem_report, name="addInvestigation"),  # Keep this
    path("medical-history/", views.create_medical_history, name="add_review"),
    # New URLs for different investigations
    path("addRoutineSugarTest", views.add_routine_sugar, name="addRoutineSugarTest"),
    path("addRenalFunctionTest", views.add_renel_function, name="addRenalFunctionTest"),
    path("addLipidProfile", views.add_lipid_profile, name="addLipidProfile"),
    path("addLiverFunctionTest", views.add_liver_function, name="addLiverFunctionTest"),
    path("addThyroidFunctionTest", views.add_thyroid_function, name="addThyroidFunctionTest"),
    # path("addCoagulationTest", views.add_mri, name="addCoagulationTest"),  # Corrected the mis-mapping
    path("addEnzymesAndCardiacProfile", views.add_enzymes_cardiac, name="addEnzymesAndCardiacProfile"),
    path("addUrineRoutine", views.add_urine_routine, name="addUrineRoutine"),
    path("addSerology", views.add_urine_routine, name="addSerology"), # Fixed the mis-mapping
    path("addMotion", views.add_motion_test, name="addMotion"),
    #path("addCultureSensitivityTest", views.add_culture_sensitivity_test, name="addCultureSensitivityTest"),
    path("addMensPack", views.add_mens_pack, name="addMensPack"),
    path("addOpthalmicReport", views.add_opthalmic_report, name="addOpthalmicReport"),
    path("addUSG", views.add_usg_report, name="addUSG"),
    path("addMRI", views.add_mri_report, name="addMRI"),
    # path("addCT",views.add_mri, name = "addCT"),
    path('members/add/', views.add_member, name='member-add'),
    path('members/<int:pk>/', views.member_detail, name='member-detail'),
    path('visitData/', views.fetchVisitdataAll, name = 'fetchVisitdata'),
    path('fitnessData/', views.fetchFitnessData, name = 'fetchVisitdata'),
    path('visitData/<str:emp_no>', views.fetchVisitdata, name = 'fetchVisitdata'),
    path('consultations/add/', views.add_consultation, name='add_consultation'),
    path('visitData/<str:emp_no>/<str:date>', views.fetchVisitDataWithDate, name = 'fetchVisitdata'),
    path('updateProfileImage/<str:emp_no>', views.uploadImage, name='upload_image'),
    path('significant_notes/add/', views.add_significant_notes, name='add_significant_note'),
    path('form17/', views.create_form17, name='create_form17'),
    path('form38/', views.create_form38, name='create_form38'),
    path('form39/', views.create_form39, name='create_form39'),
    path('form40/', views.create_form40, name='create_form40'),
    path('form27/', views.create_form27, name='create_form27'),
    path("add-stock/", views.add_stock, name="add-stock"),
    path('current_stock/', views.get_current_stock, name='current_stock'),
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
    path('prescriptions/', views.add_prescription, name='add_prescription'),
    path('prescriptions/view/', views.view_prescriptions, name='view_prescriptions'),
]