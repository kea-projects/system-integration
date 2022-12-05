#!/bin/bash

# DOMAIN_NAME=$1 # "api2.gifts.hotdeals.dev"
# EMAIL=$2 # "dealer@hotdeals.dev"


if [ -z ${1+x} ]; then
    echo "ERROR: The parameter in slot '1' for 'DOMAIN_NAME' is unset!";
    exit 1;
    else DOMAIN_NAME=$1;
fi;
echo "Domain name is: $DOMAIN_NAME"

if [ -z ${2+x} ]; then
    echo "ERROR: The parameter in slot '2' for 'EMAIL' is unset!";
    exit 1;
    else EMAIL=$2;
fi;
echo "Email is: $EMAIL"

# Install certbot and its requirements
# sudo apt-get update
# sudo apt-get install certbot python3-certbot-nginx -y

# Generate the tokens
# sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL


# Add cronjob for renewing certs - 30 days
# crontab -e 0 12 * * * /usr/bin/certbot renew --quiet



