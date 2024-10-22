const { connect } = require("amqplib");
const express = require("express");
const app = express();
const isAuthenticated = require("../isAuthenticated");

const PORT = process.env.PORT_ONE || 8080;
const product = require("./database/product");
product.sync();

app.use(express.json());
let orderList;

const connectBroker = async () => {
  try {
    const connection = await connect({
      hostname: "localhost",
    });
    const channel = await connection.createChannel();
    channel.assertQueue("PRODUCT");
    return channel;
  } catch (error) {
    console.log("error product 1");
    console.log(error);
  }
};

app.post("/product/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newProduct = await product.create({
      name,
      description,
      price,
    });
    return res.json(newProduct);
  } catch (error) {
    return res.json(error);
  }
});

app.post("/product/buy", isAuthenticated, async (req, res) => {
  const { ids } = req.body;
  // let orderList;
  try {
    const products = await product.findAll({ where: { id: ids } });

    const channel = await connectBroker();
    await channel.sendToQueue(
      "ORDER",
      Buffer.from(JSON.stringify({ products, userEmail: req.user.email }))
    );

    // await channel.assertQueue("PRODUCT");
    await channel.consume(
      "PRODUCT",
      (data) => {
        const { orderData } = JSON.parse(data.content.toString());
        console.log("orderData");
        orderList = orderData;
        console.log("orderList 1");
        console.log(orderList);
        // return orderList;
        // return res.json(orderData);
      },
      { noAck: true }
    );
    console.log("orderList 2");
    console.log(orderList);
    // console.log(dataOrder);
    // setTimeout(() => {
    //   return res.status(201).json({ orderList });
    // }, 1000);
    if (orderList) {
      return res.status(201).json({ orderList });
    }
    // console.log("order");
  } catch (error) {
    console.error("error product 2");
    console.error(error);
    // return res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Product-service at ${PORT}`);
});
