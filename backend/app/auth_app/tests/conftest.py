import pytest
from ..factories import UserFactory


@pytest.fixture
def user():
    return UserFactory()
