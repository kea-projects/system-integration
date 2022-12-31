# Use Bullseye since slim doesn't work due to issues with postgres connection
FROM cytopia/mypy:latest-py3.10

# Required for psycog2 build 
RUN apk add libpq-dev python3-dev gcc py3-pip py-configobj libusb linux-headers musl-dev

# Install poetry
RUN pip install poetry

WORKDIR /service

ENV PYTHONUNBUFFERED=1

COPY ./apps/user-service/poetry.lock /service/
COPY ./apps/user-service/pyproject.toml /service/

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY ./apps/user-service /service

ENTRYPOINT [ "python", "main.py" ]
