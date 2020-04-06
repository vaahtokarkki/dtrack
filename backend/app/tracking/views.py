import json

from rest_framework import generics
from rest_framework.response import Response

from .models import Device, Location, Track
from .serializers import DeviceSerializer, DeviceTrackSerializer, \
    LocationCreateSerializer, TrackSerializer
from .utils import queue_create_track


class CreateLocation(generics.CreateAPIView):
    permission_classes = ()
    authentication_classes = ()
    queryset = Location.objects.all()
    serializer_class = LocationCreateSerializer

    def perform_create(self, serializer):
        super().perform_create(serializer)
        queue_create_track(serializer.instance.device.pk)
        return serializer.instance


class ListDevices(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer

    def get_queryset(self):
        user = self.request.user
        return Device.objects.filter(pk__in=user.devices.values_list("pk", flat=True))


class ListDevicesActiveTrack(generics.GenericAPIView):
    def post(self, request):
        user = self.request.user
        queryset = Device.objects.filter(pk__in=user.devices.values_list("pk", flat=True))
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


class ListTracks(generics.ListAPIView):
    serializer_class = TrackSerializer

    def get_queryset(self):
        user = self.request.user
        user_devices = user.devices.values_list("pk", flat=True)
        queryset = Track.objects.filter(device__pk__in=user_devices).order_by("-created")
        limit = self.request.query_params.get("limit", 0)
        if limit > 0:
            return queryset[:limit]
        return queryset
