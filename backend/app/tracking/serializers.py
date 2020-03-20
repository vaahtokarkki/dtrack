from rest_framework import serializers

from .models import Device, Location, Track
from .utils import get_track


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        geo_field = "point"
        fields = ['id', 'speed', 'timestamp', 'point']


class DeviceSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()

    def get_locations(self, instance):
        return LocationSerializer(get_track(instance), many=True).data

    class Meta:
        model = Device
        fields = ['id', 'name', 'locations', 'tracker_id', 'last_seen']
        extra_kwargs = {
            'locations': {'required': False},
            'last_seen': {'required': False}
        }


class SimpleDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name', 'tracker_id', 'last_seen']


class DeviceTrackSerializer(serializers.ModelSerializer):
    locations = serializers.SerializerMethodField()

    def get_locations(self, instance):
        locations = get_track(instance)
        for row in self.context["data"]:
            if row["device"] == instance.pk:
                latest_location = Location.objects.get(pk=row["location"])
                locations = locations.filter(timestamp__gt=latest_location.timestamp)
        return LocationSerializer(locations, many=True).data

    class Meta:
        model = Device
        fields = ['id', 'name', 'locations', 'tracker_id', 'last_seen']


class LocationCreateSerializer(serializers.ModelSerializer):
    tracker_id = serializers.CharField(required=False)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if "device" not in attrs and "tracker_id" not in attrs:
            raise serializers.ValidationError("Device or tracker id is required")
        return attrs

    def validate_tracker_id(self, value):
        try:
            return Device.objects.get(tracker_id=value)
        except (ValueError, Device.DoesNotExist):
            raise serializers.ValidationError("Inavalid tracker id")
        return value

    def create(self, validated_data):
        if "tracker_id" in validated_data:
            validated_data["device"] = validated_data.pop("tracker_id")
        return super().create(validated_data)

    class Meta:
        model = Location
        geo_field = "point"
        fields = ['speed', 'device', 'point', 'tracker_id']
        extra_kwargs = {'device': {'required': False}}


class TrackSerializer(serializers.ModelSerializer):
    device = SimpleDeviceSerializer()

    class Meta:
        model = Track
        geo_field = "track"
        fields = ['id', 'start', 'end', 'length', 'track', 'device']
