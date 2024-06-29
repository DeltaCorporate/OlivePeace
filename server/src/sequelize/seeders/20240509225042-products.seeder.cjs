'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const ProductCategory = (await import('../models/product-category.model.js')).default;
    const Promotion = (await import('../models/promotion.model.js')).default;
    const Product = (await import('../models/product.model.js')).default;

    const categories = await ProductCategory.findAll({ attributes: ['id'] });
    const categoryIds = categories.map(cat => cat.id);

    const promotions = await Promotion.findAll({ attributes: ['id'] });
    const promotionIds = promotions.map(promo => promo.id);

    const bulkProducts = [];
    for (let i = 1; i <= 20; i++) {
      bulkProducts.push({
        name: faker.commerce.productName(),
        brand: faker.company.name(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        productCategoryId: faker.helpers.arrayElement(categoryIds),
        promotionId: promotionIds.length ? faker.helpers.arrayElement(promotionIds) : null,
      });
    }

    for (const product of bulkProducts) {
      await Product.create(product);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Product = (await import('../models/product.model.js')).default;

    await Product.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
