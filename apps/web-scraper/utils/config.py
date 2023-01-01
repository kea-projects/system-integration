from dotenv import dotenv_values
import sys
import os

envs = dotenv_values()

secrets = {
    "SFTP_HOST": envs.get("SFTP_HOST") or os.environ.get(
        "SFTP_HOST"
    ),
    "SFTP_PORT": int(envs.get("SFTP_PORT")) or int(os.environ.get(
        "SFTP_PORT"
    )),
    "SFTP_USERNAME": envs.get("SFTP_USERNAME") or os.environ.get(
        "SFTP_USERNAME"
    ),
    "SFTP_PASSWORD": envs.get("SFTP_PASSWORD") or os.environ.get(
        "SFTP_PASSWORD"
    ),
}


def get_env(env: str) -> str:
    if secrets[env] is not None:
        return secrets[env]
    else:
        print(f"ENV '{env}' does not exist.\nExiting...")
        sys.exit(1)


def validate_envs():
    for key, value in secrets.items():
        if value is None:
            print(f"ENV '{value}' does not exist.\nExiting...")
            sys.exit(1)

    print("All ENVs set correctly")


HOST = 'localhost'
PORT = 22
USERNAME = 'crist'
PASSWORD = '2912'
