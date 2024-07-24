'use strict';
const {DataTypes} = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
      city: {
            type: Sequelize.STRING,
            allowNull: false,
        },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['ROLE_USER']
      },
      confirmation_token: {
        type: Sequelize.STRING,
      },
      confirmation_token_expires_at: {
        type: Sequelize.DATE,
      },
      reset_password_token: {
        type: Sequelize.STRING,
      },
      reset_password_expires_at: {
        type: Sequelize.DATE,
      },
      last_password_change_at: {
        type: Sequelize.DATE,
      },
      failed_login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      lock_until_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};