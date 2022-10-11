from .models import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class SpecialitySerializer(serializers.HyperlinkedModelSerializer):
    doctors = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='doctor-detail'
    )

    class Meta:
        model = Speciality
        fields = ['id', 'name', 'doctors']


class DoctorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'url', 'user', 'speciality', 'last_name', 'first_name', 'patronymic', 'photo']


class PatientSerializer(serializers.HyperlinkedModelSerializer):
    age = serializers.IntegerField(read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'user', 'first_name', 'last_name', 'patronymic', 'birth_date', 'gender', 'age']


class WardsSerializer(serializers.HyperlinkedModelSerializer):
    patients = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='patient-detail'
    )

    class Meta:
        model = Ward
        fields = ['number', 'capacity', 'patients']


class CaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Case
        fields = ['patient', 'doctor', 'ward', 'start_date', 'end_date', 'active', 'description']