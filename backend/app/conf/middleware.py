from raven.contrib.django.raven_compat.models import client
from rest_framework.views import exception_handler


def sentry_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response:
        client.captureException()
    return response
