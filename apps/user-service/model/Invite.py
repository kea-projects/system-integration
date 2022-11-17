import uuid
from peewee import UUIDField, CharField, ForeignKeyField, IntegrityError
from config.database import DB_CONNECTION
from model.BaseModel import BaseModel
from model.User import User
from utility.result import Ok, Err
from utility.functions import Token


class Invite(BaseModel):  # type: ignore
    invite_id = UUIDField(primary_key=True, null=False, unique=True, default=uuid.uuid4)
    from_email = ForeignKeyField(User, backref="sent_invites", lazy_load=False)
    to_email = CharField(max_length=50, null=False)
    token = CharField(max_length=512, null=False)  # Expiration is in the token

    def __str__(self) -> str:
        return f"{{ 'invite_id': {self.invite_id}, 'from_email': {self.from_email}, 'to_email': {self.to_email}, 'token': {self.token} }}"

    @classmethod
    def create_new_invite(cls, from_email: str, to_email: str) -> Err[str] | Ok['Invite']:
        get_from_email_result = User.get_by_email(email=from_email)

        if get_from_email_result.is_err():
            return get_from_email_result  # type: ignore | Can only ever be Err[str]

        token = Token.generate_for_email(from_email=from_email, to_email=to_email)

        try:
            with DB_CONNECTION.atomic():  # HAVE to put this here, or transaction leaks to other queries
                result: Invite = cls.create(
                    from_email=from_email,
                    to_email=to_email,
                    token=token
                )
                return Ok(result)
        except IntegrityError as error:
            return Err("IntegrityError", error.args[0])

        
