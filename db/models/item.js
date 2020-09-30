'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    itemname: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    sold: { type: DataTypes.BOOLEAN, allowNull: false },
    photoUrl: { type: DataTypes.TEXT, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
  }, {});
  Item.associate = function (models) {
    // associations can be defined here
    Item.belongsTo(models.User, {
      as: "owner",
      foreignKey: "ownerId",
    });
  };
  return Item;
};