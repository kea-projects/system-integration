FROM cytopia/mypy:latest-py3.10
# Install poetry
RUN apk add py3-pip

RUN pip install poetry

WORKDIR /service

ENV PYTHONUNBUFFERED=1

COPY ./apps/authentication-path/poetry.lock /service
COPY ./apps/authentication-path/pyproject.toml /service

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY ./apps/authentication-path /service

ENTRYPOINT [ "python", "main.py" ]
