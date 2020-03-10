import json

from rest_framework import generics
from rest_framework.response import Response

from .models import Device, Location
from .serializers import DeviceSerializer, DeviceTrackSerializer, \
    LocationCreateSerializer


class CreateLocation(generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationCreateSerializer


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
