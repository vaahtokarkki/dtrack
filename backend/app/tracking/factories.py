import random

import factory
from django.contrib.gis.geos import Point
from factory.fuzzy import BaseFuzzyAttribute

from .models import Device, Location


class FuzzyPoint(BaseFuzzyAttribute):
    def fuzz(self):
        return Point(random.uniform(60.0, 64.0),
                     random.uniform(23.0, 27.0))


class DeviceFactory(factory.django.DjangoModelFactory):
    name = factory.Faker('word')
    tracker_id = factory.Faker('md5')

    class Meta:
        model = Device


class LocationFactory(factory.django.DjangoModelFactory):
    point = FuzzyPoint()
    speed = factory.fuzzy.FuzzyFloat(0, 15.0)

    class Meta:
        model = Location
