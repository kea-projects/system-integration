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

"""
    rabbitmq.subscribe("user.decode.token", decode_auth_token)
    rabbitmq.subscribe("user.generate.token", generate_auth_token)
    rabbitmq.subscribe("user.create.account", create_new_user)
    rabbitmq.subscribe("user.create.pass.compare", compare_passwords)
"""


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
        self.connection.process_data_events(time_limit=2)

        if self.response is None:
            return None
        else:
            return json.loads(self.response)


# def publish(topic, message):
#     credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
#     connection_params = pika.ConnectionParameters(
#         host=RABBITMQ_HOST, virtual_host=RABBITMQ_VHOST, credentials=credentials  # type: ignore
#     )
#     connection = pika.BlockingConnection(connection_params)

#     channel = connection.channel()

#     channel.exchange_declare(exchange=RABBITMQ_USER_EXCHANGE, durable=True)
#     result = channel.queue_declare(queue="", exclusive=True)

#     channel.basic_qos(prefetch_count=1)
#     queue_name = result.method.queue
#     channel.queue_bind(exchange=RABBITMQ_USER_EXCHANGE, queue=queue_name, routing_key=f"{topic}.response")

#     def on_request(ch, method, props, body):
#         print("REQUEST ARRIVED!")
#         properties = pika.BasicProperties(
#                 correlation_id=props.correlation_id,
#                 reply_to=props.reply_to
#         )
#         ch.basic_publish(
#             exchange=RABBITMQ_USER_EXCHANGE,
#             routing_key=f"{topic}.request",
#             properties=properties,
#             body=message,
#         )
#         ch.basic_ack(delivery_tag=method.delivery_tag)

#     channel.basic_consume(
#         queue=queue_name, on_message_callback=on_request, auto_ack=False
#     )
#     print("CONSUME BEING CALLED")
#     channel.start_consuming()

# class RabbitMqConnection:
#     def publish_message(self, queue: str, message: str, success: bool = True) -> Err[str] | Ok[dict]:

#         log.info(f"[{__name__}] -- Sending '{message}' to queue: '{queue}'")

#         if success:
#             log.info(f"[{__name__}] -- Message sent successfully")
#             return Ok({"ok": "Success!"})
#         else:
#             log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
#             return Err(
#                 "InternalCommunicationError",
#                 "Unable to communicate with RabbitMQ server.",
#             )

#     def consume_message(self, queue: str, message: str, response: dict, success: bool = True) -> Err[str] | Ok[dict]:
#         log.info(f"Receiving '{message}' from queue: '{queue}'")

#         if success:
#             log.info(f"[{__name__}] -- Message consumed successfully")
#             return Ok(response)
#         else:
#             log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
#             return Err(
#                 "InternalCommunicationError",
#                 "Unable to communicate with RabbitMQ server.",
#             )


#     def publish_message_and_receive_response(self, queue: str, message: str, success: bool = True, response: dict = {}) -> Err[str] | Ok[dict]:
#         log.info(f"[{__name__}] -- Sending '{message}' to queue: '{queue}' and waiting for a response")

#         if success:
#             log.info(f"[{__name__}] -- Received response '{response}'")
#             return Ok(response)
#         else:
#             log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
#             return Err(
#                 "InternalCommunicationError",
#                 "Unable to communicate with RabbitMQ server.",
#             )


# class RabbitMqConnection:
#     host: str
#     connection: BlockingConnection
#     channel: BlockingChannel

#     def __init__(self, host: str) -> None:
#         self.host = host
#         try:
#             self.connection = pika.BlockingConnection(pika.ConnectionParameters(host))
#             self.channel = self.connection.channel()  # need to set
#             self.connection.close()
#         except AMQPConnectionError as error:
#             log.warn(f"Failed to connect to the RabbitMq Server.")

#     def publish_message(self, queue, message: T):
#         try:
#             self.connection = BlockingConnection(pika.ConnectionParameters(self.host))
#             self.channel = self.connection.channel()
#         except AMQPConnectionError as err:
#             log.error("Unable to reach RabbitMQ server!")
#             log.error(err.args[0])
#             return Err(
#                 "InternalCommunicationError",
#                 "Unable to communicate with RabbitMQ server.",
#             )

#         self.channel.queue_declare(queue=queue)

#         json_msg = json.dumps(message.__dict__)
#         self.channel.basic_publish(exchange="", routing_key=queue, body=json_msg)
#         return Ok("")

#     def consume_message(self, queue):
#         try:
#             self.connection = BlockingConnection(pika.ConnectionParameters(self.host))
#             self.channel = self.connection.channel()
#         except AMQPConnectionError as err:
#             log.error("Unable to reach RabbitMQ server!")
#             log.error(err.args[0])
#             return Err(
#                 "InternalCommunicationError",
#                 "Unable to communicate with RabbitMQ server.",
#             )
#         response = []

#         method_frame, header_frame, body = self.channel.basic_get(queue=queue)
#         print(method_frame, header_frame, body)
#         if method_frame is None:
#             self.connection.close()
#         else:
#             self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)
#             self.connection.close()
#             response.append(body)

#         return response
