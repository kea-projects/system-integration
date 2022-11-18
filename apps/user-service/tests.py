from model.User import User
from model.Invite import Invite
from utility.functions import Token
import uuid
import os


def test_getting_list_of_invites():
    from_email = 'valid2@email.test'
    result = Invite.get_all_invited(from_email)
    print(result)

def test_creating_invite():
    from_email = 'valid1@email.test'
    to_email = 'valid2@email.test'

    result = Invite.create_new_invite(from_email, to_email)
    print(result)

def test_altered_token():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njg2NDczMzUuNDkwNjA1LCJleHAiOjE2NjkyNTIxMzYuNDkwNjA1LCJmcm9tX2VtYWlsIjoic29tZUNoYW5nZWRAbWFpbC5jb20iLCJ0b19lbWFpbCI6Im90aGVyQG1haWwuY29tIn0.HH4d6nQte_Mg--M5KYN9mLG10RNCk9LLEcSW1rYE18o"
    result = Token.decode_email_token(str(token))
    print(result)
    assert result.is_err()


def test_decoding_expired_token():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njg2NDY5MzcuODkyMjg5LCJleHAiOjE2Njg2NDY5NDYuODkyMjg5LCJmcm9tX2VtYWlsIjoic29tZUBtYWlsLmNvbSIsInRvX2VtYWlsIjoib3RoZXJAbWFpbC5jb20ifQ.xC7p0tbF4K9BrwWUY2_6eEAa813a0ofLZcFRsiPmkrg"

    result = Token.decode_email_token(str(token))
    assert result.is_err()
    print(result)


def test_decoding_token():
    from_email = "some@mail.com"
    to_email = "other@mail.com"
    token = Token.generate_for_email(from_email=from_email, to_email=to_email)
    print(token)

    decoded_token_result = Token.decode_email_token(str(token))
    assert decoded_token_result.is_ok()
    print(decoded_token_result)


def test_generating_token():
    from_email = "some@mail.com"
    to_email = "other@mail.com"
    token = Token.generate_for_email(from_email=from_email, to_email=to_email)

    assert token is not None
    print(token)


def test_getting_user_by_mail():
    result = User.get_by_email(email="valid9@email.test")
    assert result.is_ok()
    print(result.data())

    result2 = User.get_by_email(email="valid8@email.test")
    assert result2.is_ok()
    print(result2.data())

    assert result.data() != result2.data()


def test_updating_users_password():
    result = User.get_by_id("6debdd1f-9d4f-45f7-bfd7-175ffc8e319f")
    print("User Get Request: ", result.data())

    new_user = User(
        user_id=uuid.uuid4(),
        email="InvalidMail@google.com",
        name="bob",
        password=os.urandom(10),
    )
    print("New User: ", new_user)

    result2 = User.update_by_id(user_id=result.data().user_id, user_obj=new_user)

    print("Update result: ", result2)

    assert result.data().password != result2.data().password


def test_creating_users():
    result = User.create_new(email="valid3@email.test", name="bieb", password="pass")

    if result.is_ok():
        print("Ok Result")
        print(result.data())
    else:
        print("Error Result")
        print(result.err())

    result2 = User.create_new(email="valid7@email.test", name="beb", password="banana")

    if result2.is_ok():
        print("Ok Result")
        print(result2.data())
    else:
        print("Error Result")
        print(result2.err())

    query = User.select()
    for res in query:
        print(res)

    print(str(query[0].user_id))

    result = User.get_by_id("6debdd1f-9d4f-45f7-bfd7-175ffc8e319f")
    print(result)

    result = User.get_by_id("6debdd1f-9d4f-45f7-bfd7-175ffc8e319c")
    print(result)