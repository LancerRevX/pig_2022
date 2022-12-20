from rest_framework import routers
from bmstu_lab.api.views import *
from django.urls import path, include

"""
URLы для API, например, 127.0.0.1:8000/api/users - список пользователей системы
"""

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('managers', ManagerViewSet)
router.register('specialities', SpecialityViewSet)
router.register('doctors', DoctorViewSet)
router.register('patients', PatientViewSet)
router.register('wards', WardViewSet)
router.register('cases', CaseViewSet)
router.register('appointments', AppointmentViewSet)
router.register('login', LoginViewSet, basename='login')

urlpatterns = [
    path('', include(router.urls)),
    path('logout/', LogoutView.as_view()),
    path('signup/', PatientSignupView.as_view()),
    path('appointment-statuses/', AppointmentStatusesView.as_view())
]