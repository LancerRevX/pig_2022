from rest_framework.permissions import BasePermission, AllowAny
from .models import *


class LoginLogoutPermission(AllowAny):
    pass


class UserPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create']:
            return True
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve'] and obj.id == request.user.id:
            print(request.user)
            print(obj)
            return True
        else:
            return False


class ManagerPermission(BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return True


class DoctorPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.groups.filter(name='managers').exists():
            return True
        elif view.action in ['list', 'metadata', 'retrieve']:
            return True
        else:
            return False

    # def has_object_permission(self, request, view, obj):
    #     if request.user.groups.filter(name='managers').exists():
    #         return True
    #     else:
    #         return False

class PatientPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'metadata':
            return True
        if not request.user.is_authenticated:
            return False
        if request.user.groups.filter(name='managers').exists():
            return True

        if request.user.groups.filter(name='doctors').exists() and view.action in ['list', 'retrieve']:
            return True
        elif view.action in ['retrieve'] and Patient.objects.filter(user__id=request.user.id).exists():
            return True
        elif view.action in ['create'] and not Patient.objects.filter(user__id=request.user.id).exists():
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        if hasattr(request.user, 'manager'):
            return True
        elif request.user.groups.filter(name='doctors').exists() and view.action in ['retrieve']:
            return True
        elif view.action in ['retrieve'] and obj.user == request.user:
            return True
        else:
            return False


class WardPermission(BasePermission):
    def has_permission(self, request, view):
        if 'manager' in request.user.groups.all():
            return True
        elif view.action in ['list', 'retrieve']:
            return True
        else:
            return False


class CasePermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'metadata':
            return True
        if not request.user.is_authenticated:
            return False
        if request.user.groups.filter(name='managers').exists():
            return True
        elif request.user.groups.filter(name='doctors').exists() and view.action in ['list', 'retrieve', 'update', 'partial_update']:
            return True
        elif request.user.groups.filter(name='patients').exists() and view.action == 'list':
            return True
        else:
            return False


class AppointmentPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'metadata':
            return True
        user = request.user
        if hasattr(user, 'manager'):
            return True
        elif hasattr(user, 'doctor') and view.action in ['list']:
            return True
        elif hasattr(user, 'patient') and view.action in ['list', 'create', 'destroy']:
            return True
        else:
            return False

