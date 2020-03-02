from rest_framework import serializers

from .models import Device, Location


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name']


class LocationSerializer(serializers.ModelSerializer):
    device = DeviceSerializer()

    class Meta:
        model = Location
        fields = ['id', 'latitude', 'longitude', 'speed', 'timestamp', 'device']


class LocationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude', 'speed', 'device']
