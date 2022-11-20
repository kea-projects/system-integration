#!/bin/env python
from typing import Any
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from config.secrets import get_env, validate_envs
from model.objects import LoginObject, SignupObject, InviteObject
from utility.rabbitmq import RabbitMqConnection
from utility.logger import log
import uvicorn


server = FastAPI()


@server.post("/auth/login")
def login_route(login_obj: LoginObject, response: Response):
    log.info(f"/auth/login has been called with: '{login_obj.__dict__}'")
    hello_connection = RabbitMqConnection("localhost")
    result = hello_connection.publish_message("hello", login_obj)
    
    # send login information to user-service
    if result.is_err():
        response.status_code = 500
        return {"error": result.error, "detail": result.detail}

    result = hello_connection.consume_message(queue="hello")
    # get token or error from user-service

    print(result)
    # process response

    return {"token": "token"} or {"error": "error", "detail": "detail"}


@server.post("/auth/signup")
def signup_route(signup_obj: SignupObject):
    log.info(f"/auth/signup has been called with: '{signup_obj.__dict__}'")

    # Send signup information to user-service

    # get response back

    # respond with success or error - validation is likely to throw errors
    return signup_obj


@server.post("/auth/accept-invite")
def accept_invite_route(invite_obj: InviteObject):
    log.info(f"/auth/accept-invite has been called with: '{invite_obj.__dict__}'")

    # lets get here when we get here...

    return invite_obj


if __name__ == "__main__":
    validate_envs().data()
    port = int(get_env("AUTHENTICATION_PATH_PORT"))
    host = get_env("AUTHENTICATION_PATH_HOST")
    will_reload = bool(int(get_env("RELOAD_UVICORN")))
    
    
    origins = [f"http://{host}:{port}"]
    server.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print(
        f"Server will run on port '{port}' on host '{host}'. Autoreload enabled?: '{will_reload}'."
    )
    uvicorn.run(
        "main:server",
        port=port,
        host=host,
        reload=will_reload,
        headers=[("ContentType", "application/json")],
    )
