'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const Product = (await import('../models/product.model.js')).default;
    const ProductImage = (await import('../models/product-image.model.js')).default;

    // Récupérer les IDs des produits
    const products = await Product.findAll({ attributes: ['id'] });
    const productIds = products.map(prod => prod.id);

    const bulkMedia = [];
    for (let i = 0; i < productIds.length; i++) {
      for (let j = 1; j <= 3; j++) {
        bulkMedia.push({
          productId: productIds[i],
          imageName: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
          displayOrder: j,
        });
      }
    }

    // Utiliser les modèles pour créer les enregistrements et activer les hooks
    for (const media of bulkMedia) {
      await ProductImage.create(media);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Connexion à MongoDB et importation des modèles
    const { mdb_connect } = await import('../../mongoose/index.js');
    await mdb_connect();

    const ProductImage = (await import('../models/product-image.model.js')).default;

    // Suppression des enregistrements avec hooks activés
    await ProductImage.destroy({
      where: {},
      truncate: true,
      cascade: true,
      individualHooks: true
    });
  }
};
