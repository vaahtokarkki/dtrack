from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import UserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from tracking.models import Device

from .utils import email_user_created


class CustomUserManager(UserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_unverified_user(self, email):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, is_active=False)
        user.set_unusable_password()
        user.save(using=self._db)
        email_user_created(user)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(blank=True, unique=True)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)
    devices = models.ManyToManyField(Device, related_name='users')
    refresh_interval = models.PositiveIntegerField(
        default=60, validators=[MinValueValidator(10), MaxValueValidator(300)]
    )
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'

    USERNAME_FIELD = 'email'
