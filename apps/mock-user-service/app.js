import amqp from "amqplib/callback_api.js";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) {
    console.error("Error0", error0);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error("Error1", error1);
    }

    const queue = "friend-path";
    channel.assertQueue(queue, { durable: false });

    channel.consume(
      queue,
      (message) => {
        console.log(message.content.toString());
      },
      { noAck: true }
    );
  });
});
