'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Promotion = (await import('../models/promotion.model.js')).default;

    const bulkPromotions = [];
    for (let i = 1; i <= 20; i++) {
      bulkPromotions.push({
        name: faker.lorem.word(),
        value: faker.number.int({ min: 5, max: 100 }),
        expirationDate: faker.date.future(),
      });
    }

    for (const promotion of bulkPromotions) {
      await Promotion.create(promotion);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Promotion = (await import('../models/promotion.model.js')).default;

    await Promotion.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
