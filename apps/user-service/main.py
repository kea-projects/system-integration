#!/bin/env python
from wrapper.friend_path import check_user_is_invited
from config.database import DB_CONNECTION
from utility.functions import initialize_db
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs
from utility import rabbitmq
from sys import exit


def main():
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        exit(2)

    rabbitmq.subscribe("user.check.invited", check_user_is_invited)

    exit(0)


main()
