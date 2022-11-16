from typing import Any
import uuid
from peewee import UUIDField, CharField, IntegrityError, InternalError
from model.BaseModel import BaseModel
from utility.functions import is_valid_email, Password
from utility.result import Err, Ok
from config.database import DB_CONNECTION


class User(BaseModel):
    user_id = UUIDField(primary_key=True, null=False, unique=True, default=uuid.uuid4)
    email = CharField(max_length=50, null=False, unique=True, index=True)
    name = CharField(max_length=50, null=False)
    password = CharField(max_length=80, null=False)

    def __str__(self) -> str:
        return f"{{ 'user_id': {self.user_id}, 'email': {self.email}, 'name': {self.name}, 'password': {self.password} }}"

    @classmethod
    def create_new(cls, email: str, name: str, password: str) -> Err[Any] | Ok["User"]:
        if not is_valid_email(email):
            return Err("InvalidEmailError", f"Email '{email}' did not pass validation.")

        hashed_password = Password.hash(password)

        try:
            with DB_CONNECTION.atomic():  # HAVE to put this here, or transaction leaks to other queries
                result: User = cls.create(
                    email=email, name=name, password=hashed_password
                )
                return Ok(result)
        except IntegrityError as error:
            return Err("IntegrityError", error.args[0])

    @classmethod
    def get_by_id(cls, id: str) -> Err[str] | Ok["User"]:
        """Simple function to search for a User by his id

        If a match is found it is returned inside an `Ok` object, otherwise an `Err` is returned"""
        user_obj = cls.get_or_none(cls.user_id == id)
        if user_obj == None:
            return Err(
                "UserNotFoundError",
                f"User with the id of: '{id}' was not found in the database.",
            )
        else:
            return Ok(user_obj)
