'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { generateRandomString } = await import('../../utils/string.util.js');
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Promotion = (await import('../models/promotion.model.js')).default;
    const ProductCategory = (await import('../models/product-category.model.js')).default;

    const promotions = await Promotion.findAll();
    const promotionIds = promotions.map(promo => promo.id);

    const bulkCategories = [];
    for (let i = 1; i <= 20; i++) {
      bulkCategories.push({
        name: faker.commerce.department(),
        imageName: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
        description: faker.commerce.productDescription(),
        slug: faker.helpers.slugify(generateRandomString(15)),
        promotionId: promotionIds.length ? faker.helpers.arrayElement(promotionIds) : null,
      });
    }

    for (const category of bulkCategories)
      await ProductCategory.create(category);

  },

  down: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const ProductCategory = (await import('../models/product-category.model.js')).default;

    await ProductCategory.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
