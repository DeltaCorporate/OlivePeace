'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();
      const { generateRandomString } = await import('../../utils/string.util.js');
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
        imageName: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
        slug: faker.helpers.slugify(generateRandomString(15)),
        ProductCategoryId: faker.helpers.arrayElement(categoryIds),
        PromotionId: faker.helpers.arrayElement(promotionIds)
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
