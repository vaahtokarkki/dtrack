import pytest

from auth_app.factories import UserFactory
from conf.testclients import ApiTestClient


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass


@pytest.fixture
def test_client():
    return ApiTestClient()


@pytest.fixture
def user():
    return UserFactory()
