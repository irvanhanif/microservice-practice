const amqp = require("amqplib");

(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    let queueName = "technical";
    await channel.assertQueue(queueName, { durable: false });
    await channel.consume(
      queueName,
      (msg) => {
        console.log("Message: ", JSON.parse(msg.content.toString()));
      },
      { noAck: true }
    );
  } catch (error) {
    if (error) throw error;
  }
})();
