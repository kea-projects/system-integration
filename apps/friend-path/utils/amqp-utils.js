import amqp from "amqplib/callback_api.js";
import { v4 as uuid } from "uuid";
import chalk from "chalk";

const host = process.env.RABBITMQ_HOST || "localhost";
const inviteExchange = process.env.RABBITMQ_INVITE_EXCHANGE || "invite";
const userExchange = process.env.RABBITMQ_USER_EXCHANGE || "friend-user-rpc";
const user = process.env.RABBITMQ_USER || "guest";
const password = process.env.RABBITMQ_PASSWORD || "guest";
const vhost = process.env.RABBITMQ_VHOST || "";

export const sendInvite = (message, onSuccess, onError) => {
  publishMessage(message, inviteExchange, onSuccess, onError);
};

export const userHasBeenInvited = (message, onSuccess, onError) => {
  message = 4;
  callProcedure(
    message,
    userExchange,
    "fib",
    (response) => {
      onSuccess(response);
    },
    onError
  );
};

export const test = (message, onSuccess, onError) => {
  callProcedure(
    message,
    userExchange,
    "game",
    (response) => {
      onSuccess(response);
    },
    onError
  );
};

const callProcedure = (message, exchange, topic, onSuccess, onError) => {
  const correlationId = uuid();
  amqp.connect(
    `amqp://${user}:${password}@${host}/${vhost}`,
    (error0, connection) => {
      if (error0) {
        console.error("Error0", error0);
        onError();
      }

      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error("Error1", error1);
          onError();
        }

        channel.assertExchange(exchange, "direct", { durable: true });
        channel.assertQueue("", { exclusive: true }, (error2, queue) => {
          if (error2) {
            console.error("Error2", error2);
          }

          channel.bindQueue(queue.queue, exchange, topic);
          channel.consume(
            queue.queue,
            (response) => {
              if (response.properties.correlationId == correlationId) {
                console.log(
                  chalk.yellowBright("Response:"),
                  chalk.blueBright(response),
                  chalk.yellowBright("received from exchange:"),
                  chalk.green(exchange),
                  chalk.yellowBright("on topic:"),
                  chalk.blueBright(topic)
                );
                onSuccess(response);
                setTimeout(function () {
                  connection.close();
                }, 500);
              }
            },
            { noAck: true }
          );

          channel.publish(exchange, topic, Buffer.from(message.toString()), {
            persistent: true,
            replyTo: queue.queue,
            correlationId: correlationId,
          });

          console.log(
            chalk.yellowBright("Message:"),
            chalk.blueBright(message),
            chalk.yellowBright("sent to exchange:"),
            chalk.green(exchange),
            chalk.yellowBright("on topic:"),
            chalk.blueBright(topic)
          );
        });
      });
    }
  );
};

const publishMessage = (message, exchange, onSuccess, onError) => {
  // Connect to the RabbitMQ server.
  amqp.connect(
    `amqp://${user}:${password}@${host}/${vhost}`,
    (error0, connection) => {
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
        console.log(
          chalk.yellowBright("Message:"),
          chalk.blueBright(message),
          chalk.yellowBright("sent to exchange:"),
          chalk.green(inviteExchange)
        );
        onSuccess();
      });

      // Disconnect from the RabbitMQ server.
      setTimeout(function () {
        connection.close();
      }, 500);
    }
  );
};
