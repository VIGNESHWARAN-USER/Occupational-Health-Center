from . import views
from django.urls import path

urlpatterns = [
    path('login', views.login, name='login'),
    path('userData', views.fetchdata, name = 'userData'),
    path('addEmployee', views.addbasicdetails, name = 'addDetails'),
    path('bookAppointment/', views.BookAppointment, name='Appointments'),
    path('uploadAppointment/', views.uploadAppointment, name='uploadAppointment'),
    path('appointments/', views.get_appointments, name='get_appointments'),
    path('addUsers/', views.create_users, name='addusers')
]
