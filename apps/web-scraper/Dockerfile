FROM python:alpine

RUN pip install poetry

WORKDIR /service

ENV PYTHONUNBUFFERED=1

COPY ./ /service

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

ENTRYPOINT [ "python", "main.py" ]
