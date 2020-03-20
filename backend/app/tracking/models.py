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
    name = models.CharField(max_length=2000)

    @property
    def start(self):
        # TODO Get timestamp of first location in self.locations
        return None

    @property
    def end(self):
        # TODO Get timestamp of last location in self.locations
        return None


class Location(models.Model):
    point = models.PointField()
    speed = models.FloatField(null=True)
    timestamp = models.DateTimeField(auto_now=True)
    track = models.ForeignKey(Track, related_name='locations', on_delete=models.SET_NULL,
                              null=True)
    device = models.ForeignKey(Device, related_name='locations', on_delete=models.CASCADE)
