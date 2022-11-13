import amqp from "amqplib/callback_api.js";

export const sendMessage = (message, onSuccess, onError) => {
  amqp.connect("amqp://localhost", (error0, connection) => {
    if (error0) {
      console.error("Error0", error0);
      onError();
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error("Error1", error1);
        onError();
      }

      const queue = "friend-path";
      channel.assertQueue(queue, { durable: false });

      channel.sendToQueue(queue, Buffer.from(message));
      console.log("Message: ", message, " sent to queue: ", queue);
      onSuccess();
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
};
