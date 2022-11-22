from model.Invite import Invite
from model.User import User
from utility.functions import bool_to_str
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
    token = raw_data.decode("utf-8", errors="ignore")

    result = Token.decode_for_auth(token)

    return bool_to_str(result.to_bool())


def get_user_friends(raw_data: bytes) -> str:
    user_email = raw_data.decode("utf-8", errors="ignore")

    friend_list = []

    invited_user_list = Invite.get_all_invited(user_email)
    if invited_user_list.is_ok():
        friend_list = [
            FriendListUser(invite.to_email, invite.is_registered).__dict__
            for invite in invited_user_list.data()
        ]

    return json.dumps(friend_list)
