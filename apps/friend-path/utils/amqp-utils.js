import amqp from "amqplib/callback_api.js";
import chalk from "chalk";
import { v4 as uuid } from "uuid";

const host = process.env.RABBITMQ_HOST || "localhost";
const inviteExchange = process.env.RABBITMQ_INVITE_EXCHANGE || "invite";
const userExchange = process.env.RABBITMQ_USER_EXCHANGE || "friend-user-rpc";
const user = process.env.RABBITMQ_USER || "guest";
const password = process.env.RABBITMQ_PASSWORD || "guest";
const vhost = process.env.RABBITMQ_VHOST || "";

/** Invites the email to the user's friends list
 *  Message structure:
 *  {
 *    "invitee": "string",
 *    "invited": "string"
 *   }
 */
export const sendInvite = (message, onSuccess, onError) => {
  publishMessage(JSON.stringify(message), inviteExchange, onSuccess, onError);
};

/** Checks if the user has invited the given email address
 *  Message structure:
 *  {
 *    "invitee": "string",
 *    "invited": "string"
 *   }
 *
 *  Response structure:
 *  "number" -> 0 || 1
 */
export const checkUserIsInvited = (message, onSuccess, onError) => {
  callProcedure(
    JSON.stringify(message),
    userExchange,
    "user.check.invited",
    (response) => onSuccess(response),
    onError
  );
};

/** Checks if the token is valid or not.
 *  Message structure:
 *  "string"
 *
 *  Response structure:
 *  "number" -> 0 || 1
 */
export const checkTokenIsValid = (message, onSuccess, onError) => {
  callProcedure(
    message,
    userExchange,
    "token.check.valid",
    (response) => onSuccess(response),
    onError
  );
};

/** Gets the list of the given user's friends.
 *  Message structure:
 *  "string"
 *
 *  Response structure:
 *  [
 *    {
 *      "email": "string",
 *      "isRegistered": "boolean"
 *    },
 *    {
 *      ...
 *    },
 *    ...
 *  ]
 *
 */
export const getUserFriends = (message, onSuccess, onError) => {
  callProcedure(
    message,
    userExchange,
    "user.get.friends",
    (response) => onSuccess(response),
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
            onError();
          }

          channel.bindQueue(queue.queue, exchange, `${topic}.response`);
          channel.consume(
            queue.queue,
            (response) => {
              if (response.properties.correlationId == correlationId) {
                console.log(
                  chalk.yellowBright("Response:"),
                  chalk.blueBright(response.content),
                  chalk.yellowBright("received from exchange:"),
                  chalk.green(exchange),
                  chalk.yellowBright("on topic:"),
                  chalk.blueBright(`${topic}.response`)
                );
                onSuccess(response);
                setTimeout(function () {
                  connection.close();
                }, 500);
              }
            },
            { noAck: true }
          );

          try {
            channel.publish(
              exchange,
              `${topic}.request`,
              Buffer.from(message),
              {
                persistent: true,
                replyTo: queue.queue,
                correlationId: correlationId,
              }
            );
            console.log(
              chalk.yellowBright("Message:"),
              chalk.blueBright(message),
              chalk.yellowBright("sent to exchange:"),
              chalk.green(exchange),
              chalk.yellowBright("on topic:"),
              chalk.blueBright(`${topic}.request`)
            );
          } catch (error) {
            console.error("Error", error);
            onError();
          }
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
        try {
          channel.publish(exchange, "", Buffer.from(message), {
            persistent: true,
          });
        } catch (error) {
          console.error("Error", error);
          onError();
        }

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
