#!/usr/bin/env python
import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()

channel.queue_declare(queue="hello")
channel.queue_declare(queue="hi")

bob = {"user_name": "bob", "age": 12, "is_adult": False}
sam = {"user_name": "sam", "age": 25, "is_adult": True}
tom = {"user_name": "tom", "age": 18, "is_adult": True}
ann = {"user_name": "ann", "age": 1, "is_adult": False}

channels = ['hello', 'hi', 'hello', 'hi']

users = [bob, sam, tom, ann]

for user, ch in zip(users, channels):
    channel.basic_publish(exchange="", routing_key=ch, body=json.dumps(user))
    print(f"[X] Sent: '{user}'")


connection.close()
