import json

from rest_framework import generics
from rest_framework.response import Response

from .models import Device, Location
from .serializers import DeviceSerializer, DeviceTrackSerializer, \
    LocationCreateSerializer, LocationSerializer


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


class ListDevicesActiveTrack(generics.GenericAPIView):
    def post(self, request):
        queryset = Device.objects.all()
        request_data = json.loads(request.body.decode('utf-8'))
        devices = [row["device"] for row in request_data]
        if devices:
            queryset = queryset.filter(pk__in=devices)
        serializer_context = {"request": request, "data": request_data}
        return Response(
            DeviceTrackSerializer(queryset, many=True, context=serializer_context).data
        )
