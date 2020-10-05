'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    Order.hasMany(models.Item, {
      as: "order",
      foreignKey: "orderId",
    });
  };
  return Order;
};