from rest_framework.views import exception_handler
from sentry_sdk import capture_message


def sentry_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        if response.status_code == 400:
            capture_message("Bad Request", level="error")
    return response
