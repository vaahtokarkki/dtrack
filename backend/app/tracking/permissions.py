from rest_framework import permissions

from .models import Device


class HasAccessToDevice(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj in request.user.devices.all()


class HasAccessToTrack(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user_devices = Device.objects \
            .filter(pk__in=request.user.devices.values_list("pk", flat=True))
        return obj.device in user_devices
