'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bulkPromotions = [];

    for (let i = 1; i <= 3; i++) {
      bulkPromotions.push({
        name: faker.lorem.word(),
        value: faker.number.int({min: 5, max: 30}),
        expirationDate: faker.date.future(), // camelCase and confirmed method
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Promotions', bulkPromotions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Promotions', null, {});
  }
};
