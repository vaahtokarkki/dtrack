from django.utils import timezone
from datetime import timedelta
from .models import Location


def get_active_track(device):
    """
    Get active track for given device. That is all locations starting from now until
    defined distance between timestamps for two location points is found.
    Args:
        device (Device): Device to retrieve active track for
    Returns:
        list(Location): List of location objects
    """
    now = timezone.now()
    # TODO: Get this limit from user settings
    max_start_age = now - timedelta(hours=2400)
    locations = device.locations.order_by("-timestamp")

    if not locations or locations[0].timestamp < max_start_age:
        return []

    filtered_locations = []
    for index in range(len(locations) - 1):
        current = locations[index]
        next = locations[index + 1]
        diff = (current.timestamp - next.timestamp).total_seconds()

        # TODO: Get this limit from user settings
        if diff / 3600 > 2400:
            break

        filtered_locations.append(current.pk)
        if index + 1 == len(locations) - 1:
            filtered_locations.append(next.pk)
    return Location.objects.filter(pk__in=filtered_locations)
