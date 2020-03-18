from rest_framework.views import exception_handler
from raven.contrib.django.raven_compat.models import client


def sentry_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        client.captureException()
    return response
