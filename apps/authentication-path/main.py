#!/bin/env python
from fastapi import FastAPI, Response, status
from model.objects import LoginObject, SignupObject, InviteObject, ValidateObject
from fastapi.middleware.cors import CORSMiddleware
from config.secrets import get_env, validate_envs
from utility.rabbitmq import RabbitMqConnection
from utility.logger import log
import uvicorn
import json

from utility.result import Err


server = FastAPI()


@server.post("/auth/validate")
def validate_route(validate_obj: ValidateObject, response: Response):
    log.info(f"/auth/validate has been called with: '{validate_obj.__dict__}'")
    rmq = RabbitMqConnection()

    message = json.dumps(validate_obj.__dict__)
    ok_reply = {'ok': 'validated'}
    err_reply = {'error': 'someError', 'detail': 'Some detail info here'}

    result = rmq.publish_message_and_receive_response(
        queue="validate-token",
        message=message,
        response=err_reply,
    )

    if result.is_ok():
        data: dict = result.data()
        if data.get("ok"):
            return {"ok": "authorized"}
        else:
            reason: Err = result.data()
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return reason
    else:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return result.err()




@server.post("/auth/login")
def login_route(login_obj: LoginObject, response: Response):
    log.info(f"/auth/login has been called with: '{login_obj.__dict__}'")
    rmq = RabbitMqConnection()

    message = json.dumps(login_obj.__dict__)
    reply = {"token": "a3e99738-1ebb-45d6-9e0f-fdb6ff8f47a6"}
    result = rmq.publish_message_and_receive_response(
        queue="login-user",
        message=message,
        response=reply,
    )

    if result.is_ok():
        data: dict = result.data()
        if data.get("token"):
            return {"token": data.get("token")}
        else:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"error": "unauthorized"}
    else:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return result.err()


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
