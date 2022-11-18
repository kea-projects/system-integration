from dotenv import dotenv_values
import sys

_envs = dotenv_values()
_external_envs = dotenv_values("../../.env")

_secrets = {
    "PASSWORD_SALT": _envs.get("PASSWORD_SALT").encode("utf-8"),  # type: ignore
    "PASSWORD_MIN_LENGTH": _envs.get("PASSWORD_MIN_LENGTH"),
    "JWT_SECRET": _envs.get("JWT_SECRET"),
    "POSTGRES_USER": _external_envs.get("POSTGRES_USER"),
    "POSTGRES_PASSWORD": _external_envs.get("POSTGRES_PASSWORD"),
    "POSTGRES_DB": _external_envs.get("POSTGRES_DB"),
    "POSTGRES_HOST": _external_envs.get("POSTGRES_HOST"),
    "POSTGRES_PORT": _external_envs.get("POSTGRES_PORT"),
    "RABBITMQ_DEFAULT_USER": _external_envs.get("RABBITMQ_DEFAULT_USER"),
    "RABBITMQ_DEFAULT_PASS": _external_envs.get("RABBITMQ_DEFAULT_PASS"),
}


def get_env(env: str) -> str:
    if _secrets[env] is not None:
        return _secrets[env]
    else:
        print(f"ENV '{env}' is not loaded, exiting...")
        sys.exit(1)
