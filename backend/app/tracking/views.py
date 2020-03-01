from rest_framework import generics
from .models import Location
from .serializers import LocationSerializer, LocationCreateSerializer


class ListLocations(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get_serializer_class(self):
        if self.request.method == "POST":
            return LocationCreateSerializer
        return super().get_serializer_class()
