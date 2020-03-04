FROM python:3.7.4-slim-buster
ENV PYTHONUNBUFFERED 1
WORKDIR /code

COPY app/requirements.txt .
RUN apt-get update \
	&& apt-get install -y binutils libproj-dev gdal-bin \
	&& pip install --upgrade pip \
	&& pip install -r requirements.txt
COPY . .