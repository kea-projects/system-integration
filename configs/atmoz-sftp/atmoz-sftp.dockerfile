FROM atmoz/sftp

COPY ./configs/atmoz-sftp/fix-permissions.sh /etc/sftp.d/fix-permissions.sh

ENTRYPOINT ["/entrypoint"]