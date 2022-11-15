import amqp from "amqplib/callback_api.js";
import chalk from "chalk";

const host = process.env.RABBITMQ_HOST || "localhost";
const inviteExchange = process.env.RABBITMQ_INVITE_EXCHANGE || "invite";

export const sendInvite = (message, onSuccess, onError) => {
  publishMessage(
    message,
    inviteExchange,
    () => {
      console.log(
        chalk.yellowBright("Message:"),
        chalk.blueBright(message),
        chalk.yellowBright("sent to exchange:"),
        chalk.green(inviteExchange)
      );
      onSuccess();
    },
    onError
  );
};

const publishMessage = (message, exchange, onSuccess, onError) => {
  // Connect to the RabbitMQ server.
  amqp.connect(`amqp://${host}`, (error0, connection) => {
    if (error0) {
      console.error("Error0", error0);
      onError();
    }

    // Create communication channel.
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Error1", error1);
        onError();
      }

      // Create, if not already existing, the invite exchange.
      // The `durable` attribute makes it so that the exchange does not get deleted
      // if the RabbitMQ server crashes
      channel.assertExchange(exchange, "direct", { durable: true });

      // Publish the message to all the queues of the given exchange.
      // The `persistent` attribute makes it so that the message will be saved until it is consumed,
      // so it will not be lost if the RabbitMQ server crashes.
      channel.publish(exchange, "", Buffer.from(message), {
        persistent: true,
      });

      // Execute the callback once the message has been published.
      onSuccess();
    });

    // Disconnect from the RabbitMQ server.
    setTimeout(function () {
      connection.close();
    }, 500);
  });
};
