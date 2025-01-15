# -----------------------------------------------------------------------------
FROM node:22.5-alpine3.20 AS dev

RUN --mount=type=cache,target=/root/.cache/apk \
    apk update && apk upgrade && \
    # base dependencies
    apk add curl gcc git

RUN mkdir /code
WORKDIR /code
