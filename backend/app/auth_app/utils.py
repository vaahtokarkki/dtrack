import logging

from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .tasks import send_email_task


logger = logging.getLogger(__name__)


def email_user_created(user):
    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(user)
    host = "helka.dog" if not settings.DEBUG else "localhost"
    url = f'https://{host}/signup/?token={token}&user={user.pk}'

    subject = "Sign up confirmation for your account in helka.dog"
    body = "Hello,\nyou can finish your registration by visiting the url bellow. You " + \
        f"can then fill in your personal details and password.\n\n{url}"
    logger.info(f'Sending email to {user.email}, body: {body}')
    # TODO: Apply async

    send_email_task.apply(args=(user.email, subject, body))
