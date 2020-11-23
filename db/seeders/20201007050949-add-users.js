'use strict';
const bcrypt = require("bcryptjs");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "User",
          email: "user@user.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Monia Techini',
          email: 'monia@test.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Cool user',
          email: 'cool@user.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Host',
          email: 'host@host.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'App academy',
          email: 'app@app.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'Guest',
          email: 'guest@guest.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "Demo User",
          email: "demoUser@demo.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
