from rest_framework import routers
from ..views.api import *
from django.urls import path, include

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('specialities', SpecialityViewSet)
router.register('doctors', DoctorViewSet)
router.register('patients', PatientViewSet)
router.register('wards', WardViewSet)
router.register('cases', CaseViewSet)

urlpatterns = [
    path('', include(router.urls))
]