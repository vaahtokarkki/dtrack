from ..factories import DeviceFactory
from ..models import Location


def test_list_devices(test_client, user, device):
    resp = test_client.get('/api/devices/', authenticate_as=user)
    assert resp.status_code == 200

    assert len(resp.data) == 1


def test_device_details(test_client, user, device):
    resp = test_client.get(f'/api/devices/{device.pk}/', authenticate_as=user)
    assert resp.status_code == 200
    returned_device = resp.data
    assert returned_device["name"] == device.name
    assert returned_device["tracker_id"] == device.tracker_id
    assert returned_device["tracker_id"] == device.tracker_id
    assert not returned_device["locations"]
    assert not returned_device["last_seen"]


def test_device_details_with_locations(test_client, user, device_l):
    resp = test_client.get(f'/api/devices/{device_l.pk}/', authenticate_as=user)
    assert resp.status_code == 200
    returned_device = resp.data
    assert returned_device["name"] == device_l.name
    assert returned_device["tracker_id"] == device_l.tracker_id
    assert returned_device["tracker_id"] == device_l.tracker_id

    locations = Location.objects.all()
    assert len(returned_device["locations"]) == len(locations)
    assert returned_device["last_seen"] == locations.latest("timestamp").timestamp


def test_device_details_not_own_device(test_client, user):
    resp = test_client.get(f'/api/devices/{DeviceFactory().pk}/', authenticate_as=user)
    assert resp.status_code == 403


def test_device_details_unauhtorized(test_client, user, device):
    resp = test_client.get(f'/api/devices/{device.pk}/')
    assert resp.status_code == 401


def test_add_device_for_user(test_client, user):
    device_to_add = DeviceFactory()
    resp = test_client.post('/api/devices/', {"tracker_id": device_to_add.tracker_id},
                            authenticate_as=user)
    print(resp.data)
    assert resp.status_code == 201
    assert user.devices.count() == 1
