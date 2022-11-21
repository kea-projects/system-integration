import amqp from "amqplib/callback_api.js";
import users from "./users.json" assert { type: "json" };
import "dotenv/config";

const userExchange = "friend-user-rpc";
const user = process.env.RABBITMQ_USER || "guest";
const password = process.env.RABBITMQ_PASSWORD || "guest";

const subscribe = (topic, callback) => {
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
          channel.bindQueue(queue.queue, userExchange, `${topic}.request`);

          channel.consume(
            queue.queue,
            (message) => {
              console.log("consuming");
              setTimeout(() => {
                channel.sendToQueue(
                  message.properties.replyTo,
                  Buffer.from(callback(message)),
                  { correlationId: message.properties.correlationId }
                );

                channel.ack(message);
              }, 0);
            },
            { noAck: false }
          );
        });
      });
    }
  );
};

subscribe("user.check.invited", (message) => {
  console.log(message.content.toString());
  return JSON.parse(message.content.toString())["invitee"] === "user@non.com"
    ? Buffer.from("1")
    : Buffer.from("0");
});

subscribe("token.check.valid", (message) => {
  console.log(message.content.toString());
  return message.content.toString() ===
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQG5vLmNvbSJ9.2Al_e2IUwudRaUrq5YzvPnmxBnnw5jwb9pBa9BXUnP8"
    ? Buffer.from("0")
    : Buffer.from("1");
});

subscribe("user.get.friends", (message) => {
  console.log(message.content.toString());
  let response = JSON.stringify([]);

  const user = users.filter(
    (user) => user.email === message.content.toString()
  );

  if (user.length > 0) response = JSON.stringify(user[0].invites || []);

  console.log(response);
  return response;
});
