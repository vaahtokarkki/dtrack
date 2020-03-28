# Generated by Django 3.0.3 on 2020-03-28 12:49

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0005_user_refresh_interval'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='refresh_interval',
            field=models.PositiveIntegerField(default=60, validators=[django.core.validators.MinValueValidator(10), django.core.validators.MaxValueValidator(300)]),
        ),
    ]
