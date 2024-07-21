'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV7,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      payment_failed_message: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delivery_status: {
        type: Sequelize.ENUM('processing', 'shipping', 'delivered', 'delivery_issue'),
        defaultValue: 'processing'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};