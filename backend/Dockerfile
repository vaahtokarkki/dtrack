FROM python:3.7.4-slim-buster
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN apt-get update \
	&& pip install --upgrade pip \
	&& pip install --no-use-pep517 --no-cache-dir -r requirements.txt \
COPY . .