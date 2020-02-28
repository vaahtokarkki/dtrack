Full stack course project [Tuntikirjanpito](./docs/workinghours.md)

# Dog tracker

An app to track your dog with GPS-collar. Currently works only in Finland.

## Motivation

As there is couple of different dog tracking systems with topographic maps of Finland, I didn't feel comfortable with paying [lots of money](https://shop.tracker.fi/tr_fi/tracker-artemis.html) and monthly fees for such service. How hard it would be to implement simple tracking software with [cheap Chinese copies](https://www.aliexpress.com/popular/tkstar-tk909.html)? Let's see!

## Implementation

Frontend is implemented with React and backend with [(Geo)Django](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/), topped with [DRF](https://www.django-rest-framework.org/) and [GeoJSON-extension](https://github.com/openwisp/django-rest-framework-gis) to handle spatial data. Database will be run with PostgreSQL and extended with [PostGIS](https://postgis.net/).

GPS-collar will be sending data to a server (different from backend), which then puts location data to backend. This allows to create support for different devices and platforms. Frontend will be polling latest location from backend with regular interval. Backend also supports storing and serving old tracks, which can be then browsed on a map.

Whole stack will be run with Docker and docker-compose. Nginx needs to be configured as reverse proxy to serve frontend and backend as well the server for GPS-tracker from a single url without specifying port.
