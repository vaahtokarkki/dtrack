# Dog tracker backend

Here is located the backend for Dog Tracker. Built with Django, GeoDjango and Django REST Framework.

## How it works

## Installation
Currently backend can be run only with provided docker-compose.

On first time create configuration:

Rename `.env.example` to `.env` and insert your django secrect and allowed hosts to environment variables. On production and stage you might want to enable [Sentry](sentry.io/), add `SENTRY_DSN` key with your key.

Run in project root directory to start necessary services:
```bash
docker-compose up --build
```

On first run an empty PostgeSQL database is created, you need to run migrations and create some users and tracker devices:
```bash
# Run migrations
docker-compose exec backend python manage.py migrate
# Create a user and a device  (you need the tracker id)
docker-compose exec backend python manage.py create_user
docker-compose exec backend python manage.py create_device
```

Now you should have running a backend on `https://localhost/api/`

You can add the created device for your user when logged in with browser on `https://localhost`.

### Tests and code style

Backend unit tests are implemented with pytest, using [factory_boy](https://factoryboy.readthedocs.io/en/latest/). You can run tests with
```
docker-compose exec backend pytest
```

This repo is shipped with [flake8](https://flake8.pycqa.org/en/latest/) code style guide, and [isort](https://github.com/timothycrosley/isort) utility to sort imports. You can run these with:
```
docker-compose exec backend isort
docker-compose exec backend flake8
```
## Authentication
This api uses JSON Web Token authentication, which is implemented by [Simple JWT](https://github.com/SimpleJWT/django-rest-framework-simplejwt). All endpoints (excep creation of location) needs an access token sent on `Authorazion` header. You can retrieve the access and refresh token by sending valid username and password to `/api/token/`.

Access token is valid for five minutes. You can retrieve a new access token by sending `{refresh: refreshToken}` to endpoint `/api/token/refresh/`. Refresh token is valid for seven days.

## Endpoints

### Auth app
* `GET /api/user/<int:pk>/` - Get user details
* `PUT /api/user/<int:pk>/`
    * Modify user details, only `first_name`,`last_name` and `refresh_interval` can be modified.
* `DELETE /api/user/<int:pk>/` - Delete the user
* `POST /api/token/`
    * Retrieve access and refresh tokens, body should contain `username` and `password`
* `POST /api/token/refresh/`
    * Retrieve new access token, body should contain `refresh` with a valid refresh token

### Tracking app
* `POST /api/locations/latest/`
    * When no params, return full active track for all devices
    * Accepts params as `[{device: <device.pk>, id: <location.pk>}, {...}]`. When params given, return only all locations newer than given id of location for all devices listed.
* `POST /api/locations/`
    * Used to create a location. Body should contain `tracker_id` or pk of a device, and `point, speed`. Point is expected in [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry#Geometric_objects).
* `GET /api/devices/` - List all devices
* `POST /api/devices/`
    * Add a device for user authenticated on the request. Body must include `tracker_id`.
* `GET /api/devices/<int:pk>/` - Get details of a device
* `PUT /api/devices/<int:pk>/` - Modify details of a device (only name can be modified)
* `DELETE /api/devices/<int:pk>/` - Remove the device
* `POST /api/devices/<int:pk>/track/`
    * Save currently active track as a `Track` instance. After this only new locations are returned on latest location (live track) endpoint.
* `GET /api/tracks/` - List all tracks
* `DELETE /api/tracks/<int:pk>/` - Delete the track


## Models and apps
This Django project contains two apps: `auth_app` and `tracking`.

### auth_app
This app contains the `User` model, which represents user and is used in authentication. Email is used as username on authentication. Model contains devices added for user and some user specific settings.

### tracking
This app contains models: `Device`, `Location` and `Track`. This app is used to manage devices  and saved locations.
* `Device` model represents a tracker. Model defines a name and a tracker id
* `Location` model represents a single location of tracker. An instance is related to one device, and defines fields: point, ([PointField](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/geos/#django.contrib.gis.geos.Point)), time stamp and speed. Location may be attached also to one track instance.
* `Track` model represents a collection of locations of one device. Model defines fields track ([LineString](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/geos/#linestring)), created time stamp. **Note: A track for device is crated automatically after one hour (by default) of last new location**.

## Built with

* [Django](https://www.djangoproject.com/)
* [REST Framework](https://www.django-rest-framework.org/), with [GIS extensions](https://github.com/openwisp/django-rest-framework-gis)
* [Celery](http://www.celeryproject.org/), with [Redis](https://redis.io/)
* [Simple JWT](https://github.com/SimpleJWT/django-rest-framework-simplejwt)