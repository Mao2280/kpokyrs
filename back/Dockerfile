# ------------------------------------------------------------------------------
FROM python:3.12.4-alpine3.20 AS dev
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN --mount=type=cache,target=/root/.cache/apk \
    apk update && apk upgrade && \
    # base dependencies
    apk add curl gcc musl-dev python3-dev linux-headers git

# app dependencies
RUN mkdir /code
WORKDIR /code
COPY ./requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip install -r requirements.txt
