from auth_app.factories import UserFactory
from auth_app.models import User


def test_user_details(test_client, user):
    resp = test_client.get(f"/api/user/{user.pk}/", authenticate_as=user)
    assert resp.data["first_name"] == user.first_name
    assert resp.data["last_name"] == user.last_name
    assert resp.data["email"] == user.email
    assert resp.data["devices"] == []


def test_user_details_no_access(test_client, user):
    resp = test_client.get(f"/api/user/{user.pk}/", authenticate_as=UserFactory())
    assert resp.status_code == 403


def test_update_user(test_client, user):
    data = {
        "first_name": "Jari",
        "last_name": "Sillanpää",
        "email": "should@not.change"
    }
    old_email = user.email
    resp = test_client.put(f"/api/user/{user.pk}/", data, authenticate_as=user)
    assert resp.status_code == 200

    user.refresh_from_db()
    assert user.first_name == "Jari"
    assert user.last_name == "Sillanpää"
    assert user.email == old_email


def test_delete_user(test_client, user):
    test_client.delete(f"/api/user/{user.pk}/", authenticate_as=user)
    assert not User.objects.exists()
