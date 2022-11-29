#!/bin/env python
from fastapi import FastAPI, status, HTTPException
from model.objects import (
    HTTPError,
    LoginObject,
    LoginRes,
    SignupObject,
    SignupRes,
    InviteObject,
    InviteRes,
    ValidateObject,
    ValidateResError,
    ValidateRes,
)
from fastapi.middleware.cors import CORSMiddleware
from config.secrets import get_env, validate_envs
from utility.rabbitmq import RabbitMqRpcClient
from utility.logger import log
import uvicorn


server = FastAPI(openapi_url="/auth/openapi.json", docs_url="/auth/docs")


@server.post(
    "/auth/validate",
    responses={
        200: {"model": ValidateRes},
        401: {"model": ValidateResError},
    },
)
def validate_route(validate_obj: ValidateObject):
    log.info(f"/auth/validate has been called with: '{validate_obj.__dict__}'")

    log.info("Checking if token is valid")
    rpc_token_is_valid = RabbitMqRpcClient("user.decode.token").call(validate_obj.token)

    if rpc_token_is_valid is not None:
        if rpc_token_is_valid.get("error"):
            log.warn(f"Token was not valid. reason: {rpc_token_is_valid['error']}")
            return {"isValid": False}
        else:
            return {"isValid": True}
    else:
        return {"isValid": False}


@server.post(
    "/auth/login",
    responses={
        200: {"model": LoginRes},
        401: {"model": HTTPError},
    },
)
def login_route(login_obj: LoginObject):
    log.info(f"/auth/login has been called with: '{login_obj.__dict__}'")

    log.info("Checking if a user with that email exists.")
    rpc_user_result = RabbitMqRpcClient("user.get.by.email").call(login_obj.email)
    if rpc_user_result is None or rpc_user_result.get("error"):
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

    auth_object = {"email": login_obj.email, "user_id": user["user_id"]}
    rpc_token = RabbitMqRpcClient("user.generate.token").call(auth_object)

    if rpc_token:
        log.info("Returning valid token")
        return {"token": rpc_token}
    else:
        log.error("Unknown error occurred, rejecting auth.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized",
        )


@server.post(
    "/auth/signup",
    status_code=201,
    responses={
        201: {"model": SignupRes},
        400: {"model": HTTPError},
        500: {"model": HTTPError},
    },
)
def signup_route(signup_obj: SignupObject):
    log.info(f"/auth/signup has been called with: '{signup_obj.__dict__}'")

    log.info(f"Attempting to create a new user with the provided body.")
    result = RabbitMqRpcClient("user.create.account").call(signup_obj.__dict__)

    if result is not None:
        if result.get("ok"):
            log.info("User created successfully.")
            user_object = result.get("ok")
            import uuid
            return {
                "user_id": uuid.UUID(user_object["user_id"]),
                "email": user_object["email"],
                "name": user_object["name"],
            }
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


@server.post(
    "/auth/accept-invite",
    status_code=202,
    responses={
        202: {"model": InviteRes},
        400: {"model": HTTPError},
        412: {"model": HTTPError},
    },
)
def accept_invite_route(invite_obj: InviteObject):
    log.info(f"/auth/accept-invite has been called with: '{invite_obj.__dict__}'")

    log.info("Validating token.")
    decoded_token_result = RabbitMqRpcClient("email.token.decode").call(
        invite_obj.token
    )

    decoded_token = decoded_token_result.get("ok")
    if decoded_token is None:
        log.warn("Token decoding failed!")
        raise HTTPException(status_code=400, detail=decoded_token_result["detail"])

    log.info("Token validated successfully.")
    from_email = decoded_token.get("from_email")
    to_email = decoded_token.get("to_email")

    log.info(f"Checking if '{to_email}' has an account.")
    user_query_result = RabbitMqRpcClient("user.get.by.email").call(to_email)
    if user_query_result.get("error"):
        log.warn(f"The email '{to_email}' does not have an account.")
        raise HTTPException(status_code=400, detail=user_query_result["detail"])

    log.info(f"Checking if '{from_email}' has invited '{to_email}'")
    invite_request = {"invitee": from_email, "invited": to_email}
    result = RabbitMqRpcClient("user.check.invited").call(invite_request)
    is_invited = bool(int(result))

    if not is_invited:
        log.warn(f"The email '{from_email}' has NOT invited '{to_email}'!")
        raise HTTPException(
            status_code=400, detail=f"No invite exists from {from_email} to {to_email}"
        )

    set_is_registered_payload = {
        "from_email": from_email,
        "to_email": to_email,
        "is_registered": True,
    }
    log.info(f"Attempting to update the is_registered bool to: {True}")
    updated_invite_result = RabbitMqRpcClient("invite.set.registered").call(
        set_is_registered_payload
    )
    updated_invite = updated_invite_result.get("ok")
    if updated_invite:
        log.info("Invite's is_registered attribute updated successfully")
        return {"status": "accepted"}
    else:
        log.error("Failed to update the 'is_registered' property")
        log.error(updated_invite_result["detail"])
        raise HTTPException(status_code=400, detail=updated_invite_result["detail"])


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
