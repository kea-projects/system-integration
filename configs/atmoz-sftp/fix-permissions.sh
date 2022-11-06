#!/bin/bash


chown 1001 -R /home/$SFTP_USERNAME/upload/
result = $?
echo $result
echo $SFTP_USERNAME