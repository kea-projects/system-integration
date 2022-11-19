FROM rabbitmq:3.11-management

# Expose used ports
EXPOSE 5672 15672

# Copy the configuration files needed
COPY ./configs/rabbitmq/definitions.json /import/
COPY ./configs/rabbitmq/rabbitmq.conf /etc/rabbitmq/
