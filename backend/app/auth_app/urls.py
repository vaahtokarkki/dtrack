from django.urls import path

from .views import CreateOneTimePasswordView, MyTokenObtainPairView, SignUpView, \
    UserDetailsView


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view()),
    path('user/<int:pk>/', UserDetailsView.as_view()),
    path('user/<int:pk>/token/', SignUpView.as_view()),
    path('user/signup/', CreateOneTimePasswordView.as_view()),
]
