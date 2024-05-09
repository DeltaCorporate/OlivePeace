import ProductCategory from "./ProductCategory.js";

const { Model, DataTypes,NOW } = require('sequelize');
import db from './index.js';

class Promotion extends Model {}

Promotion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    expirationDate: { type: DataTypes.DATE, allowNull: false },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    }
}, {
    db,
    modelName: 'Promotion'
});

module.exports = Promotion;
