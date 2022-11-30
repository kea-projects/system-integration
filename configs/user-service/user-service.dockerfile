# Use Bullseye since slim doesn't work due to issues with postgres connection
FROM python:3.10.7-bullseye

# Install poetry
RUN pip install poetry

WORKDIR /service

ENV PYTHONUNBUFFERED=1

COPY ./apps/user-service/poetry.lock /service/
COPY ./apps/user-service/pyproject.toml /service/

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root
# Install a different postgres library to make user service work on Mac. Has to be done after the other installs
RUN pip install psycopg2==2.9.3

COPY ./apps/user-service /service

ENTRYPOINT [ "python", "main.py" ]
