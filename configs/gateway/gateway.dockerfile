FROM nginx:stable

# Install certbot requirements
RUN apt-get update && apt-get install certbot python3-certbot-nginx cron -y

RUN mkdir /scripts
COPY ./configs/gateway/prepare-certbot.sh /scripts

RUN rm /etc/nginx/conf.d/default.conf
# Copy script for later usage
COPY ./configs/gateway/conf.d/stream/default.conf                   /etc/nginx/conf.d/stream/
COPY ./configs/gateway/conf.d/stream/container-map.conf             /etc/nginx/conf.d/stream/
COPY ./configs/gateway/conf.d/1_container-map.conf                  /etc/nginx/conf.d/1_container-map.conf 
COPY ./configs/gateway/conf.d/api2.gifts.hotdeals.dev.conf          /etc/nginx/conf.d/api2.gifts.hotdeals.dev.conf
COPY ./configs/gateway/root.conf                                    /etc/nginx/nginx.conf



CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
