#!/bin/env python
from fastapi import FastAPI
from config.secrets import get_env, validate_envs
import uvicorn
import logging


log = logging.getLogger("uvicorn.info")

server = FastAPI()

@server.post("/auth/login")
def login_route():
    log.info("/auth/login has been called")
    return {"hello_from": "/auth/login"}

@server.post("/auth/signup")
def signup_route():
    log.info("/auth/login has been called")
    return {"hello_from": "/auth/signup"}


@server.post("/auth/accept-invite")
def accept_invite_route():
    log.info("/auth/login has been called")
    return {"hello_from": "/auth/accept-invite"}


if __name__ == '__main__':
    validate_envs().data()
    port = int(get_env('AUTHENTICATION_PATH_PORT'))
    host = get_env('AUTHENTICATION_PATH_HOST')
    will_reload = bool(int(get_env("RELOAD_UVICORN")))
    print(f"Server will run on port '{port}' on host '{host}'. Autoreload enabled?: '{will_reload}'.")
    uvicorn.run(
        "main:server",
        port=port,
        host=host,
        reload=will_reload,
    )