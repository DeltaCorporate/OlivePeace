import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import db from './index.js';
import jwt from "jsonwebtoken";
import {generateToken} from "#app/src/utils/string.util.js";
import Order from "#app/src/sequelize/models/order.model.js";
import {denormalizeUser} from "#app/src/services/denormalizations/user.denormalizer.js";
import UserMongoose from "#app/src/mongoose/models/user.model.js";
class User extends Model {
    static async hashPassword(password) {
        return bcrypt.hash(password, 12);
    }

    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    generateJwtToken() {
        return jwt.sign(
            { id: this.id, email: this.email, roles: this.roles },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION,algorithm: 'HS256' }
        );
    }
    isLoginLocked(){
        return this.lockUntilAt && Date.now() < this.lockUntilAt;
    }
    isConfirmed() {
        return this.confirmationToken === null;
    }
    isConfirmationTokenExpired(){
        if(this.isConfirmed()) return false;
        return this.confirmationTokenExpiresAt <= Date.now();
    }
    regenerateConfirmationToken(){
        this.confirmationToken = generateToken(20);
        this.confirmationTokenExpiresAt = User.generateConfirmationTokenExpirationDate();
        return this;
    }
    regeneratePasswordToken(){
        this.resetPasswordToken = generateToken(20);
        this.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;
    }
    clearResetPasswordToken(){
        this.resetPasswordToken = null;
        this.resetPasswordExpiresAt = null;
        this.lastPasswordChangeAt = new Date();
    }
    resetLoginAttempt(){
        this.failedLoginAttempts = 0;
        this.lockUntilAt = null;
    }
    validateConfirmationToken() {
        this.confirmationToken = null;
        this.confirmationTokenExpiresAt = null;
    }
    static generateConfirmationTokenExpirationDate(){
        return new Date(Date.now() + 15 * 60 * 1000);
    }
    async anonymize(){
        this.email = `deleted_${generateToken(10)}@${generateToken(15)}.com`;
        this.firstName = generateToken(10);
        this.zipCode = generateToken(5);
        this.address = generateToken(10);
        this.city = generateToken(10);
        this.lastName = generateToken(10);
        this.password = await User.hashPassword(generateToken(20));
        this.roles = ['ROLE_USER'];
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['ROLE_USER'],
    },
    confirmationToken: {
        type: DataTypes.STRING,
    },
    confirmationTokenExpiresAt: {
        type: DataTypes.DATE,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpiresAt: {
        type: DataTypes.DATE,
    },
    lastPasswordChangeAt: {
        type: DataTypes.DATE,
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lockUntilAt: {
        type: DataTypes.DATE,
    },
}, {
    sequelize: db.sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true, // Ceci assure que Sequelize convertira automatiquement camelCase en snake_case pour les noms de colonnes
    hooks: {
        beforeCreate: async (user) => {
            user.password = await User.hashPassword(user.password);

        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await User.hashPassword(user.password);
                user.lastPasswordChangeAt = new Date();
            }
        },
        afterCreate: async (user) => {
            await denormalizeUser(user);
        },
        afterUpdate: async (user) => {
            await denormalizeUser(user);
        },

    },
});

User.hasMany(Order);
Order.belongsTo(User);
export default User;