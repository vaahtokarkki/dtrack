import json

from rest_framework import generics
from rest_framework.response import Response

from .models import Device, Location
from .serializers import DeviceSerializer, DeviceTrackSerializer, \
    LocationCreateSerializer


class CreateLocation(generics.CreateAPIView):
    permission_classes = ()
    authentication_classes = ()
    queryset = Location.objects.all()
    serializer_class = LocationCreateSerializer


class ListDevices(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(pk__in=user.devices.values_list("pk", flat=True))


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
