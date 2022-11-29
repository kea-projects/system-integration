from playhouse.postgres_ext import PostgresqlExtDatabase
from config.secrets import get_env

DB_CONNECTION = PostgresqlExtDatabase(
    get_env("POSTGRES_DB"), user=get_env("POSTGRES_USER"), password=get_env("POSTGRES_PASSWORD"), host=get_env("POSTGRES_HOST"), port=get_env("POSTGRES_PORT")
)

