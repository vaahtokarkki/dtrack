from django.contrib.gis.db import models

from auth_app.models import User


class Device(models.Model):
    name = models.CharField(max_length=500)
    tracker_id = models.CharField(max_length=500, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='devices',
                             null=True)

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
    point = models.PointField(null=True)
    speed = models.FloatField(null=True)
    timestamp = models.DateTimeField(auto_now=True)
    track = models.ForeignKey(Track, related_name='locations', on_delete=models.SET_NULL,
                              null=True)
    device = models.ForeignKey(Device, related_name='locations', on_delete=models.CASCADE)
