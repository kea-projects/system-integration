#!/bin/env python
from config.database import DB_CONNECTION
from utility.functions import initialize_db
from model.User import User
from model.Invite import Invite
from config.secrets import validate_envs
from sys import exit

import multiprocessing
from utility.rabbitmq import consume
from wrapper.friend_path import invite

from wrapper.partial_maker import get_invite_process_function, get_partial_function_list


if __name__ == "__main__":
    validate_envs().data()
    result = initialize_db(DB_CONNECTION, [User, Invite])
    if result.is_err():
        print(f"DB Connection Failed! Reason: {result.err()}\nExiting...")
        exit(2)

    multiprocessing.set_start_method("spawn")

    function_list = get_partial_function_list()

    # TODO: delete
    res = User.create_new(email="some@email.com", name="bob", password="potatoman")
    print(res)

    process_list = []
    print("Processes initializing")
    for x, function in enumerate(function_list):
        process = multiprocessing.Process(target=function, name=str(x))
        process_list.append(process)

    print("Processes ready to start")

    for process in process_list:
        process.start()
    consume_invite_process_function = get_invite_process_function()
    consume_invite_process = multiprocessing.Process(target=consume_invite_process_function, name="consume-invite")
    consume_invite_process.start()

    print("Threads running")

    exit(0)
