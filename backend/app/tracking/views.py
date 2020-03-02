from datetime import timedelta

from django.utils import timezone
from rest_framework import generics

from .models import Device, Location
from .serializers import DeviceSerializer, LocationCreateSerializer, LocationSerializer


class ListLocations(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_serializer_class(self):
        if self.request.method == "POST":
            return LocationCreateSerializer
        return super().get_serializer_class()


class ListDevices(generics.ListCreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class LatestLocation(generics.ListAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        hour_ago = timezone.now() - timedelta(hours=1)
        return Location.objects.filter(timestamp__gte=hour_ago) \
            .order_by("device", "-timestamp").distinct("device")
