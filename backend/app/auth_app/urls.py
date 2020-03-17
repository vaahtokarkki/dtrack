from django.urls import path

from .views import UserDetailsView, MyTokenObtainPairView


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view()),
    path('user/<int:pk>/', UserDetailsView.as_view()),
]
