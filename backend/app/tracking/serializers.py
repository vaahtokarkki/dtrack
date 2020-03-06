from rest_framework import serializers

from .models import Device, Location


class SimpleLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        geo_field = "point"
        fields = ['id', 'speed', 'timestamp', 'point']


class DeviceSerializer(serializers.ModelSerializer):
    locations = SimpleLocationSerializer(many=True)

    class Meta:
        model = Device
        fields = ['id', 'name', 'locations']


class DeviceTrackSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()

    def get_locations(self, instance):
        locations = instance.locations
        for row in self.context["data"]:
            if row["device"] == instance.pk:
                latest_location = Location.objects.get(pk=row["location"])
                locations = locations.filter(timestamp__gt=latest_location.timestamp)
        return SimpleLocationSerializer(locations, many=True).data

    class Meta:
        model = Device
        fields = ['id', 'name', 'locations']


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
