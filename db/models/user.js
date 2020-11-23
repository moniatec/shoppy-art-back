'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Item, {
      as: "owner",
      foreignKey: "ownerId",
    });
    User.hasMany(models.Order, {
      as: "user",
      foreignKey: "userId",
    });
  };

  User.prototype.validatePassword = function (password) {
    // because this is a model instance method, `this` is the user instance here:
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  return User;
};