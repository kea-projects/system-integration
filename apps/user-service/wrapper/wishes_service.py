from utility.functions import decode_str_or_none
from utility.functions import Token
import json
from utility.result import Err


def decode_email_token(raw_data: bytes) -> str:
    token = decode_str_or_none(raw_data)

    if token:
        result = Token.decode_for_email(token)
        if result.is_ok():
            return json.dumps(result.data().__dict__)
        else:
            return json.dumps(result.__dict__)
    else:
        return json.dumps(
            Err(
                "MissingAttributeError",
                "The required field: 'email' is missing or not a valid string.",
            ).__dict__
        )
