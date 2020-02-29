FROM python:3.7.4-slim-buster
WORKDIR /code/app

COPY requirements.txt .

RUN apt-get update \
#	&& apt-get -y install asdf \
	&& pip install --no-use-pep517 --no-cache-dir -r requirements.txt

COPY . .

ENV DJANGO_SETTINGS_MODULE conf.settings