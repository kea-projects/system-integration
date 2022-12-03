# Use Bullseye since slim doesn't work due to issues with postgres connection
FROM python:3.10.7-bullseye

# Install poetry
RUN pip install poetry

WORKDIR /service

ENV PYTHONUNBUFFERED=1

# Required for psycog2 build
RUN apt-get update && apt-get install libpq-dev python-dev -y

COPY ./apps/user-service/poetry.lock /service/
COPY ./apps/user-service/pyproject.toml /service/

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY ./apps/user-service /service

ENTRYPOINT [ "python", "main.py" ]
