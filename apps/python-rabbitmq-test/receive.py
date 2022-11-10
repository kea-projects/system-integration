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

    channel.queue_declare(queue="hello")
    channel.queue_declare(queue="hi")

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f" [x] received {message} from routing key: {method.__dict__['routing_key']}")
        messages.append(message)

    channel.basic_consume(queue="hello", auto_ack=True, on_message_callback=callback)
    channel.basic_consume(queue="hi", auto_ack=True, on_message_callback=callback)

    print(" [ ] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupt detected, exiting...")
        try:
            sys.exit(0)
        except SystemExit:
            for message in messages:
                print_user_object(message)
            os._exit(0)
