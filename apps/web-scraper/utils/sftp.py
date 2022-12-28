import pysftp
from paramiko.ssh_exception import SSHException

from .config import get_env

# Credentials of targeted sftp server
HOST = get_env('SFTP_HOST')
PORT = get_env('SFTP_PORT')
USERNAME = get_env('SFTP_USERNAME')
PASSWORD = get_env('SFTP_PASSWORD')


def upload_db():
    try:
        cnopts = pysftp.CnOpts(knownhosts=None)
        connection = pysftp.Connection(host=HOST, port=PORT,
                                       username=USERNAME, password=PASSWORD,
                                       cnopts=cnopts)
        print("Connection established successfully!")

        # File path of local file and targeted location
        local_file = 'products.db'
        target_location = 'products.db'

        # Upload the file
        with connection.cd('upload'):
            connection.put(local_file, target_location)

    except SSHException as connection_error:
        print('Failed to connect to the server!', connection_error)
    except OSError as os_error:
        print('Error', os_error)
