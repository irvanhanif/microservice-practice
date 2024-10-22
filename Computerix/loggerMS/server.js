const express = require("express");
const Producer = require("./producer");

const app = express();
const producer = new Producer();
const port = 3000;

app.use(express.json());

app.post("/send-log", async (req, res) => {
  const { logType, message } = req.body;
  try {
    await producer.publishMessage(logType, message);
    res.send();
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server start at ${port}`);
});
