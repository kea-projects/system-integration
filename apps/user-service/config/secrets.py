from dotenv import dotenv_values
from utility.result import Err, Ok
import sys
import os

_envs = dotenv_values()
_external_envs = dotenv_values("../../.env")

_secrets = {
    "PASSWORD_MIN_LENGTH": _external_envs.get("PASSWORD_MIN_LENGTH") or os.environ.get("PASSWORD_MIN_LENGTH"),
    "JWT_SECRET": _external_envs.get("JWT_SECRET") or os.environ.get('JWT_SECRET'),
    "POSTGRES_USER": _external_envs.get("POSTGRES_USER") or os.environ.get('POSTGRES_USER'),
    "POSTGRES_PASSWORD": _external_envs.get("POSTGRES_PASSWORD") or os.environ.get('POSTGRES_PASSWORD'),
    "POSTGRES_DB": _external_envs.get("POSTGRES_DB") or os.environ.get('POSTGRES_DB'),
    "POSTGRES_HOST": _external_envs.get("POSTGRES_HOST") or os.environ.get('POSTGRES_HOST'),
    "POSTGRES_PORT": _external_envs.get("POSTGRES_PORT") or os.environ.get('POSTGRES_PORT'),
    "RABBITMQ_USER_SERVICE_USER": _external_envs.get("RABBITMQ_USER_SERVICE_USER") or os.environ.get('RABBITMQ_USER_SERVICE_USER'),
    "RABBITMQ_USER_SERVICE_PASSWORD": _external_envs.get("RABBITMQ_USER_SERVICE_PASSWORD") or os.environ.get('RABBITMQ_USER_SERVICE_PASSWORD'),
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
