#!/bin/bash

# --- README ---
# Pre-requisites:
# 1. Install `sshpass`
# 2. Connect to the sftp server manually at least once
# 3. Build the Dockerfile

WORKDIR=$1;
SFTP_CONNECTION=$2; # Example: user@host:/folder
SFTP_PASSWORD=$3;

cd $WORKDIR;

echo 'Loading environment variables...'
source ./scripts/env-loader.sh;

echo 'Scrapping for products...'
docker run --rm -v $WORKDIR/sqlite:/service/sqlite scrappy-doo;

echo 'Uploading database...'
sshpass -p $SFTP_PASSWORD sftp $SFTP_CONNECTION <<< 'put ./sqlite/products.db';

upload_result=$?;

if [ $upload_result -ne 0 ]; then
  echo "Upload failed with exit code ${upload_result}." ;
else
  echo 'Upload succeeded.';
fi
