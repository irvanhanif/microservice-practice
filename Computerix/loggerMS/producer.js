const amqp = require("amqplib");
const config = require("./config");

class Producer {
  // constructor() {
  //   this.channel = "tes";
  // }

  async createChannel() {
    try {
      const connection = await amqp.connect(config.rabbitMQ.url);
      this.channel = await connection.createChannel();
    } catch (error) {
      return new Error(error);
    }
  }

  async publishMessage(routingKey, message) {
    try {
      if (!this.channel) {
        await this.createChannel();
      }
      const exchangeName = config.rabbitMQ.exchangeName;
      await this.channel.assertExchange(exchangeName, "direct");

      await this.channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(
          JSON.stringify({
            logType: routingKey,
            message: message,
            dateTime: new Date(),
          })
        )
      );
      console.log(
        `The new ${routingKey} log is sent to exchange ${exchangeName}`
      );
    } catch (error) {
      return new Error(error);
    }
  }
}

module.exports = Producer;
