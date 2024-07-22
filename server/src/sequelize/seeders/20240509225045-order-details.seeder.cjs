'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const OrderDetail = (await import('../models/order-detail.model.js')).default;
        const Order = (await import('../models/order.model.js')).default;
        const Product = (await import('../models/product.model.js')).default;
        const Promotion = (await import('../models/promotion.model.js')).default;

        const orders = await Order.findAll();
        const products = await Product.findAll({
            include: [{
                model: Promotion,
                as: 'Promotion'
            }]
        });

        for (const order of orders) {
            const selectedProducts = faker.helpers.arrayElements(products, 7);
            for (const product of selectedProducts) {
                const promotion = product.Promotion;
                await OrderDetail.create({
                    id: faker.string.uuid(),
                    OrderId: order.id,
                    ProductId: product.id,
                    productName: product.name,
                    price: parseFloat(product.price),
                    quantity: faker.number.int({ min: 1, max: 5 }),
                    imageName: product.imageName,
                    promotionName: promotion ? promotion.name : null,
                    promotionValue: promotion ? promotion.value : null,
                    createdAt: order.createdAt,
                    updatedAt: order.createdAt
                });
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const OrderDetail = (await import('../models/order-detail.model.js')).default;
        await OrderDetail.destroy({ where: {}, truncate: true, cascade: true, individualHooks: true });
    }
};