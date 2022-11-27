import json
from typing import Any
import uuid
from peewee import UUIDField, CharField, IntegrityError
from model.BaseModel import BaseModel
from utility.functions import is_valid_email, Password
from utility.result import Err, Ok
from config.database import DB_CONNECTION
from utility.serializers import UUIDEncoder


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
            return Err("InvalidEmailError", f"Email {email} did not pass validation.")

        password_validation_result = Password.validate_password_len(password)
        if password_validation_result.is_err():
            return password_validation_result # type: ignore | can only be Err[str]

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
        """Simple function to search for a User by his `user_id` field.

        If a match is found it is returned inside an `Ok` object, otherwise an `Err` is returned"""
        user_obj = cls.get_or_none(cls.user_id == id)
        if user_obj == None:
            return Err(
                "UserNotFoundError",
                f"User with the id of: {id} was not found in the database.",
            )
        else:
            return Ok(user_obj)

    @classmethod
    def get_by_email(cls, email: str) -> Err[str] | Ok["User"]:
        """Simple function to search for a User by his `email` field.

        If a match is found it is returned inside an `Ok` object, otherwise an `Err` is returned"""
        user_obj = cls.get_or_none(cls.email == email)
        if user_obj is None:
            return Err(
                "UserNotFoundError",
                f'User with the email of: {email} was not found in the database.',
            )
        else:
            return Ok(user_obj)

    @classmethod
    def update_by_id(cls, user_id: str, user_obj: "User") -> Err[Any] | Ok["User"]:
        result = User.get_by_id(user_id)
        if result.is_err():
            return result

        old_user_obj: User = result.data()

        if not is_valid_email(str(user_obj.email)):
            return Err(
                "ValidationError", f"Email '{user_obj.email}' did not pass validation."
            )

        passwd_validation_result = Password.validate_password_len(str(user_obj.password))
        if passwd_validation_result.is_err():
            return passwd_validation_result  # type: ignore | can only be an Err[str]

        temp_mail = user_obj.email
        temp_name: CharField = user_obj.name
        temp_password: str = Password.hash(str(passwd_validation_result.data()))

        # Reassign the old fields with new
        old_user_obj.email = temp_mail
        old_user_obj.name = temp_name
        old_user_obj.password = temp_password

        try:  # To save the updated object
            result = old_user_obj.save()
            if result == 1:
                return Ok(old_user_obj)
            else:
                return Err("UpdateError", "Failed to update User")
        except IntegrityError as error:
            return Err("IntegrityError", error)

    def to_json(self) -> str:
        return json.dumps(self.__dict__["__data__"], cls=UUIDEncoder)
