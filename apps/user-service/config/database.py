from playhouse.postgres_ext import PostgresqlExtDatabase

DB_CONNECTION = PostgresqlExtDatabase(
    "postgres-db", user="postgres-user", password="postgres-pass", host="localhost", port=5432
)

