FROM rabbitmq:3-alpine

# Expose used ports
EXPOSE 5672 

# Copy the configuration files needed
COPY ./configs/rabbitmq/definitions.json /import/
COPY ./configs/rabbitmq/rabbitmq.conf /etc/rabbitmq/

CMD 'rabbitmq-server'
