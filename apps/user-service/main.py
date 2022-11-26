#!/bin/env python
from wrapper.auth_path import (
    decode_auth_token,
    generate_auth_token,
    create_new_user,
    compare_passwords,
)
from wrapper.friend_path import (
    check_token_is_valid,
    check_user_is_invited,
    get_user_friends,
)
from config.database import DB_CONNECTION
from utility.functions import initialize_db, Token
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs
from utility import rabbitmq
from sys import exit


def subscribe_friend_path_rpc():
    rabbitmq.subscribe("user.check.invited", check_user_is_invited)
    rabbitmq.subscribe("token.check.valid", check_token_is_valid)
    rabbitmq.subscribe("user.get.friends", get_user_friends)


def subscribe_auth_path_rpc():
    rabbitmq.subscribe("user.decode.token", decode_auth_token)
    rabbitmq.subscribe("user.generate.token", generate_auth_token)
    rabbitmq.subscribe("user.create.account", create_new_user)
    rabbitmq.subscribe("user.create.pass.compare", compare_passwords)


def main():
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        exit(2)

    subscribe_friend_path_rpc()
    subscribe_auth_path_rpc()

    exit(0)


main()
