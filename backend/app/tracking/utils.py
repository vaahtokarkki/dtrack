from django.utils import timezone
from django.contrib.gis.geos import LineString
from datetime import timedelta
from .models import Location, Track


TRACK_MAX_AGE = 1  # Time after device goes offline from latest location


def get_track(device, active=True):
    """
    Get active track for given device. That is all locations starting from now until
    defined distance between timestamps for two location points is found.
    Args:
        device (Device): Device to retrieve active track for
        active (Boolean): Return track only if it is currently active
    Returns:
        list(Location): List of location objects
    """
    now = timezone.now()
    # TODO: Get this limit from user settings
    max_start_age = now - timedelta(hours=TRACK_MAX_AGE)
    locations = device.locations.order_by("-timestamp")

    if not locations or locations[0].timestamp < max_start_age and active:
        return []

    filtered_locations = []
    for index in range(len(locations) - 1):
        current = locations[index]
        next = locations[index + 1]
        diff = (current.timestamp - next.timestamp).total_seconds()

        # TODO: Get this limit from user settings
        if diff / 3600 > TRACK_MAX_AGE:
            break

        filtered_locations.append(current.pk)
        if index + 1 == len(locations) - 1:
            filtered_locations.append(next.pk)
    return Location.objects.filter(pk__in=filtered_locations)


def create_track(device):
    """
    Return a new Track instance with locations of active track (see get_track
    method) for given device. Freshly created track instance is updated to all Location
    objects as fk.
    Args:
        device (Device): Device to create track for
    Returns:
        Track: New Track instance
    """
    locations = get_track(device, active=False)
    points = [location.point for location in locations]

    track = Track.objects.create(track=LineString(points))
    Location.objects.filter(pk__in=locations.values_list("pk", flat=True)) \
        .update(track=track)
    return track
