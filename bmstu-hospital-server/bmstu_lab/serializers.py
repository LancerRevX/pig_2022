from .models import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers

# лаба 3
"""
создаём для нашего сервера API
API нужно, чтобы к серверу можно было подключаться с разных устройств
например, с приложения для телефона или из отдельного приложения на компьютере, а не только через браузер

веб сервис - программная служба со стандартизированным API
REST - стиль написания API, набор соглашений о том, как правильно создавать API

используем фреймворк Django REST Framework
в этом файле описаны сериализаторы данных, они преобразуют данные, взятые из модели, в формат JSON
"""


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        fields = ['username', 'password']


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(slug_field='name', many=True, read_only=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    doctor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'url', 'username', 'groups', 'patient', 'doctor']


class SpecialitySerializer(serializers.ModelSerializer):
    doctors = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
        # view_name='Doctor'
    )

    class Meta:
        model = Speciality
        fields = ['id', 'url', 'name', 'doctors', 'description']


class DoctorSerializer(serializers.ModelSerializer):
    work_record = serializers.IntegerField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # url = serializers.HyperlinkedIdentityField(view_name='Doctor')

    class Meta:
        model = Doctor
        fields = ['id', 'url', 'user', 'speciality', 'last_name', 'first_name', 'patronymic', 'full_name', 'photo', 'work_record', 'gender', 'cost']


class PatientSerializer(serializers.HyperlinkedModelSerializer):
    age = serializers.IntegerField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'url', 'user', 'first_name', 'last_name', 'patronymic', 'full_name', 'birth_date', 'gender', 'age']


class WardsSerializer(serializers.ModelSerializer):
    patients = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Ward
        fields = ['id', 'url', 'number', 'capacity', 'patients']


class WardInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = ['id', 'number', 'capacity']


class CaseSerializer(serializers.ModelSerializer):
    # patient = serializers.PrimaryKeyRelatedField(read_only=True)
    # doctor = serializers.PrimaryKeyRelatedField(read_only=True)
    # ward = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Case
        fields = ['id', 'patient', 'doctor', 'ward', 'start_date', 'end_date', 'active', 'description']


class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'url', 'patient', 'doctor', 'datetime']