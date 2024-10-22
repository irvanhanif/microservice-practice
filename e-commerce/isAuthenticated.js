const { verify } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    const user = await verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    return res.json({ message: error });
  }
};
