'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const User = (await import('../models/user.model.js')).default;
        const { randomDate } = await import('../../utils/string.util.js');
        const users = [
            {
                id: faker.string.uuid(),
                email: 'jawad.ahmindache@gmail.com',
                password: 'Test123456789@',
                firstName: 'Admin',
                lastName: 'User',
                roles: ['ROLE_ADMIN', 'ROLE_USER'],
                lastPasswordChangeAt: new Date(),
            }
        ];

        // Créer 10 utilisateurs réguliers
        for (let i = 0; i < 20; i++) {
            let createdDate = randomDate(2021,2024);
            users.push({
                id: faker.string.uuid(),
                email: faker.internet.email(),
                password: 'Test123456789@', // Utiliser un mot de passe fort par défaut
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                roles: ['ROLE_USER'],
                lastPasswordChangeAt: new Date(),
                createdAt: createdDate,
                updatedAt: createdDate
            });
        }

        for (const userData of users) {
            await User.create(userData);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const { mdb_connect } = await import('../../mongoose/index.js');
        await mdb_connect();
        const User = (await import('../models/user.model.js')).default;
        await User.destroy({
            where: {},
            truncate: true,
            cascade: true,
            individualHooks: true
        });
    }
};