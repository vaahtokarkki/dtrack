from django.urls import path

from .views import LatestLocation, ListDevices, ListLocations


urlpatterns = [
    path('locations/', ListLocations.as_view()),
    path('locations/latest/', LatestLocation.as_view()),
    path('devices/', ListDevices.as_view()),
]
