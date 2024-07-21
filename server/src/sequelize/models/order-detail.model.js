import { Model, DataTypes } from 'sequelize';
import db from './index.js';
import Order from './order.model.js';
import Product from "#app/src/sequelize/models/product.model.js";
import {denormalizeOrder} from "#app/src/services/denormalizations/order.denormalizer.js";

class OrderDetail extends Model {}

OrderDetail.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV7,
        primaryKey: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    promotionName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    promotionValue: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: db.sequelize,
    modelName: 'OrderDetail',
    underscored: true,
    hooks: {
        afterCreate: async (orderDetail) => {
            await denormalizeOrder(orderDetail.OrderId);
        },
        afterUpdate: async (orderDetail) => {
            await denormalizeOrder(orderDetail.OrderId);
        },
        afterDestroy: async (orderDetail) => {
            await denormalizeOrder(orderDetail.OrderId);
        }
    }
});

export default OrderDetail;