from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from datetime import datetime, timedelta, timezone
from os import path
import pytz


# ORM  (англ. Object-Relational Mapping, рус. объектно-реляционное отображение, или преобразование)


# cвязывает классы Пайтон с базой данных SQLite
# база данных нахоидтся в файле db.sqlite3

# в этом файле находится МОДЕЛЬ, описанная на языке Пайтон

# команда python manage.py makemigrations создаёт SQL код, который переносит данную модель в базу данных
# то есть команда python manage.py migrate выполняет данную миграцию


class Manager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manager')
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    patronymic = models.CharField(max_length=32)

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'


class Speciality(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField()

    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor')
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    patronymic = models.CharField(max_length=32)
    speciality = models.ForeignKey(Speciality, related_name='doctors', on_delete=models.RESTRICT)
    photo = models.FileField(upload_to='static/photos/', blank=True, null=True, default=None)
    hire_date = models.DateField(auto_now_add=True)
    cost = models.IntegerField()
    gender = models.IntegerField(choices=[
        (0, 'Женщина'),
        (1, 'Мужчина')
    ])

    @property
    def work_record(self):
        return (datetime.now().date() - self.hire_date).days // 365

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'

    def make_appointment(self, patient, datetime_):
        now = datetime.now()
        if datetime_ < datetime.now(timezone.utc) + timedelta(days=1):
            return None
        if Appointment.objects.filter(
            doctor=self,
            datetime__gt=now - timedelta(minutes=30),
            datetime__lt=now + timedelta(minutes=30),
            status=Appointment.SCHEDULED
        ).exists():
            return None
        appointment = Appointment(doctor=self, patient=patient, datetime=datetime_)
        appointment.save()
        return appointment

    def __str__(self):
        return f'{self.speciality} {self.full_name}'


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient')
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


class Appointment(models.Model):
    SCHEDULED = 0
    DONE = 1
    CANCELLED = 2
    DIDNT_COME = 3
    statusChoices = [
        (SCHEDULED, 'Назначен'),
        (DONE, 'Проведён'),
        (CANCELLED, 'Отменён'),
        (DIDNT_COME, 'Пациент не пришёл')
    ]
    patient = models.ForeignKey(Patient, related_name='appointments', on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, related_name='appointments', on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    status = models.IntegerField(choices=statusChoices, default=SCHEDULED)

    def __str__(self):
        return f'{self.patient} => {self.doctor}, {self.datetime.strftime("%d.%m.%Y %H:%M")}'


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
