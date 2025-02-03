from . import views
from django.urls import path

urlpatterns = [
    path('login', views.login, name='login'),
    path('userData', views.fetchdata, name = 'userData'),
    # path('bookAppointment/', views.BookAppointment, name='Appointments'),
    # path('uploadAppointment/', views.uploadAppointment, name='uploadAppointment'),
    # path('appointments/', views.get_appointments, name='get_appointments')
]
