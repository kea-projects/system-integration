from model.Invite import Invite
from utility.functions import bool_to_str
import json


def does_email_invite_exist(raw_data):
    data = json.loads(raw_data)

    from_email = data["invitee"]
    to_email = data["invited"]

    result = Invite.has_invited_other(from_email, to_email)

    return bool_to_str(result.to_bool())
