from model.Invite import Invite
from utility.functions import bool_to_str
import json


def does_email_invite_exist(raw_data):
    data: dict = json.loads(raw_data)

    from_email = data.get("invitee")
    to_email = data.get("invited")

    if from_email is None or to_email is None:
        return bool_to_str(False)

    result = Invite.has_invited_other(from_email, to_email)

    return bool_to_str(result.to_bool())
