from django.urls import path

from .views import CreateLocation, ListDevices, ListDevicesActiveTrack, ListTracks


urlpatterns = [
    path('locations/', CreateLocation.as_view()),
    path('locations/latest/', ListDevicesActiveTrack.as_view()),
    path('devices/', ListDevices.as_view()),
    path('tracks/', ListTracks.as_view()),
]
