from urllib import parse

from django.core import mail

from auth_app.models import User


def test_generate_token(test_client):
    resp = test_client.post('/api/user/signup/', {"email": "testuser@example.com"})
    assert resp.status_code == 201

    assert User.objects.count() == 1
    user = User.objects.get()
    assert user.email == "testuser@example.com"
    assert not user.is_active

    assert len(mail.outbox) == 1
    assert mail.outbox[0].to == ['testuser@example.com']


def test_signup_email_already_in_use(test_client, user):
    resp = test_client.post('/api/user/signup/', {"email": user.email})
    assert resp.status_code == 400

    assert User.objects.count() == 1
    assert len(mail.outbox) == 0


def test_validate_token(test_client):
    test_client.post(f'/api/user/signup/', {"email": "testuser@example.com"})
    url = mail.outbox[0].body.splitlines()[-1]
    token = url.split("token=")[-1]
    user = User.objects.get()

    resp = test_client.get(f"/api/user/{user.pk}/token/?token={token}")
    assert resp.status_code == 200
    assert resp.data["email"] == "testuser@example.com"


def test_update_user_details(test_client):
    test_client.post(f'/api/user/signup/', {"email": "testuser@example.com"})
    url = mail.outbox[0].body.splitlines()[-1]
    params = dict(parse.parse_qsl(parse.urlsplit(url).query))

    token = params["token"]
    user = User.objects.get()

    resp = test_client.post(f"/api/user/{user.pk}/token/", {
        "token": token,
        "first_name": "Test",
        "last_name": "User",
        "password": "abracadabra123",
        "password_repeat": "abracadabra123"
    })
    assert resp.status_code == 201

    user.refresh_from_db()
    assert user.first_name == "Test"
    assert user.last_name == "User"
    assert user.check_password("abracadabra123")
