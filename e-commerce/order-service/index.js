const { connect } = require("amqplib");
const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 9009;
const { order, orderListProduct } = require("./database/order");
order.sync();
orderListProduct.sync();

app.use(express.json());

const connectBroker = async () => {
  try {
    const connection = await connect({
      hostname: "localhost",
    });
    const channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
    return channel;
  } catch (error) {
    console.log("error order 1");
    console.log(error);
  }
};
// connectBroker().then(
(async () => {
  const channel = await connectBroker();
  await channel.consume(
    "ORDER",
    async (data) => {
      try {
        const { products, userEmail } = JSON.parse(data.content.toString());
        const productsId = products.map((product) => ({
          id_product: product.id,
        }));
        const newOrder = await order.create({
          user: userEmail,
          total_price: products.reduce(
            (total, product) => total + product.price,
            0
          ),
        });
        await orderListProduct.bulkCreate(
          productsId.map((product) => ({
            id_product: product.id_product,
            orderId: newOrder.id,
          }))
        );
        const orderData = await order.findOne({
          where: { id: newOrder.id },
          include: orderListProduct,
        });
        // console.log("newOrder");
        // console.log(orderData.toJSON());
        // await channel.assertQueue("PRODUCT");
        await channel.sendToQueue(
          "PRODUCT",
          Buffer.from(JSON.stringify({ orderData }))
        );
      } catch (error) {
        console.log("error order 2");
        console.log(error);
      }
    },
    {
      noAck: true,
    }
  );
})();
// );

app.listen(PORT, () => {
  console.log(`Order-service at ${PORT}`);
});
