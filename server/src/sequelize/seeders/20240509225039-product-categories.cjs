'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Promotion = (await import('../models/promotion.js')).default;
    const ProductCategory = (await import('../models/product-category.js')).default;

    // Récupérer les IDs des promotions
    const promotions = await Promotion.findAll({ attributes: ['id'] });
    const promotionIds = promotions.map(promo => promo.id);

    const bulkCategories = [];
    for (let i = 1; i <= 20; i++) {
      bulkCategories.push({
        name: faker.commerce.department(),
        imageName: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
        description: faker.commerce.productDescription(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        promotion_id: promotionIds.length ? faker.helpers.arrayElement(promotionIds) : null,
      });
    }

    // Utiliser les modèles pour créer les enregistrements et activer les hooks
    for (const category of bulkCategories) {
      await ProductCategory.create(category);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const ProductCategory = (await import('../models/product-category.js')).default;

    // Suppression des enregistrements sans désactivation des vérifications des clés étrangères
    await ProductCategory.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
