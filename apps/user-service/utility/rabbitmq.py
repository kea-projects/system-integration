import pika
from config.secrets import get_env

EXCHANGE = get_env("RABBITMQ_USER_EXCHANGE")
RABBITMQ_USERNAME = get_env("RABBITMQ_USER_SERVICE_USER")
RABBITMQ_PASSWORD = get_env("RABBITMQ_USER_SERVICE_PASSWORD")
RABBITMQ_HOST = get_env("RABBITMQ_HOST")
RABBITMQ_VHOST = get_env("RABBITMQ_VHOST")
RABBITMQ_USER_EXCHANGE = get_env("RABBITMQ_USER_EXCHANGE")


def subscribe(topic, callback):
    credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
    connection_params = pika.ConnectionParameters(
        host=RABBITMQ_HOST, virtual_host=RABBITMQ_VHOST, credentials=credentials  # type: ignore
    ) 
    connection = pika.BlockingConnection(connection_params)

    channel = connection.channel()

    channel.exchange_declare(exchange=EXCHANGE, durable=True)
    result = channel.queue_declare(queue="", exclusive=True)

    channel.basic_qos(prefetch_count=1)
    queue_name = result.method.queue
    channel.queue_bind(exchange=EXCHANGE, queue=queue_name, routing_key=f"{topic}.request")

    def on_request(ch, method, props, body):
        print(f"received request with body: '{body}' on exchange: '{method.__dict__['exchange']}'")
        properties = pika.BasicProperties(
                correlation_id=props.correlation_id,
                reply_to=props.reply_to
        )
        ch.basic_publish(
            exchange=EXCHANGE,
            routing_key=f"{topic}.response",
            properties=properties,
            body=callback(body),
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=queue_name, on_message_callback=on_request, auto_ack=False
    )
    print("channel.start_consuming being called")
    channel.start_consuming()
