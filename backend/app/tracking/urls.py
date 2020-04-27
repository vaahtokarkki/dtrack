from django.urls import path

from .views import CreateLocation, CreateTrackView, DeviceDetailsView, ListDevices, \
    ListDevicesActiveTrack, ListTracks, TrackDetailsView


urlpatterns = [
    path('locations/', CreateLocation.as_view()),
    path('locations/latest/', ListDevicesActiveTrack.as_view()),
    path('devices/', ListDevices.as_view()),
    path('devices/<int:pk>/', DeviceDetailsView.as_view()),
    path('devices/<int:pk>/track/', CreateTrackView.as_view()),
    path('tracks/', ListTracks.as_view()),
    path('tracks/<int:pk>/', TrackDetailsView.as_view()),
]
