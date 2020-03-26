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
        location = super().perform_create(serializer)
        queue_create_track(location.device)
        return location


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


class ListTracks(generics.ListAPIView):
    serializer_class = TrackSerializer
    permission_classes = ()
    authentication_classes = ()

    def get_queryset(self):
        queryset = Track.objects.order_by("-created")
        limit = self.request.query_params.get("limit", 0)
        if limit > 0:
            return queryset[:limit]
        return queryset
