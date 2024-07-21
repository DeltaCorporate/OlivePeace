import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import User from "#app/src/sequelize/models/user.model.js";

class Cart extends Model {}

Cart.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
    modelName: 'Cart',
    underscored: true

});

Cart.belongsTo(User, { foreignKey: 'user_id' });

export default Cart;
