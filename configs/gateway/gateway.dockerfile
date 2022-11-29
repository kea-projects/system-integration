FROM nginx:stable-alpine


COPY ./configs/gateway/root.conf          /etc/nginx/nginx.conf
COPY ./configs/gateway/conf.d/http/default.conf       /etc/nginx/conf.d/http/
COPY ./configs/gateway/conf.d/http/container-map.conf /etc/nginx/conf.d/http/
COPY ./configs/gateway/conf.d/stream/default.conf       /etc/nginx/conf.d/stream/
COPY ./configs/gateway/conf.d/stream/container-map.conf /etc/nginx/conf.d/stream/

CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
