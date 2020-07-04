from celery.decorators import task
from django.conf import settings
from django.core.mail import send_mail


@task(name="send_email")
def send_email_task(recipient, subject, body):
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [recipient])
