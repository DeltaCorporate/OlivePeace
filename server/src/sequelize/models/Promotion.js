import { Model, DataTypes,NOW } from 'sequelize';
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
    sequelize: db.sequelize,
    modelName: 'Promotion'
});

export default Promotion;
