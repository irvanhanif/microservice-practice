const { connect } = require("amqplib");

(async () => {
  const connection = await connect({
    hostname: "localhost",
  });
  const channel = await connection.createChannel();

  await channel.assertExchange("logExchange", "direct");

  const q = await channel.assertQueue("WarningAndErrorsQueue");

  await channel.bindQueue(q.queue, "logExchange", "Warning");
  await channel.bindQueue(q.queue, "logExchange", "Error");

  channel.consume(
    q.queue,
    (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log(data);
    },
    { noAck: true }
  );
})();
