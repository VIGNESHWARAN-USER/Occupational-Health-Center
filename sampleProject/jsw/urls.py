from . import views
from django.urls import path

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
    path('addvitals', views.add_vital_details, name = 'addVitals')
]
