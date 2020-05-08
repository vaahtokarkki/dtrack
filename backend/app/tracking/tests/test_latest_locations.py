from ..factories import LocationFactory


def test_latest_locations(test_client, user, device_l):
    latest_location = device_l.locations.latest("timestamp")
    new_locations = LocationFactory.create_batch(5, device=device_l)
    resp = test_client.post('/api/locations/latest/', [{
        "device": device_l.pk,
        "location": latest_location.pk
    }], authenticate_as=user)
    assert resp.status_code == 200

    assert len(resp.data) == 1
    returned_device = resp.data[0]
    assert len(returned_device["locations"]) == 5
    assert all(location["id"] in [new_location.pk for new_location in new_locations]
               for location in returned_device["locations"])


def test_all_latest_locations(test_client, user, devices):
    resp = test_client.post('/api/locations/latest/', authenticate_as=user)
    assert resp.status_code == 200
    assert len(resp.data) == len(devices)
    assert all(len(device["locations"]) == 10 for device in resp.data)


def test_latest_locations_invalid_device(test_client, user):
    resp = test_client.post('/api/locations/latest/', [{
        "device": -1,
        "location": -1
    }], authenticate_as=user)
    assert resp.status_code == 400


def test_latest_locations_invalid_location(test_client, user, device):
    resp = test_client.post('/api/locations/latest/', [{
        "device": device.pk,
        "location": -1
    }], authenticate_as=user)
    assert resp.status_code == 400
