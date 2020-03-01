from django.urls import path

from .views import ListLocations

urlpatterns = [
    path('locations/', ListLocations.as_view()),
]