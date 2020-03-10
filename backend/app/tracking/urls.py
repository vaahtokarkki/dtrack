from django.urls import path

from .views import ListDevices, ListDevicesActiveTrack, CreateLocation


urlpatterns = [
    path('locations/', CreateLocation.as_view()),
    path('locations/latest/', ListDevicesActiveTrack.as_view()),
    path('devices/', ListDevices.as_view()),
]
