'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Importations dynamiques pour les modèles ES6
    const ProductCategory = (await import('../models/product-category.js')).default;
    const Promotion = (await import('../models/promotion.js')).default;
    // Récupérer les IDs de ProductCategories et Promotions
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
        category_id: faker.helpers.arrayElement(categoryIds),
        promotion_id: promotionIds.length ? faker.helpers.arrayElement(promotionIds) : null,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('products', bulkProducts);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
