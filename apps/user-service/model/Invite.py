import json
import uuid
from peewee import UUIDField, CharField, IntegrityError, BooleanField
from config.database import DB_CONNECTION
from model.BaseModel import BaseModel
from model.User import User
from utility.result import Ok, Err
from utility.functions import Token
from peewee import DoesNotExist

from utility.serializers import UUIDEncoder


class Invite(BaseModel):  # type: ignore
    invite_id = UUIDField(primary_key=True, null=False, unique=True, default=uuid.uuid4)
    from_email = CharField(max_length=50, null=False)
    to_email = CharField(max_length=50, null=False)
    token = CharField(max_length=512, null=False)  # Expiration is in the token
    is_registered = BooleanField(default=False, null=False)

    def __str__(self) -> str:
        return f"{{ 'invite_id': {self.invite_id}, 'from_email': {self.from_email}, 'to_email': {self.to_email}, 'token': {self.token} }}"

    @classmethod
    def create_new_invite(cls, from_email: str, to_email: str) -> Err[str] | Ok["Invite"]:
        get_from_email_result = User.get_by_email(email=from_email)

        if get_from_email_result.is_err():
            return get_from_email_result  # type: ignore | Can only ever be Err[str]

        token = Token.generate_for_email(from_email=from_email, to_email=to_email)

        try:
            with DB_CONNECTION.atomic():  # HAVE to put this here, or transaction leaks to other queries
                result: Invite = cls.create(from_email=from_email, to_email=to_email, token=token)
                return Ok(result)
        except IntegrityError as error:
            return Err("IntegrityError", error.args[0])

    @classmethod  # * check: has `email` invited `other_email` -> true-> 1 | false -> 0
    def has_invited_other(cls, own_email: str, other_email: str) -> Err[str] | Ok[bool]:
        own_email_result = User.get_by_email(own_email)
        if own_email_result.is_err():  # own email does not have an account
            return own_email_result  # type: ignore | Can only be type Err[str]

        query_result = cls.get_or_none(Invite.from_email == own_email, Invite.to_email == other_email)

        if query_result is None:
            return Err("InviteNotFoundError", f"The email '{own_email}' has not invited '{other_email}'",) 
        else:
            return Ok(True)  # Invite exists

    @classmethod
    def get_all_invited(cls, own_email: str) -> Err[str] | Ok[list["Invite"]]:
        own_email_result = User.get_by_email(own_email)
        if own_email_result.is_err():
            return own_email_result  # type: ignore | Can only be type Err[str]

        query_result = []
        try:
            query = cls.select()
            for match in query.select().where(Invite.from_email == own_email):
                query_result.append(match)
        except DoesNotExist as error:
            return Err("DoesNotExistError", f"No rows matched the query: {error.args}")

        return Ok(query_result)

    def to_json(self) -> str:
        return json.dumps(self.__dict__['__data__'], cls=UUIDEncoder)
