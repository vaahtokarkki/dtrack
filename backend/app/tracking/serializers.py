from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Device, Location


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name']


class LocationSerializer(serializers.ModelSerializer):
    device = DeviceSerializer()

    class Meta:
        model = Location
        geo_field = "point"
        fields = ['id', 'speed', 'timestamp', 'device', 'point']


class LocationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        geo_field = "point"
        fields = ['speed', 'device', 'point']
