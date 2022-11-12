FROM python:alpine

# Install poetry
RUN pip install poetry

WORKDIR /service


COPY ./apps/user-service/poetry.lock /service/
COPY ./apps/user-service/pyproject.toml /service/

RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

COPY ./apps/user-service /code



