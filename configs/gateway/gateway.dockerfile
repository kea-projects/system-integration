FROM nginx:stable-alpine


COPY ./configs/gateway/root.conf                                    /etc/nginx/nginx.conf
COPY ./configs/gateway/conf.d/api2.gifts.hotdeals.dev.conf          /etc/nginx/conf.d/api2.gifts.hotdeals.dev
# COPY ./configs/gateway/conf.d/1_container-map.conf                  /etc/nginx/conf.d/1_container-map.conf
COPY ./configs/gateway/conf.d/stream/default.conf                   /etc/nginx/conf.d/stream/
COPY ./configs/gateway/conf.d/stream/container-map.conf             /etc/nginx/conf.d/stream/

CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
