'use strict';
const faker= require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Importer le modèle Sequelize si nécessaire
    const Product = (await import('../models/Product.js')).default;

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
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('ProductImages', bulkMedia);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductImages', null, {});
  }
};
