import pytest

from ..factories import DeviceFactory, LocationFactory


@pytest.fixture
def device(user):
    device = DeviceFactory()
    user.devices.add(device)
    return device


@pytest.fixture
def devices(user):
    devices = DeviceFactory.create_batch(5)
    user.devices.set(devices)
    for device in devices:
        LocationFactory.create_batch(10, device=device)
    return devices


@pytest.fixture
def device_l(device):
    LocationFactory.create_batch(10, device=device)
    return device
