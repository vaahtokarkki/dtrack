# Generated by Django 3.0.3 on 2020-03-02 14:20

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0005_auto_20200302_1408'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='point',
            field=django.contrib.gis.db.models.fields.PointField(null=True, srid=4326),
        ),
    ]
