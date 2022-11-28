#!/bin/env python
from fastapi import FastAPI, Response, status, HTTPException
from model.objects import (
    LoginObject,
    LoginRes,
    SignupObject,
    SignupRes,
    InviteObject,
    InviteRes,
    ValidateObject,
    ValidateRes,
)
from fastapi.middleware.cors import CORSMiddleware
from config.secrets import get_env, validate_envs
from utility.rabbitmq import RabbitMqRpcClient
from utility.logger import log
import uvicorn


server = FastAPI()


@server.post("/auth/validate", response_model=ValidateRes)
def validate_route(validate_obj: ValidateObject, response: Response):
    log.info(f"/auth/validate has been called with: '{validate_obj.__dict__}'")

    log.info("Checking if token is valid")
    rpc_token_is_valid = RabbitMqRpcClient("user.decode.token").call(validate_obj.token)

    print("Token is: ", rpc_token_is_valid)

    if rpc_token_is_valid is not None:
        if rpc_token_is_valid.get("error"):
            log.warn(f"Token was not valid. reason: {rpc_token_is_valid['error']}")
            return {"isValid": False}
        else:
            return {"isValid": True}
    else:
        return {"isValid": False}


@server.post("/auth/login", response_model=LoginRes)
def login_route(login_obj: LoginObject, response: Response):
    log.info(f"/auth/login has been called with: '{login_obj.__dict__}'")

    log.info("Checking if a user with that email exists.")
    rpc_user_result = RabbitMqRpcClient("user.get.by.email").call(login_obj.email)
    if rpc_user_result.get("error"):
        log.warn("The email was not found in the database")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"{rpc_user_result['detail']}",
        )
    user = rpc_user_result.get("ok")

    log.info("User email was found, comparing the passwords.")
    rpc_is_match = RabbitMqRpcClient("user.compare.password").call(
        {"password": login_obj.password, "hashed_password": user["password"]}
    )
    if not rpc_is_match:
        log.warn("The passwords did not match")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"The provided password is incorrect.",
        )

    log.info("Password was valid, generating token.")
    rpc_token = RabbitMqRpcClient("user.generate.token").call(user["email"])

    if rpc_token:
        log.info("Returning valid token")
        return {"token": rpc_token}
    else:
        log.error("Unknown error occurred, rejecting auth.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized",
        )


@server.post("/auth/signup", status_code=201, response_model=SignupRes)
def signup_route(signup_obj: SignupObject, response: Response):
    log.info(f"/auth/signup has been called with: '{signup_obj.__dict__}'")

    log.info(f"Attempting to create a new user with the provided body.")
    result = RabbitMqRpcClient("user.create.account").call(signup_obj.__dict__)

    if result is not None:
        if result.get("ok"):
            log.info("User created successfully.")
            return result.get("ok")  # SignupRes object
        else:
            log.warn(f"Signup failed: {result['detail']}")
            raise HTTPException(
                status_code=400,
                detail=result["detail"],
            )
    else:
        log.error("RabbitMq did not respond")
        raise HTTPException(
            status_code=500,
            detail=f"Unknown error has occurred",
        )


@server.post("/auth/accept-invite", response_model=InviteRes)
def accept_invite_route(invite_obj: InviteObject, response: Response):
    log.info(f"/auth/accept-invite has been called with: '{invite_obj.__dict__}'")

    # TODO: Figure this one out
    # Send the request over to user-service
    ## On the user-service:
    #   Check if an invite of invite_obj exists
    #   if it does - mark it as accepted - SOMEHOW
    #   return - ????????

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
