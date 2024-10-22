const amqp = require("amqplib");

(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    let queueName = "technical",
      message = "this is technical magician";
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ queueName, message }))
    );
    await channel.close();
    process.exit();
  } catch (error) {
    if (error) throw error;
  }
})();
