import amqp from "amqplib/callback_api.js";
import "dotenv/config";

const inviteExchange = "invite";
const user = process.env.RABBITMQ_USER || "guest";
const password = process.env.RABBITMQ_PASSWORD || "guest";
// TODO: present the mock email service.

// Connect to the RabbitMQ server.
amqp.connect(
  `amqp://${user}:${password}@localhost/si`,
  (error0, connection) => {
    if (error0) {
      console.error("Error0", error0);
    }

    // Create a communication channel
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Error1", error1);
      }

      // Create, if not already existing, the invite exchange.
      // The `durable` attribute makes it so that the exchange does not get deleted
      // if the RabbitMQ server crashes
      channel.assertExchange(inviteExchange, "direct", { durable: true });
      channel.assertQueue("", { exclusive: true }, (error2, queue) => {
        if (error2) {
          console.error("Error2", error2);
        }

        // Set a limit to how many messages the client can receive before it acknowledges the current one. (The `1` value is completely arbitrary,
        // it should be discussed what value we should put in here.)
        channel.prefetch(1);

        // Binds to an auto-generated queue within the exchange.
        // The queue will be deleted once it is no longer used.
        channel.bindQueue(queue.queue, inviteExchange, "");

        // Consume a message once it is received.
        channel.consume(
          queue.queue,
          (message) => {
            setTimeout(() => {
              console.log(message.content.toString());
              // Acknowledge the message to let RabbitMQ know it has been received and consumed, thus it can be deleted.
              // If no ack is sent, RabbitMQ will continuously attempt to send this message until an ack is finally sent.
              channel.ack(message);
            }, 3000);
          },
          { noAck: false } // Enable acknowledgements.
        );
      });
    });
  }
);
