from config.database import DB_CONNECTION
from model.User import User
from model.Invite import Invite
from utility.functions import Token, initialize_db
import uuid
import os


def run_tests():
    print("WARNING: running tests will nuke the database")
    initialize_db(DB_CONNECTION, [User, Invite], delete_schema=True).data()

    test_creating_users()
    test_getting_user_by_mail()
    test_updating_users_password()
    test_creating_invite()
    test_getting_list_of_invites()
    test_generating_token()
    test_decoding_token()
    test_altered_token()
    test_decoding_expired_token()


def test_creating_users():
    result = User.create_new(email="valid1@email.test", name="bob", password="pass")

    assert result.is_ok()

    result2 = User.create_new(email="valid2@email.test", name="beb", password="banana")

    assert result2.is_ok()

    result3 = User.create_new(
        email="valid3@email.test", name="bub", password="tangerine"
    )

    assert result3.is_ok()
    print("PASS: test_creating_users")


def test_getting_user_by_mail():
    result = User.get_by_email(email="valid1@email.test")
    assert result.is_ok()

    result2 = User.get_by_email(email="valid2@email.test")
    assert result2.is_ok()

    assert result.data() != result2.data()
    print("PASS: test_getting_user_by_mail")


def test_updating_users_password():
    result = User.get_by_email(email="valid1@email.test")

    assert result.is_ok()

    new_user = User(
        user_id=uuid.uuid4(),
        email="validUpdated@email.test",
        name="bob",
        password=os.urandom(10),
    )

    result2 = User.update_by_id(user_id=result.data().user_id, user_obj=new_user)


    assert result.data().password != result2.data().password
    print("PASS: test_updating_users_password")


def test_creating_invite():
    from_email = "valid2@email.test"
    to_email = "valid3@email.test"

    result = Invite.create_new_invite(from_email, to_email)
    assert result.is_ok()
    print("PASS: test_creating_invite")


def test_getting_list_of_invites():
    from_email = "valid2@email.test"
    result = Invite.get_all_invited(from_email)
    assert len(result.data()) == 1
    print("PASS: test_getting_list_of_invites")


def test_generating_token():
    from_email = "some@mail.com"
    to_email = "other@mail.com"
    token = Token.generate_for_email(from_email=from_email, to_email=to_email)

    assert token is not None
    print("PASS: test_generating_token")

def test_decoding_token():
    from_email = "some@mail.com"
    to_email = "other@mail.com"
    token = Token.generate_for_email(from_email=from_email, to_email=to_email)

    decoded_token_result = Token.decode_email_token(str(token))
    assert decoded_token_result.is_ok()
    print("PASS: test_decoding_token")


def test_altered_token():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njg2NDczMzUuNDkwNjA1LCJleHAiOjE2NjkyNTIxMzYuNDkwNjA1LCJmcm9tX2VtYWlsIjoic29tZUNoYW5nZWRAbWFpbC5jb20iLCJ0b19lbWFpbCI6Im90aGVyQG1haWwuY29tIn0.HH4d6nQte_Mg--M5KYN9mLG10RNCk9LLEcSW1rYE18o"
    result = Token.decode_email_token(str(token))
    assert result.is_err()
    print("PASS: test_altered_token")


def test_decoding_expired_token():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njg2NDY5MzcuODkyMjg5LCJleHAiOjE2Njg2NDY5NDYuODkyMjg5LCJmcm9tX2VtYWlsIjoic29tZUBtYWlsLmNvbSIsInRvX2VtYWlsIjoib3RoZXJAbWFpbC5jb20ifQ.xC7p0tbF4K9BrwWUY2_6eEAa813a0ofLZcFRsiPmkrg"

    result = Token.decode_email_token(str(token))
    assert result.is_err()
    print("PASS: test_decoding_expired_token")






run_tests()
