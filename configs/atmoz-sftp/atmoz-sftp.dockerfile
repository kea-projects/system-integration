# Forked version of atmoz/sftp that is built for both amd64 and arm64
# https://github.com/atmoz/sftp/issues/258
FROM odidev/sftp

COPY ./configs/atmoz-sftp/fix-permissions.sh /etc/sftp.d/fix-permissions.sh

ENTRYPOINT ["/entrypoint"]