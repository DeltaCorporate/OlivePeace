'use strict';
const faker= require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Importer le modèle Sequelize si nécessaire
    const Product = (await import('../models/product.js')).default;

    // Récupérer les IDs des produits
    const products = await Product.findAll({ attributes: ['id'] });
    const productIds = products.map(prod => prod.id);

    const bulkMedia = [];
    for (let i = 0; i < productIds.length; i++) {
      for (let j = 1; j <= 3; j++) {
        bulkMedia.push({
          product_id: productIds[i],
          image_name: ['test1.jpg', 'test2.webp', 'test3.webp'][Math.floor(Math.random() * 3)],
          display_order: j,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('product_images', bulkMedia);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_images', null, {});
  }
};
