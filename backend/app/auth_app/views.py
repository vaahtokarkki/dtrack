import json

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import generics, status, validators
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .permissions import CanAccessUser
from .serializers import CreateOneTimePasswordSerializer, MyTokenObtainPairSerializer, \
    SignUpSerializer, UserSerializer


class UserDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (CanAccessUser,)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CreateOneTimePasswordView(generics.GenericAPIView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = CreateOneTimePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        User.objects.create_unverified_user(serializer.data["email"])
        return Response(status=status.HTTP_201_CREATED)


class SignUpView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = ()
    authentication_classes = ()

    def get_object(self):
        user = super().get_object()
        if self.request.method == "POST":
            body_unicode = self.request.body.decode('utf-8')
            token = json.loads(body_unicode).get("token", None)
        else:
            token = self.request.query_params.get("token", None)

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise validators.ValidationError("Invalid one time password")
        return user

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.data)
        data["is_active"] = True

        password = data.pop("password")
        del data["password_repeat"]
        user.set_password(password)
        user.save()
        User.objects.filter(pk=user.pk).update(**data)

        return Response(status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        """ Verify the opt. If valid, the email of user is returned """
        user = self.get_object()
        return Response(data={"email": user.email}, status=status.HTTP_200_OK)
