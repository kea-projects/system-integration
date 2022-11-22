#!/bin/env python
from config.database import DB_CONNECTION
from utility.functions import initialize_db
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs

# TEST TODO
from utility.amqp import subscribe

import sys

# TODO DELETE SUN
def process_trash(message):
    print(message)
    return "str"


def main():
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        sys.exit(2)

    subscribe("test", process_trash)
    sys.exit(0)


main()
