from django.urls import path
from bmstu_lab.templates import views

urlpatterns = [
    path('', views.home),
    path('doctors/', views.doctors, name='doctors'),
    path('patients/', views.patients, name='patients'),
    path('wards/', views.wards, name='wards'),
    path('cases/', views.cases, name='cases'),
    path('make_appointment/<int:id>', views.make_appointment, name='make_appointment')
]
