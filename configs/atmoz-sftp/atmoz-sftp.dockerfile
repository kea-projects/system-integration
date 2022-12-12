# Forked version of atmoz/sftp that is built for both amd64 and arm64
# https://github.com/atmoz/sftp/issues/258
FROM odidev/sftp


ARG SFTP_USERNAME
ARG SFTP_PASSWORD
RUN mkdir -p /etc/sftp
RUN echo "$SFTP_USERNAME:$SFTP_PASSWORD:1001" > /etc/sftp/users.conf

ENTRYPOINT ["/entrypoint"]