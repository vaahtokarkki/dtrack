from django.contrib.gis.geos import Point

from ..models import Location


def test_create_location(test_client, device):
    resp = test_client.post('/api/locations/', {
        'api_key': "testkey123",
        'device': device.pk,
        'point': 'POINT(60.1234 25.1234)',
        'speed': 1.23
    })
    assert resp.status_code == 201

    location = Location.objects.get()
    assert location.device == device
    assert location.speed == 1.23
    assert location.point.equals(Point(60.1234, 25.1234))


def test_create_location_no_api_key(test_client, device):
    resp = test_client.post('/api/locations/', {
        'device': device.pk,
        'point': 'POINT(60.1234 25.1234)',
        'speed': 1.23
    })
    assert resp.status_code == 401
    assert Location.objects.count() == 0


def test_create_location_with_tracker_id(test_client, device):
    resp = test_client.post('/api/locations/', {
        'api_key': "testkey123",
        'tracker_id': device.tracker_id,
        'point': 'POINT(60.1234 25.1234)',
        'speed': 1.23
    })
    assert resp.status_code == 201

    location = Location.objects.get()
    assert location.device == device
    assert location.speed == 1.23
    assert location.point.equals(Point(60.1234, 25.1234))


def test_create_location_with_invalied_tracker_id(test_client, device):
    resp = test_client.post('/api/locations/', {
        'api_key': "testkey123",
        'tracker_id': "not a valid tracker id",
        'point': 'POINT(60.1234 25.1234)',
        'speed': 1.23
    })
    assert resp.status_code == 400
    assert not Location.objects.exists()


def test_create_location_with_no_tracker(test_client):
    resp = test_client.post('/api/locations/', {
        'api_key': "testkey123",
        'point': 'POINT(60.1234 25.1234)',
        'speed': 1.23
    })
    assert resp.status_code == 400
    assert not Location.objects.exists()
