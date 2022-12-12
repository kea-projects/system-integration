from config.secrets import get_env
from utility.logger import log
from utility.result import Ok, Err
import pika
import json


RABBITMQ_USERNAME = get_env("RABBITMQ_USER_SERVICE_USER")
RABBITMQ_PASSWORD = get_env("RABBITMQ_USER_SERVICE_PASSWORD")
RABBITMQ_HOST = get_env("RABBITMQ_HOST")
RABBITMQ_VHOST = get_env("RABBITMQ_VHOST")
RABBITMQ_USER_EXCHANGE = get_env("RABBITMQ_USER_EXCHANGE")

import uuid


class RabbitMqRpcClient(object):
    def __init__(self, topic):
        self.topic = topic

        credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
        connection_params = pika.ConnectionParameters(
            host=RABBITMQ_HOST, virtual_host=RABBITMQ_VHOST, credentials=credentials  # type: ignore
        )
        self.connection = pika.BlockingConnection(connection_params)

        self.channel = self.connection.channel()

        self.channel.exchange_declare(exchange=RABBITMQ_USER_EXCHANGE, durable=True)
        result = self.channel.queue_declare(queue="", exclusive=True)
        self.callback_queue = result.method.queue
        self.channel.queue_bind(
            exchange=RABBITMQ_USER_EXCHANGE,
            queue=self.callback_queue,
            routing_key=f"{self.topic}.response",
        )

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True,
        )

        self.response = None
        self.corr_id = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange=RABBITMQ_USER_EXCHANGE,
            routing_key=f"{self.topic}.request",
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=json.dumps(n),
        )
        self.connection.process_data_events(time_limit=10)

        if self.response is None:
            return None
        else:
            return json.loads(self.response)
