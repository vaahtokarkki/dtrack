from django.db import models


class Device(models.Model):
    name = models.CharField(max_length=500)


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
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    speed = models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)
    track = models.ForeignKey(Track, related_name='locations', on_delete=models.SET_NULL,
                              null=True)
    device = models.ForeignKey(Device, related_name='locations', on_delete=models.CASCADE)
