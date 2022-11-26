from dotenv import dotenv_values
from utility.result import Err, Ok
import sys
import os

_envs = dotenv_values()
_external_envs = dotenv_values("../../.env")

_secrets = {
    "RELOAD_UVICORN": _envs.get("RELOAD_UVICORN") or os.environ.get("RELOAD_UVICORN"),
    "AUTHENTICATION_PATH_PORT": _envs.get("AUTHENTICATION_PATH_PORT") or os.environ.get("AUTHENTICATION_PATH_PORT"),
    "AUTHENTICATION_PATH_HOST": _envs.get("AUTHENTICATION_PATH_HOST") or os.environ.get("AUTHENTICATION_PATH_HOST"),
    "RABBITMQ_USER_SERVICE_USER": _external_envs.get("RABBITMQ_USER_SERVICE_USER") or os.environ.get('RABBITMQ_USER_SERVICE_USER'),
    "RABBITMQ_USER_SERVICE_PASSWORD": _external_envs.get("RABBITMQ_USER_SERVICE_PASSWORD") or os.environ.get('RABBITMQ_USER_SERVICE_PASSWORD'),
    "RABBITMQ_USER_EXCHANGE": _external_envs.get('RABBITMQ_USER_EXCHANGE') or os.environ.get('RABBITMQ_USER_EXCHANGE'),
    "RABBITMQ_VHOST": _external_envs.get("RABBITMQ_VHOST") or os.environ.get('RABBITMQ_VHOST'),
    "RABBITMQ_HOST": _external_envs.get("RABBITMQ_HOST") or os.environ.get('RABBITMQ_HOST'),
}


def get_env(env: str) -> str:
    if _secrets[env] is not None:
        return _secrets[env]  # type: ignore | can only be str
    else:
        print(f"ENV '{env}' does not exist.\nExiting...")
        sys.exit(1)


def validate_envs() -> Err[str] | Ok[str]:
    for key, value in _secrets.items():
        if value is None:
            return Err("UnsetEnvError", f"The ENV '{key} is not set.")

    return Ok("All ENVs set correctly")
