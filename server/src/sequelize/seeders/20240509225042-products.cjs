'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const ProductCategory = (await import('../models/product-category.js')).default;
    const Promotion = (await import('../models/promotion.js')).default;
    const Product = (await import('../models/product.js')).default;

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
      });
    }

    // Utiliser les modèles pour créer les enregistrements et activer les hooks
    for (const product of bulkProducts) {
      await Product.create(product);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Product = (await import('../models/product.js')).default;

    // Suppression des enregistrements sans désactivation des vérifications des clés étrangères
    await Product.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
