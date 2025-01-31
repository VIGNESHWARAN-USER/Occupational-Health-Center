from . import views;
from django.urls import path

urlpatterns = [
    path('', views.home, name='home'),
    path('clac/', views.calc, name = 'calc'),
    path('html', views.htmlpage, name='html')
]