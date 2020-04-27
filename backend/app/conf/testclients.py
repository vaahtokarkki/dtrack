from django.test import Client
from rest_framework_simplejwt.tokens import AccessToken


class ApiTestClient(Client):
    def generic(self, method, path, data="", content_type='application/octet-stream',
                secure=False, **extra):
        user = extra.pop("authenticate_as", None)
        if user:
            extra["HTTP_AUTHORIZATION"] = "Bearer " + \
                str(AccessToken.for_user(user))

        print("kljfdlkdjf", extra, user)
        return super().generic(method, path, data, content_type, secure=secure, **extra)
