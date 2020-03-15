from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import UserManager


class User(AbstractBaseUser):
    email = models.EmailField(blank=True)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)

    objects = UserManager()

    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'

    USERNAME_FIELD = 'email'
