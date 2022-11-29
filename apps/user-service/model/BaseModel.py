from peewee import Model
from config.database import DB_CONNECTION


class BaseModel(Model):
    class Meta:
        database = DB_CONNECTION
