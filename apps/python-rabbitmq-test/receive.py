#!/usr/bin/env python
import json
import os
import sys

import pika

messages = []


def print_user_object(user):
    print(f"user_name:  {user['user_name']}")
    print(f"age:  {user['age']}")
    print(f"is_adult:  {user['is_adult']}")
    print("-----------------------")


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))  # type: ignore
    channel = connection.channel()

    incoming_queue = "login-user"

    channel.queue_declare(queue=incoming_queue)


    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f" [x] received {message} from routing key: {method.__dict__['routing_key']}")
        messages.append(message)

    channel.basic_consume(queue=incoming_queue, auto_ack=True, on_message_callback=callback)

    print(" [ ] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()

    outgoing_queue = "login-user-res"
    channel.queue_declare(queue=outgoing_queue)

    bob = {"user_name": "bob", "age": 12, "token": "asdasd123asd1"}

    print("we here?")
    channel.basic_publish(exchange="", routing_key=outgoing_queue, body=json.dumps(bob))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupt detected, exiting...")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
