from django.contrib.gis.db import models


class Device(models.Model):
    name = models.CharField(max_length=500)
    tracker_id = models.CharField(max_length=500, unique=True)

    @property
    def last_seen(self):
        return self.locations.latest('timestamp').timestamp

    def __str__(self):
        return self.name


class Track(models.Model):
    track = models.LineStringField(null=True)
    created = models.DateTimeField(auto_now=True)
    device = models.ForeignKey(Device, related_name='tracks', on_delete=models.CASCADE)

    @property
    def start(self):
        try:
            return self.locations.earliest('timestamp').timestamp
        except Location.DoesNotExist:
            return None

    @property
    def end(self):
        try:
            return self.locations.latest('timestamp').timestamp
        except Location.DoesNotExist:
            return None

    @property
    def length(self):
        self.track.srid = 4326
        self.track.transform(3857)
        return self.track.length


class Location(models.Model):
    point = models.PointField()
    speed = models.FloatField(null=True)
    timestamp = models.DateTimeField(auto_now=True)
    track = models.ForeignKey(Track, related_name='locations', on_delete=models.SET_NULL,
                              null=True)
    device = models.ForeignKey(Device, related_name='locations', on_delete=models.CASCADE)
