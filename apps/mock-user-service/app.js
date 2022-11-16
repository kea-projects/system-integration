import amqp from "amqplib/callback_api.js";
import "dotenv/config";

const userExchange = "friend-user-rpc";
const user = process.env.RABBITMQ_USER || "guest";
const password = process.env.RABBITMQ_PASSWORD || "guest";

amqp.connect(
  `amqp://${user}:${password}@localhost/si`,
  (error0, connection) => {
    if (error0) {
      console.error("Error0", error0);
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Error1", error1);
      }

      channel.assertExchange(userExchange, "direct", { durable: true });
      channel.assertQueue("", { exclusive: true }, (error2, queue) => {
        if (error2) {
          console.error("Error2", error2);
        }

        channel.prefetch(1);
        channel.bindQueue(queue.queue, userExchange, "fib.request");

        channel.consume(
          queue.queue,
          (message) => {
            setTimeout(() => {
              const content = message.content.toString();
              console.log(content);

              const response = fibonacci(content);

              channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(response.toString()),
                { correlationId: message.properties.correlationId }
              );

              channel.ack(message);
            }, 3000);
          },
          { noAck: false }
        );
      });
    });
  }
);

amqp.connect(
  `amqp://${user}:${password}@localhost/si`,
  (error0, connection) => {
    if (error0) {
      console.error("Error0", error0);
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Error1", error1);
      }

      channel.assertExchange(userExchange, "direct", { durable: true });
      channel.assertQueue("", { exclusive: true }, (error2, queue) => {
        if (error2) {
          console.error("Error2", error2);
        }

        channel.prefetch(1);
        channel.bindQueue(queue.queue, userExchange, "game.request");

        channel.consume(
          queue.queue,
          (message) => {
            setTimeout(() => {
              const content = message.content.toString();
              console.log(content);

              const response = "pong";

              channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(response.toString()),
                { correlationId: message.properties.correlationId }
              );

              channel.ack(message);
            }, 3000);
          },
          { noAck: false }
        );
      });
    });
  }
);

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
