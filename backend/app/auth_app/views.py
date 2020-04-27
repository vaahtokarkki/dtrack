from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import CanAccessUser
from .serializers import MyTokenObtainPairSerializer, UserSerializer


class UserDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (CanAccessUser,)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
