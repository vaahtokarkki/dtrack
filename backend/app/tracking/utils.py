import logging
from datetime import timedelta
from time import sleep

from celery.decorators import task
from celery.task.control import revoke
from django.contrib.gis.geos import LineString
from django.utils import timezone
from rest_framework.validators import ValidationError

from conf.celery import app as celery_app

from .models import Device, Location, Track


logger = logging.getLogger(__name__)

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
        return Location.objects.none()

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
    return Location.objects.filter(pk__in=filtered_locations, track=None) \
        .order_by("timestamp")


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

    track = Track.objects.create(track=LineString(points), device=device)
    Location.objects.filter(pk__in=locations.values_list("pk", flat=True)) \
        .update(track=track)
    return track


def queue_create_track(device_pk):
    """
    Add task to Celery for generationg track. If save track task with given arguments
    alredy running, revoke and setup new task to reset the timer on task.
    Args:
        device_pk (int): Primary key of device to create track for
    """
    revoke_track_queue(device_pk)
    save_track.apply_async(args=(device_pk,))


def validate_latest_locations_data(data):
    """
    Validate data used to filter latest locations for devices. That is, data should be an
    empty list, or list containing valid {'device': device.pk, 'location': location.pk}
    objects. If data is not valid, raise a ValidationError.
    Args:
        data: List containing objects
    Returns:
        Validated data. If not valid, raises a ValidationError
    """

    for row in data:
        try:
            assert Device.objects.filter(pk=row["device"]).exists()
            assert Location.objects.filter(pk=row["location"]).exists()
            assert row["location"] in Device.objects.get(pk=row["device"]).locations \
                .values_list("pk", flat=True)
        except (AssertionError, Device.DoesNotExist, Location.DoesNotExist):
            raise ValidationError(f"Given device or location not found")
    return data


def revoke_track_queue(device_pk):
    active_tasks = celery_app.control.inspect().active()
    if not active_tasks:
        return
    for queue, tasks in active_tasks.items():
        for active_task in tasks:
            if active_task["name"] == "save_track" and active_task["args"] == [device_pk]:
                revoke(active_task["id"], terminate=True)


@task(name="save_track")
def save_track(device_pk):
    sleep(TRACK_MAX_AGE * 60 * 60 + 60)
    device = Device.objects.get(pk=device_pk)
    print(f"Creating track for {device}")
    create_track(device)
