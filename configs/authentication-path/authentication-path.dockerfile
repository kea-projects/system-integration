FROM python:3.10.7-slim
# Install poetry
RUN pip install poetry

WORKDIR /service

COPY ./apps/authentication-path/poetry.lock /service
COPY ./apps/authentication-path/pyproject.toml /service

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY ./apps/authentication-path /service

ENTRYPOINT [ "python", "main.py" ]
