'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bulkPromotions = [];

    for (let i = 1; i <= 3; i++) {
      bulkPromotions.push({
        name: faker.lorem.word(),
        value: faker.number.int({min: 5, max: 30}),
        expiration_date: faker.date.future(), // camelCase and confirmed method
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('promotions', bulkPromotions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('promotions', null, {});
  }
};
