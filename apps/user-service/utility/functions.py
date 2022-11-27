from playhouse.postgres_ext import PostgresqlExtDatabase
from peewee import Model, OperationalError
from utility.result import Err, Ok
import re
from typing import TypeVar

from config.secrets import get_env

# Generic type of Model and all it's subtypes
M = TypeVar("M", bound=type(Model))


def initialize_db(
    db_connection: PostgresqlExtDatabase, models: list[M], delete_schema: bool = False
) -> Err[OperationalError] | Ok[str]:
    print("Initializing DB ...")

    try:
        db_connection.connect()
    except OperationalError as error:
        return Err("OperationalError", error)

    if delete_schema is True:
        db_connection.drop_tables(models)

    db_connection.create_tables(models)

    print("Initialization completed.")
    return Ok("")


def is_valid_email(email: str) -> bool:
    """Compare the passed `email` with the default HTML regex for email and return `True` if it is a match or `False` if it is not"""
    email_regex = "^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"

    if re.search(email_regex, email):
        return True
    else:
        return False


def bool_to_str(result: bool):
    if result:
        return "0"
    else:
        return "1"


import bcrypt


class Password:
    @staticmethod
    def validate_password_len(password: str) -> Err[str] | Ok[str]:
        password_min_len = int(get_env("PASSWORD_MIN_LENGTH"))

        if len(password) < password_min_len:
            return Err(
                "PasswordTooShortError",
                f"Minimum password length is: {password_min_len}, provided password is of length: {len(password)}",
            )
        else:
            return Ok(password)

    @staticmethod
    def hash(password: str) -> str:
        """Hash a password using the PASSWORD_SALT environment variable and return it as a UTF-8 string"""
        password_bytes = password.encode("utf-8")

        hashed_password = bcrypt.hashpw(password=password_bytes, salt=bcrypt.gensalt())

        return hashed_password.decode("utf-8")

    @staticmethod
    def is_match(password: str, hashed_password: str) -> bool:
        is_valid = bcrypt.checkpw(
            password=password.encode("utf-8"),
            hashed_password=hashed_password.encode("utf-8"),
        )
        return is_valid


import jwt
from datetime import datetime, timedelta
from jwt import ImmatureSignatureError, ExpiredSignatureError, InvalidSignatureError


class Token:
    @staticmethod
    def generate_for_email(from_email: str, to_email: str) -> str | None:
        EMAIL_JWT_SECRET = get_env(
            "EMAIL_JWT_SECRET"
        )  # isolate import to where it is used

        if len(EMAIL_JWT_SECRET) < 1:
            return None

        payload = {}

        current_datetime = datetime.now()
        # Issued at: Current timestamp (Unix epoch) - 2 seconds in case it is checked immediately after creation
        payload["iat"] = datetime.timestamp(current_datetime - timedelta(seconds=1))
        # Expiration: Current timestamp (Unix epoch) + 7 days
        payload["exp"] = datetime.timestamp(current_datetime + timedelta(days=7))
        payload["from_email"] = from_email
        payload["to_email"] = to_email

        token = jwt.encode(payload, EMAIL_JWT_SECRET, algorithm="HS256")

        return token

    @staticmethod
    def decode_for_email(token: str) -> Err | Ok:
        # isolate import to where it is used
        EMAIL_JWT_SECRET = get_env("EMAIL_JWT_SECRET")

        try:
            decoded_token = jwt.decode(token, EMAIL_JWT_SECRET, algorithms=["HS256"])
        except ExpiredSignatureError as error:  # Token expired
            return Err("ExpiredSignatureError", error.args[0])
        except InvalidSignatureError as error:  # Token has been tampered
            return Err("InvalidSignatureError", error.args[0])
        except ImmatureSignatureError as error:  # token not valid yet
            return Err("ImmatureSignatureError", error.args[0])

        return Ok(decoded_token)

    @staticmethod
    def generate_for_auth(user_email: str) -> str | None:
        # isolate import to where it is used
        AUTH_JWT_SECRET = get_env("AUTH_JWT_SECRET")

        if len(AUTH_JWT_SECRET) < 1:
            return None

        #TODO: check that user_email exists

        payload = {}

        current_datetime = datetime.now()
        # Issued at: Current timestamp (Unix epoch) - 2 seconds in case it is checked immediately after creation
        payload["iat"] = datetime.timestamp(current_datetime - timedelta(seconds=1))
        # Expiration: Current timestamp (Unix epoch) + 7 days
        payload["exp"] = datetime.timestamp(current_datetime + timedelta(days=7))
        payload["sub"] = user_email

        token = jwt.encode(payload, AUTH_JWT_SECRET, algorithm="HS256")

        return token

    @staticmethod
    def decode_for_auth(token: str) -> Err | Ok:
        AUTH_JWT_SECRET = get_env(
            "AUTH_JWT_SECRET"
        )  # isolate import to where it is used

        try:
            decoded_token = jwt.decode(token, AUTH_JWT_SECRET, algorithms=["HS256"])
        except ExpiredSignatureError as error:  # Token expired
            return Err("ExpiredSignatureError", error.args[0])
        except InvalidSignatureError as error:  # Token has been tampered
            return Err("InvalidSignatureError", error.args[0])
        except ImmatureSignatureError as error:  # token not valid yet
            return Err("ImmatureSignatureError", error.args[0])

        return Ok(decoded_token)


def decode_str_or_none(str: bytes) -> str | None:
    try:
        return str.decode('utf-8').replace('"', "")
    except:
        return None