#!/bin/env python
from config.database import DB_CONNECTION
from utility.functions import initialize_db, Password, Token
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs

from dotenv import dotenv_values
import sys


def main():
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        sys.exit(2)



    sys.exit(0)


main()
