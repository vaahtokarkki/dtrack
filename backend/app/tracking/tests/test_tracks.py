import pytest
from django.contrib.gis.geos import LineString

from ..models import Location, Track


@pytest.fixture
def track(device_l):
    points = [location.point for location in device_l.locations.all()]
    track = Track.objects.create(track=LineString(points), device=device_l)
    Location.objects.filter(pk__in=device_l.locations.values_list("pk", flat=True)) \
        .update(track=track)
    return track


def test_list_tracks(test_client, user, track, device_l):
    resp = test_client.get("/api/tracks/", authenticate_as=user)
    assert resp.status_code == 200

    assert len(resp.data) == 1
    returned_track = resp.data[0]
    assert returned_track["start"] == device_l.locations.earliest("timestamp").timestamp
    assert returned_track["end"] == device_l.locations.latest("timestamp").timestamp
    assert len(returned_track["track"]["coordinates"]) == device_l.locations.count()
    assert returned_track["device"]["id"] == device_l.pk


def test_list_tracks_unauthenticated(test_client):
    resp = test_client.get("/api/tracks/")
    assert resp.status_code == 401


def test_create_track(test_client, device_l, user):
    resp = test_client.post(f'/api/devices/{device_l.pk}/track/', authenticate_as=user)
    assert resp.status_code == 201

    assert Track.objects.count() == 1
    track = Track.objects.get()
    assert track.start == device_l.locations.earliest("timestamp").timestamp
    assert track.end == device_l.locations.latest("timestamp").timestamp
    assert track.track.equals(LineString(
        [location.point for location in device_l.locations.all()]
    ))
    assert track.device == device_l


def test_create_track_unauthenticated(test_client, device_l):
    resp = test_client.post(f'/api/devices/{device_l.pk}/track/')
    assert resp.status_code == 401
