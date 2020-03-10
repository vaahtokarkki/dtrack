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
        fields = ['id', 'name', 'locations', 'tracker_id']


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
        fields = ['id', 'name', 'locations', 'tracker_id']


class LocationCreateSerializer(serializers.ModelSerializer):
    tracker_id = serializers.CharField(required=False)

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
