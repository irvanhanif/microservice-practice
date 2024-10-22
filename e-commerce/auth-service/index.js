const express = require("express");
const app = express();
const cors = require("cors");
const user = require("./database/user");
const PORT = process.env.PORT_ONE || 7070;
const { sign } = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

// register
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await user.findOne({ email });
    if (userExists) return res.json({ message: "user already exists" });

    const newUser = { email, password, name };
    const createUser = await user.create(newUser);

    return res.json(createUser);
  } catch (error) {
    return res.json({ message: error });
  }
});

// login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userLogin = await user.findOne({ email });
    if (!userLogin) return res.json({ message: "User doesnt exist" });
    if (password !== userLogin.password)
      return res.json({ message: "Password incorrect" });

    const payload = { email, name: userLogin.name };
    const token = await sign(payload, "secret");
    return res.json({ token });
  } catch (error) {
    return res.json({ message: error });
  }
});

app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
