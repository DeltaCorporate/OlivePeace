import { Model, DataTypes } from 'sequelize';
import db from './index.js';
import User from './user.model.js';
import OrderDetail from "#app/src/sequelize/models/order-detail.model.js";
import OrderMongoose from "#app/src/mongoose/models/order.model.js";
import {denormalizeOrder} from "#app/src/services/denormalizations/order.denormalizer.js";

class Order extends Model {
    async calculateTotalPrice() {
        const orderDetails = await this.getOrderDetails();
        if(!orderDetails || orderDetails.length === 0) return 0;
        return orderDetails.reduce((total, detail) => {
            const price = detail.price * detail.quantity;
            const discount = price * (detail.promotionValue / 100);
            return total + (price - discount);
        }, 0);
    }

}

Order.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV7,
        primaryKey: true
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    paymentFailedMessage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryStatus: {
        type: DataTypes.ENUM('processing', 'shipping', 'delivered', 'delivery_issue'),
        defaultValue: 'processing'
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
    modelName: 'Order',
    underscored: true,
    hooks: {
        afterCreate: async (order) => {
            await denormalizeOrder(order);
        },
        afterUpdate: async (order) => {
            await denormalizeOrder(order);
        },
        afterDestroy: async (order) => {
            await OrderMongoose.findByIdAndDelete(order.id);
        }
    }
});
Order.hasMany(OrderDetail);
OrderDetail.belongsTo(Order);

export default Order;