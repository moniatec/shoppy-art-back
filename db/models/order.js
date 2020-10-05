'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    total: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  }, {});
  order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    User.hasMany(models.Item, {
      as: "order",
      foreignKey: "orderId",
    });
  };
  return order;
};