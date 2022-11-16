#!/bin/env python
import uuid
from config.database import DB_CONNECTION
from utility.functions import initialize_db, Password
from model.User import User
from model.Invite import Invite

import bcrypt
import os
import sys


def main():
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        sys.exit(-1)


def test_getting_user_by_mail():
    result = User.get_by_email(email="valid9@email.test")
    print(result.data())
    assert result.is_ok()

    result2 = User.get_by_email(email="valid8@email.test")
    print(result2.data())
    assert result2.is_ok()

    assert result.data() != result2.data()


def test_updating_users():
    result = User.get_by_id("6debdd1f-9d4f-45f7-bfd7-175ffc8e319f")
    print("User Get Request: ", result.data())

    new_user = User(
        user_id=uuid.uuid4(),
        email="InvalidMail@google.com",
        name="bob",
        password="longesty",
    )
    print("New User: ", new_user)

    result = User.update_by_id(user_id=result.data().user_id, user_obj=new_user)

    print("Update result: ", result)


def test_creating_users():
    result = User.create_new(email="valid9@email.test", name="bieb", password="pass")

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


main()
