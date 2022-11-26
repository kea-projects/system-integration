#!/bin/env python
from wrapper.friend_path import check_token_is_valid, check_user_is_invited, get_user_friends
from config.database import DB_CONNECTION
from utility.functions import initialize_db
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs
from utility import rabbitmq
from sys import exit


def subscribe_friend_path_rpc():
    rabbitmq.subscribe("user.check.invited", check_user_is_invited)
    rabbitmq.subscribe("token.check.valid", check_token_is_valid)
    rabbitmq.subscribe("user.get.friends", get_user_friends)

def main():
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        exit(2)

    subscribe_friend_path_rpc()

    exit(0)


main()
