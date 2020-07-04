from rest_framework import serializers, validators
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from tracking.serializers import SimpleDeviceSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    devices = SimpleDeviceSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'name', 'devices', 'refresh_interval',
                  'email']
        read_only_fields = ("devices", "name", "email")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user_id': self.user.pk})
        return data


class CreateOneTimePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if User.objects.filter(email=attrs["email"]).exists():
            raise validators.ValidationError({"email": "Email already in use"})
        return attrs

    class Meta:
        fields = ("email",)


class SignUpSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField()
    password_repeat = serializers.CharField()

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if attrs["password"] != attrs["password_repeat"]:
            raise validators.ValidationError({"password": "Passwords does not match"})
        return attrs

    class Meta:
        fields = ("first_name", "last_name", "password", "password_repeat")
