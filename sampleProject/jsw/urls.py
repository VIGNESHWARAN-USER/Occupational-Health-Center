from . import views
from django.urls import path
from .views import get_categories, get_reviews, add_review

urlpatterns = [
    path('login', views.login, name='login'),
    path('userData', views.fetchdata, name = 'userData'),
    path('addbasicdetails', views.add_basic_details, name = 'addDetails'),
    path('bookAppointment/', views.BookAppointment, name='Appointments'),
    path('uploadAppointment/', views.uploadAppointment, name='uploadAppointment'),
    path('appointments/', views.get_appointments, name='get_appointments'),
    path('addUsers/', views.create_users, name='addusers'),
    path('save-mockdrills/', views.save_mockdrills, name='save_mockdrills'),
    path('add-camp/', views.add_camp, name='add_camp'),
    path('update-appointment-status/', views.update_appointment_status, name='update_appointment_status'),
    path('addEntries', views.addEntries, name='add_Entries'),
    path('addEntries', views.addEntries, name='add_Entries'),
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('addvitals', views.add_vital_details, name = 'addVitals'),
    path("vaccination/", views.insert_vaccination, name="insert_vaccination"),
    path("getvaccinations/", views.fetch_vaccinations, name="get_vaccination"),
    path("fitness-tests/", views.fitness_test, name="fitness_test"),
    path('addEntries', views.addEntries, name='add_Entries'),
    path("categories/", get_categories, name="get_categories"),
    path("reviews/<str:status>/", get_reviews, name="get_reviews"),
    path("add-review/", add_review, name="add_review"),
]
