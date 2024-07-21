import OrderMongoose from '../../mongoose/models/order.model.js';
import Order from "../../sequelize/models/order.model.js";

export const denormalizeOrder = async (order) => {
    try {
        if(!(order instanceof Order))   {
            order = await Order.findByPk(order, {
                include: ['OrderDetails','User']
            });
        }

        if (!order) {
            console.error(`Order with id ${order} not found`);
            return;
        }


        const orderData = order.toJSON();
        let orderDetails = await order.getOrderDetails();
        let user = await order.getUser();
        if(orderDetails && user){
            orderData.orderDetails = orderDetails.map(detail => {
                return {
                    _id: detail.id,
                    productName: detail.productName,
                    price: detail.price,
                    quantity: detail.quantity,
                    imageName: detail.imageName,
                    productId: detail.ProductId,
                    promotion:{
                        name: detail.promotionName,
                        value: detail.promotionValue
                    },
                    createdAt: detail.createdAt,
                    updatedAt: detail.updatedAt
                };
            });
        }
        orderData.userId = user.id;
        orderData.price = await order.calculateTotalPrice();
        await OrderMongoose.findByIdAndUpdate(
            orderData.id,
            orderData,
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.error('Failed to denormalize order in MongoDB:', error);
    }
};