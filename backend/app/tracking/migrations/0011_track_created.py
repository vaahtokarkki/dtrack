# Generated by Django 3.0.3 on 2020-03-19 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0010_auto_20200318_1650'),
    ]

    operations = [
        migrations.AddField(
            model_name='track',
            name='created',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
