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

        serializer = DeviceTrackSerializer(
            queryset, many=True, context=self.get_serializer_context()
        )
        return Response(serializer.data, status=200)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        context["data"] = json.loads(self.request.body.decode('utf-8'))
        return context
