import socket
from typing import TypeVar, Any
from pydantic import BaseModel
from pika.exceptions import AMQPConnectionError
from utility.logger import log
from utility.result import Err, Ok
from pika.adapters.blocking_connection import BlockingChannel
from pika import BlockingConnection
import pika
import json


T = TypeVar("T", bound=type(BaseModel))


class RabbitMqConnection:
    def publish_message(self, queue: str, message: str, success: bool = True) -> Err[str] | Ok[dict]:
        log.info(f"[{__name__}] -- Sending '{message}' to queue: '{queue}'")

        if success:
            log.info(f"[{__name__}] -- Message sent successfully")
            return Ok({"ok": "Success!"})
        else:
            log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
            return Err(
                "InternalCommunicationError",
                "Unable to communicate with RabbitMQ server.",
            )

    def consume_message(self, queue: str, message: str, response: dict, success: bool = True) -> Err[str] | Ok[dict]:
        log.info(f"Receiving '{message}' from queue: '{queue}'")

        if success:
            log.info(f"[{__name__}] -- Message consumed successfully")
            return Ok(response)
        else:
            log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
            return Err(
                "InternalCommunicationError",
                "Unable to communicate with RabbitMQ server.",
            )


    def publish_message_and_receive_response(self, queue: str, message: str, success: bool = True, response: dict = {}) -> Err[str] | Ok[dict]:
        log.info(f"[{__name__}] -- Sending '{message}' to queue: '{queue}' and waiting for a response")

        if success:
            log.info(f"[{__name__}] -- Received response '{response}'")
            return Ok(response)
        else:
            log.error(f"[{__name__}] -- Failed to communicate with RabbitMQ")
            return Err(
                "InternalCommunicationError",
                "Unable to communicate with RabbitMQ server.",
            )


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
