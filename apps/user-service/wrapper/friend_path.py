from model.Invite import Invite
from model.User import User
from utility.functions import bool_to_str, decode_str_or_none
from utility.functions import Token
import json


class FriendListUser:
    email: str
    is_registered: bool

    def __init__(self, email, is_registered) -> None:
        self.email = email
        self.is_registered = is_registered


def check_user_is_invited(raw_data: bytes) -> str:
    data: dict = json.loads(raw_data)

    from_email = data.get("invitee")
    to_email = data.get("invited")

    if from_email is None or to_email is None:
        return bool_to_str(False)

    result = Invite.has_invited_other(from_email, to_email)

    return bool_to_str(result.to_bool())


def check_token_is_valid(raw_data: bytes) -> str:
    token = decode_str_or_none(raw_data)

    if token is None:
        return bool_to_str(False)

    result = Token.decode_for_auth(token)

    return bool_to_str(result.to_bool())


def get_user_friends(raw_data: bytes) -> str:
    user_email = decode_str_or_none(raw_data)

    friend_list = []

    if user_email is None:
        return json.dumps(friend_list)

    invited_user_list = Invite.get_all_invited(user_email)
    if invited_user_list.is_ok():
        friend_list = [
            FriendListUser(invite.to_email, invite.is_registered).__dict__
            for invite in invited_user_list.data()
        ]

    return json.dumps(friend_list)

def invite(raw_data: bytes) -> str:
    message:dict = json.loads(raw_data)

    from_email = message.get("invitee") or ""
    to_email = message.get("invited") or ""

    result = Invite.create_new_invite(from_email=from_email, to_email=to_email)

    if result.is_ok():
        # TODO: publish message to send-invite-email
    else:
        # TODO: do nothing?
