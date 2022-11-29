from functools import partial

from utility import rabbitmq
from wrapper.auth_path import (
    compare_passwords,
    compare_user_password,
    create_new_user,
    decode_auth_token,
    generate_auth_token,
    get_user_by_email,
)
from wrapper.friend_path import (
    check_user_is_invited,
    check_token_is_valid,
    get_user_friends,
    invite,
)


def get_partial_function_list() -> list:
    """Wrapper function to prepare the subscribe function for passing to a process

    It takes the intended function: `rabbitmq.subscribe` and its two parameters `topic` and `callback`
    and prepares them in a 'partial' function, that can later be executed by the process managers.

    This prevents lockup by calling the function while passing it to the process.

    They are returned in an array for convenience
    """
    # auth-path
    compare_user_password_process = partial(
        rabbitmq.subscribe, "user.compare.password", compare_user_password
    )

    get_user_by_email_process = partial(
        rabbitmq.subscribe, "user.get.by.email", get_user_by_email
    )

    decode_auth_token_process = partial(
        rabbitmq.subscribe, "user.decode.token", decode_auth_token
    )
    generate_auth_token_process = partial(
        rabbitmq.subscribe, "user.generate.token", generate_auth_token
    )
    crate_new_user_process = partial(
        rabbitmq.subscribe, "user.create.account", create_new_user
    )
    compare_passwords_process = partial(
        rabbitmq.subscribe, "user.create.pass.compare", compare_passwords
    )

    # friend-path
    check_user_is_invited_process = partial(
        rabbitmq.subscribe, "user.check.invited", check_user_is_invited
    )
    check_token_is_valid_process = partial(
        rabbitmq.subscribe, "token.check.valid", check_token_is_valid
    )
    get_user_friends_process = partial(
        rabbitmq.subscribe, "user.get.friends", get_user_friends
    )

    # wishes-service
    decode_email_token_process = partial(
        rabbitmq.subscribe, "email.token.decode", get_user_friends
    )
    

    prepared_functions = [
        # aut-path
        compare_user_password_process,
        get_user_by_email_process,
        decode_auth_token_process,
        generate_auth_token_process,
        crate_new_user_process,
        compare_passwords_process,
        # friend-path
        check_user_is_invited_process,
        check_token_is_valid_process,
        get_user_friends_process,
        # wishes-service
        decode_email_token_process,
    ]
    return prepared_functions


def get_invite_process_function():
    return partial(rabbitmq.consume, "invite", invite)
