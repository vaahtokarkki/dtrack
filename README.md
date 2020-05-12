Full stack course project
[Tuntikirjanpito](./docs/workinghours.md) [Käyttöohjeet](./docs/userguide.md)

# Dog tracker

An app to track your dog with GPS-collar. Currently [TKSTAR TK-909](https://www.aliexpress.com/popular/tkstar-tk909.html) GPS-collar is supported. Background map on frontend is only in Finland. [Live demo](https://helka.dog)

[![Build Status](https://travis-ci.com/vaahtokarkki/dtrack.svg?branch=master)](https://travis-ci.com/vaahtokarkki/dtrack)

## Quick start
```bash
git clone https://github.com/vaahtokarkki/dtrack
cd dtrack/
```
See:
* [frontend](./frontend)
* [backend](./backend)
* [GPS-server](.tracker-server)

documentation before first run.

Note: You need to add SSL-certs for localhost, as Chrome blocks geolocation api if connect is not usig SSL. Generate certificates for local development for example with [mkcert](https://github.com/FiloSottile/mkcert). Save `.pem` files to `certs/` folder.

Build and start project with
```bash
docker-compose up --build -d
```

Now you should have frontend running on `https://localhost/` and backend on `https://localhost/api/`. GPS-server is not routed via [Traefik](https://docs.traefik.io), and it can be accessed directly with ip-address, by default on port 5001.

## Motivation

As there is couple of different dog tracking systems with topographic maps of Finland, I didn't feel comfortable with paying [lots of money](https://shop.tracker.fi/tr_fi/tracker-artemis.html) and monthly fees for such service. How hard it would be to implement simple tracking software with [cheap Chinese copies](https://www.aliexpress.com/popular/tkstar-tk909.html)?

## Implementation

Frontend is implemented with React and backend with [(Geo)Django](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/), topped with [DRF](https://www.django-rest-framework.org/) and [GeoJSON-extension](https://github.com/openwisp/django-rest-framework-gis) to handle spatial data. Database will be run with PostgreSQL and extended with [PostGIS](https://postgis.net/).

GPS-collar is sending data to a server (different from backend), which then forwards parsed location data to backend. This allows to create support for different devices and platforms. Frontend will be polling latest location from backend with regular interval. Backend also supports storing and serving old tracks, which can be then browsed on a map.

Whole stack will is running with Docker. Traefik reverse proxy is used to route requests to backend and frontend. SSL-certificate is generated from [Let's Encrypt](https://docs.traefik.io/https/acme/).
