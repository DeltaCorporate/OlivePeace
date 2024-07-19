'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('commande_details', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV7,
                primaryKey: true
            },
            commande_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'commandes',
                    key: 'id'
                }
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            image_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            promotion_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            promotion_value: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('commande_details');
    }
};