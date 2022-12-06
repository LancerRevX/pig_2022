from rest_framework import viewsets, views, permissions
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, BasePermission, AllowAny
import django_filters.rest_framework as filters
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import AnonymousUser
from datetime import datetime, timezone
from ..serializers import *
from ..permissions import *

"""
контроллер для лабы 3 это три файла views/api.py, urls/api.py, serializers.py
вместо html страниц сервер в данном случае отправляет данные в формате json
их удобнее читать компьюетру и также можно сделать мобильное приложение
"""


class LoginViewSet(viewsets.GenericViewSet):
    # permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def list(self, request: Request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user, context={'request': request}).data, 200)
        else:
            return Response(False, 401)

    def create(self, request: Request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user is not None:
                login(request, user)
                return Response(status=200, data=UserSerializer(user, context={'request': request}).data)
            else:
                return Response(status=403, data='Invalid username or password')
        else:
            return Response(status=400, data='Username and password required')


class LogoutView(views.APIView):
    permission_classes = [LoginLogoutPermission]
    def delete(self, request: Request):
        if request.user.is_authenticated:
            logout(request)
            return Response(status=200)
        else:
            return Response(status=401)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [UserPermission]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class SpecialityViewSet(viewsets.ModelViewSet):
    queryset = Speciality.objects.all()
    serializer_class = SpecialitySerializer


class DoctorFilterSet(filters.FilterSet):
    min_cost = filters.NumberFilter(field_name='cost', lookup_expr='gte')
    max_cost = filters.NumberFilter(field_name='cost', lookup_expr='lte')

    class Meta:
        model = Doctor
        fields = ['speciality', 'cost', 'user']


class DoctorViewSet(viewsets.ModelViewSet):
    permission_classes = [DoctorPermission]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DoctorFilterSet
    # search_fields = ['last_name', 'first_name', 'patronymic']
    # filterset_fields = ['speciality']


class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [PatientPermission]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['user']


class WardViewSet(viewsets.ModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardsSerializer

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name__in=['doctors', 'managers']).exists():
            return WardsSerializer
        else:
            return WardInfoSerializer


class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    queryset = Case.objects.all().order_by('-active')
    permission_classes = [CasePermission]

    def list(self, request, *args, **kwargs):
        if hasattr(request.user, 'patient'):
            queryset = Case.objects.filter(patient=request.user.patient)
        else:
            queryset = Case.objects.all()
        queryset = queryset.order_by('-active')
        serializer = CaseSerializer(queryset, many=True)
        return Response(serializer.data)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.filter(datetime__gt=datetime.now())
    serializer_class = AppointmentSerializer
    permission_classes = [AppointmentPermission]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='patients'):
            queryset = Appointment.objects.filter(patient=user.patient)
        else:
            queryset = Appointment.objects.all()
        queryset = queryset.filter(datetime__gt=datetime.now()).order_by('-datetime')
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=400)
        doctor = serializer.validated_data['doctor']
        patient = request.user.patient
        appointment = doctor.make_appointment(patient, serializer.validated_data['datetime'])
        if not appointment:
            return Response(status=416)
        return Response(status=200, data=AppointmentSerializer(appointment, context={'request': request}).data)