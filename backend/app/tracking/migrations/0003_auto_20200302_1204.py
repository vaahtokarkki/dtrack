# Generated by Django 3.0.3 on 2020-03-02 12:04

from django.contrib.postgres.operations import CreateExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0001_initial'),
    ]

    operations = [
        CreateExtension('postgis'),
    ]
