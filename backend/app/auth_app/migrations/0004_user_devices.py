# Generated by Django 3.0.3 on 2020-03-20 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0010_remove_device_user'),
        ('auth_app', '0003_auto_20200315_2013'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='devices',
            field=models.ManyToManyField(related_name='users', to='tracking.Device'),
        ),
    ]
