from utility.functions import Token, decode_str_or_none, Password
from utility.result import Err, Ok, Result
from utility.serializers import UUIDEncoder
from model.User import User
import json


def compare_user_password(raw_data: bytes) -> str:
    message = json.loads(raw_data)

    password = message.get("password")
    hashed_password = message.get("hashed_password")

    result = Password.is_match(password=password, hashed_password=hashed_password)
    return json.dumps(result)


def get_user_by_email(raw_data: bytes) -> str:
    email = decode_str_or_none(raw_data)
    result = User.get_by_email(email)

    if result.is_ok():
        response = {"ok": result.data().__dict__["__data__"]}
    else:
        response = result.__dict__
    return json.dumps(response, cls=UUIDEncoder)


def decode_auth_token(raw_data: bytes) -> str:
    token = decode_str_or_none(raw_data)

    if token is None:
        error = Err(
            "UnparseableByteString",
            f"The raw data '{raw_data}' was unable to be parsed to string.",
        ).__dict__
        return json.dumps(error)
    try:
        result = Token.decode_for_auth(token).__dict__
    except:
        print("invalid token string")
        result = Err(
            "UnparseableByteString",
            f"The raw data '{raw_data}' was unable to be parsed to string.",
        ).__dict__
    return json.dumps(result)


def generate_auth_token(raw_data: bytes):
    email = decode_str_or_none(raw_data)

    if email is None:
        error = Err(
            "UnparseableByteString",
            f"The raw data '{raw_data}' was unable to be parsed to string.",
        ).__dict__
        return json.dumps(error)
    result = Token.generate_for_auth(email)
    return json.dumps(result)


def create_new_user(raw_data: bytes) -> str:
    user_json: dict = json.loads(raw_data)

    email = user_json.get("data")
    name = user_json.get("name")
    password = user_json.get("password")

    result = User.create_new(email=email, name=name, password=password).__dict__

    return json.dumps(result)


def compare_passwords(raw_data: bytes) -> str:
    password_json: dict = json.loads(raw_data)

    password: str | None = password_json.get("password")
    hashed_pass: str | None = password_json.get("hashed_password")

    if password is None or hashed_pass is None:
        reason = "password" if password is None else "hashed_pass"
        error = Err(
            "MissingAttribute",
            f"The password json is missing '{reason}'.",
        ).__dict__
        return json.dumps(error)

    is_match: bool = Password.is_match(password=password, hashed_password=hashed_pass)
    if is_match:
        return json.dumps(Ok("Its a match!").__dict__)
    else:
        return json.dumps(Err("ValidationError", "Passwords did not match").__dict__)
