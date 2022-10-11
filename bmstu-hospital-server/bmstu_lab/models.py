from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from datetime import datetime
from os import path


class Speciality(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    patronymic = models.CharField(max_length=32)
    speciality = models.ForeignKey(Speciality, related_name='doctors', on_delete=models.RESTRICT)
    photo = models.FileField(upload_to='static/photos/')

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'

    def __str__(self):
        return f'{self.speciality} {self.full_name}'


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    patronymic = models.CharField(max_length=32)
    birth_date = models.DateField()
    gender = models.IntegerField(choices=[
        (0, 'Женщина'),
        (1, 'Мужчина')
    ])

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'

    @property
    def age(self):
        return (datetime.now().date() - self.birth_date).days // 365

    def __str__(self):
        return f'{self.full_name}'


class Ward(models.Model):
    number = models.IntegerField(unique=True)
    capacity = models.IntegerField()

    @property
    def occupancy(self):
        return len(Case.objects.filter(ward=self, active=True))

    @property
    def patients(self):
        return Patient.objects.filter(cases__ward=self, cases__active=True)

    def is_full(self):
        return self.occupancy == self.capacity

    def __str__(self):
        return f'{self.number}'


class Case(models.Model):
    patient = models.ForeignKey(Patient, related_name='cases', on_delete=models.RESTRICT)
    doctor = models.ForeignKey(Doctor, on_delete=models.RESTRICT)
    ward = models.ForeignKey(Ward, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    active = models.BooleanField(default=True)

    def discharge(self):
        self.active = False
        self.end_date = datetime.now().date()

    def __str__(self):
        return f'{self.start_date}, {self.patient}'