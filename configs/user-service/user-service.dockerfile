FROM python:alpine

# Install poetry
RUN pip install poetry

WORKDIR /service


COPY ./apps/user-service/poetry.lock /service/
COPY ./apps/user-service/pyproject.toml /service/

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY ./apps/user-service /service

entrypoint [ "python", "main.py" ]
