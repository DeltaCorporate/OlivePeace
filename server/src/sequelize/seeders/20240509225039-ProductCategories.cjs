'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Importations dynamiques pour le modèle Promotion
    const Promotion = (await import('../models/Promotion.js')).default;

    // Récupérer les IDs des promotions
    const promotions = await Promotion.findAll({ attributes: ['id'] });
    const promotionIds = promotions.map(promo => promo.id);

    const bulkCategories = [];
    for (let i = 1; i <= 5; i++) {
      bulkCategories.push({
        name: faker.commerce.department(),
        image_name: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
        description: faker.commerce.productDescription(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        promotion_id: promotionIds.length ? faker.helpers.arrayElement(promotionIds) : null, // Utilise un ID de promotion existant ou null
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('product_categories', bulkCategories);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};
