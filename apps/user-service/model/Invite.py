from peewee import UUIDField, CharField, ForeignKeyField
from model.BaseModel import BaseModel
from model.User import User


class Invite(BaseModel):  # type: ignore
    invite_id = UUIDField(primary_key=True, null=False, unique=True)
    invitee_id = ForeignKeyField(User, backref="sent_invites", lazy_load=False)
    invited_email = CharField(max_length=50, null=False)
    # token: CharField(max_length=50, null=False) # Expiration can be handled by token
    ...
