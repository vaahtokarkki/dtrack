# Generated by Django 3.0.3 on 2020-03-18 07:45

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0008_device_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='point',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326),
        ),
    ]
