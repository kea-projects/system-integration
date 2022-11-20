#!/usr/bin/env python
import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
outgoing_queue = "login-user-res"
channel.queue_declare(queue=outgoing_queue)

bob = {"user_name": "bob", "age": 12, "token": "asdasd123asd1"}


channel.basic_publish(exchange="", routing_key=outgoing_queue, body=json.dumps(bob))
print(f"sent: '{bob}' on queue: {outgoing_queue}")

connection.close()
