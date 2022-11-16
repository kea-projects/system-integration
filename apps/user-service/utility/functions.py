from typing import Any
from playhouse.postgres_ext import PostgresqlExtDatabase
from peewee import Model
import re

import config.secrets as secrets


def initialize_db(db_connection: PostgresqlExtDatabase, models: list[Model]):
    print("Initializing DB!")

    db_connection.connect()
    # db_connection.drop_tables(models)

    db_connection.create_tables(models)
    print("DB initialized!")


def is_valid_email(email: str) -> bool:
    """Compare the passed `email` with the default HTML regex for email and return `True` if it is a match or `False` if it is not"""
    email_regex = "^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
    if re.search(email_regex, email):
        return True
    else:
        return False


import bcrypt

class Password:
    
    @staticmethod
    def hash(password: str) -> str:
        """Hash a password using the PASSWORD_SALT environment variable and return it as a UTF-8 string"""
        password_bytes = password.encode("utf-8")
        hashed_password = bcrypt.hashpw(password=password_bytes, salt=secrets.PASSWORD_SALT)

        return hashed_password.decode("utf-8")

    @staticmethod
    def is_match(password: str, hashed_password: str) -> bool:
        is_valid = bcrypt.checkpw(
            password=password.encode("utf-8"),
            hashed_password=hashed_password.encode("utf-8"),
        )
        return is_valid
