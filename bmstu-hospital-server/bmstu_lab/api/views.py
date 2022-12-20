from rest_framework import viewsets, views, permissions
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, BasePermission, AllowAny
import django_filters.rest_framework as filters
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import AnonymousUser
from datetime import datetime, timezone
from bmstu_lab.serializers import *
from bmstu_lab.permissions import *
from django.contrib.auth.models import Group

"""
контроллер для лабы 3 это три файла views/urls.py, urls/urls.py, serializers.py
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


class PatientSignupView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request: Request):
        serializer = PatientSignupSerializer(data=request.data)
        if serializer.is_valid():
            signup_data = serializer.validated_data
            if signup_data['password'] != signup_data['password_repeat']:
                return Response('Passwords do not match!', 400)
            if User.objects.filter(username=signup_data['username']).exists():
                return Response(f'Username {signup_data["username"]} is already taken!', 403)
            new_user = User.objects.create_user(signup_data['username'], None, signup_data['password'])
            patients_group = Group.objects.filter(name='patients').get()
            patients_group.user_set.add(new_user)
            new_user.save()
            new_patient = Patient(
                first_name = signup_data['first_name'],
                last_name = signup_data['last_name'],
                patronymic = signup_data['patronymic'],
                birth_date = signup_data['birth_date'],
                gender = signup_data['gender'],
                user = new_user
            )
            new_patient.save()
            return Response('Successfully created a new patient!', 200)
        else:
            missing_fields = list(serializer.errors.keys())
            return Response(f'The following fields are required: {missing_fields}', 400)


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

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, 400)
        signup_data = serializer.validated_data
        if User.objects.filter(username=signup_data['username']).exists():
            return Response(f'Username {signup_data["username"]} is already taken!', 403)
        new_user = User.objects.create_user(signup_data['username'], None, signup_data['password'])
        return Response(UserSerializer(new_user, context={'request': request}).data, 201)



class ManagerViewSet(viewsets.ModelViewSet):
    permission_classes = [ManagerPermission]
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer


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
        if request.user.groups.filter(name='patients').exists():
            queryset = Case.objects.filter(patient=request.user.patient)
        else:
            queryset = Case.objects.all()
        queryset = queryset.order_by('-active')
        serializer = CaseSerializer(queryset, many=True)
        return Response(serializer.data)


class AppointmentFilterSet(filters.FilterSet):
    datetime_after = filters.DateTimeFilter(field_name='datetime', lookup_expr='gte')
    datetime_before = filters.DateTimeFilter(field_name='datetime', lookup_expr='lte')

    class Meta:
        model = Appointment
        fields = ['datetime', 'status', 'patient', 'doctor']


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.filter(datetime__gt=datetime.now())
    serializer_class = AppointmentSerializer
    permission_classes = [AppointmentPermission]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = AppointmentFilterSet

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'manager'):
            queryset = Appointment.objects.all()
        elif hasattr(user, 'doctor'):
            queryset = Appointment.objects.filter(
                doctor=user.doctor,
                datetime__gt=datetime.now())
        elif hasattr(user, 'patient'):
            queryset = Appointment.objects.filter(
                patient=user.patient,
                datetime__gt=datetime.now())
        else:
            queryset = Appointment.objects.none()
        queryset = queryset.order_by('-datetime')
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = AppointmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, 400)
        user = request.user
        if not hasattr(user, 'patient'):
            return Response('Only patients can make appointments!', 403)
        doctor = serializer.validated_data['doctor']
        patient = user.patient
        appointment = doctor.make_appointment(patient, serializer.validated_data['datetime'])
        if not appointment:
            return Response('Can\'t make appointment at the chosen time!', 416)
        return Response(status=200, data=AppointmentSerializer(appointment, context={'request': request}).data)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if hasattr(user, 'manager'):
            return super().destroy(request, *args, **kwargs)
        elif hasattr(user, 'patient'):
            appointment = self.get_object()
            appointment.status = Appointment.CANCELLED
            appointment.save()
            return Response('Successfully cancelled appointment', 200)


class AppointmentStatusesView(views.APIView):
    def get(self, request: Request):
        return Response(Appointment.statusChoices, 200)