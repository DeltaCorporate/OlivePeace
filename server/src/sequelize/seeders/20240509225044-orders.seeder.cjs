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
        const { randomDate } = await import('../../utils/string.util.js');

        for (let i = 0; i < 30; i++) {
            let createdDate = randomDate(2023, 2024);
            let deliveryStatus = faker.helpers.arrayElement(['processing', 'shipping', 'delivered', 'delivery_issue']);
            let isPaid = ( deliveryStatus == "shipping" ||  deliveryStatus == "delivered") ? true : false;
            let paymentFailedMessage = (deliveryStatus == "processing" && faker.datatype.boolean() == true) ? "Payment failed" : null;
            orders.push({
                id: faker.string.uuid(),
                UserId: faker.helpers.arrayElement(users).id,
                isPaid: isPaid,
                paymentFailedMessage: paymentFailedMessage,
                deliveryStatus: deliveryStatus,
                createdAt: createdDate,
                updatedAt: createdDate
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