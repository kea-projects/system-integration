import pika

# TODO: Make take from vars env
exchange = "friend-user-rpc"


def subscribe(topic, callback):
    credentials = pika.PlainCredentials(
        "user-service", "2f04f62d-95e9-4cbe-8699-ba0c5b6d9cfa"
    )
    # TODO: ENVS
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost", virtual_host="si", credentials=credentials)) 
    
    

    channel = connection.channel()

    channel.exchange_declare(exchange=exchange, durable=True)
    result = channel.queue_declare(queue="", exclusive=True)

    channel.basic_qos(prefetch_count=1)
    print("IDK 1: ", result.method.queue)
    queue_name = result.method.queue
    channel.queue_bind(exchange=exchange, queue=queue_name, routing_key=f"{topic}.request")

    def on_request(ch, method, props, body):
        print(f"{__name__} has been called")
        print(f"Body is {body}")
        print(f"props.: {props.reply_to}")
        ch.basic_publish(
            exchange=exchange,
            routing_key=f"{topic}.response",
            properties=pika.BasicProperties(correlation_id=props.correlation_id, reply_to=props.reply_to),
            body=callback(body),
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=queue_name, on_message_callback=on_request, auto_ack=False
    )
    channel.start_consuming()
