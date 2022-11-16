#!/bin/env python
from config.database import DB_CONNECTION
from utility.functions import initialize_db, Password
from model.User import User
from model.Invite import Invite

import bcrypt
import os



def main():
    initialize_db(DB_CONNECTION, [User, Invite])


    result = User.create_new(email="valid9@email.test", name="bieb", password="pass")

    #print(result)
    
    if result.is_ok():
        print(result.ok())
        print("OK")
    else:
        print("ERROR")
        print(result.err())

    
    result2 = User.create_new(email="valid7@email.test", name="beb", password="banana")


    #print(result)
    
    if result2.is_ok():
        print(result2.ok())
        print("OK")
    else:
        print("ERROR")
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