const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

const orderListProduct = sequelize.define("order_product_id", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

order.hasMany(orderListProduct);
orderListProduct.belongsTo(order);

module.exports = { order, orderListProduct };
