import os
import sys
import pika
import json

messages = []


def print_user_object(user):
    print(f"user_name:  {user['user_name']}")
    print(f"age:  {user['age']}")
    print(f"is_adult:  {user['is_adult']}")


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="hello")

    def callback(channel, method, properties, body):
        message = json.loads(body)
        print(f" [x] received {message}")
        messages.append(message)

    channel.basic_consume(queue="hello", auto_ack=True, on_message_callback=callback)

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
