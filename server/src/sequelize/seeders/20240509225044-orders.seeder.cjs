'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const Order = (await import('../models/order.model.js')).default;
        const User = (await import('../models/user.model.js')).default;

        const users = await User.findAll();
        const orders = [];

        for (let i = 0; i < 10; i++) {
            orders.push({
                id: faker.string.uuid(),
                UserId: faker.helpers.arrayElement(users).id,
                isPaid: faker.datatype.boolean(),
                paymentFailedMessage: faker.datatype.boolean() ? faker.lorem.sentence() : null,
                deliveryStatus: faker.helpers.arrayElement(['processing', 'shipping', 'delivered', 'delivery_issue']),
                createdAt: faker.date.past(),
                updatedAt: new Date()
            });
        }

        for (const orderData of orders) {
            await Order.create(orderData);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const Order = (await import('../models/order.model.js')).default;
        await Order.destroy({ where: {}, truncate: true, cascade: true, individualHooks: true });
    }
};