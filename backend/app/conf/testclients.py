from django.test import Client
from django.views import View
from rest_framework_simplejwt.tokens import AccessToken


class ApiTestClient(Client):
    def generic(self, method, path, data="", content_type='application/octet-stream',
                secure=False, **extra):
        user = extra.pop("authenticate_as", None)
        if user:
            extra["HTTP_AUTHORIZATION"] = "Bearer " + \
                str(AccessToken.for_user(user))

        return super().generic(method, path, data, content_type, secure=secure, **extra)


def json_content(func):
    def decorate(self, *args, **kwargs):
        kwargs.setdefault("content_type", "application/json")
        return func(self, *args, **kwargs)

    return decorate


for method in View.http_method_names:
    setattr(ApiTestClient, method, json_content(getattr(ApiTestClient, method)))
