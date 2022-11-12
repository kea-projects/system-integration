# https://docs.peewee-orm.com/en/latest/peewee/database.html
from peewee import PostgresqlDatabase

pg_db = PostgresqlDatabase('my_app', user='postgres', password='secret',
                           host='10.1.0.9', port=5432)