from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from tracking.serializers import SimpleDeviceSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    devices = SimpleDeviceSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'name', 'devices']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user_id': self.user.pk})
        return data
