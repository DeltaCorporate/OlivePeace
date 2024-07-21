import { Schema, model } from 'mongoose';


const OrderDetailSchema = new Schema({
    _id: String,
    price: Number,
    quantity: Number,
    imageName: String,
    productName: String,
    productId: Number,
    promotion: {
        name: String,
        value: Number
    },
    createdAt: Date,
    updatedAt: Date
});
const OrderSchema = new Schema({
    _id: String,
    userId: String,
    isPaid: Boolean,
    paymentFailedMessage: String,
    deliveryStatus: String,
    orderDetails: [OrderDetailSchema],
    price: Number,
    createdAt: Date,
    updatedAt: Date
}, { versionKey: false });

const Order = model('Order', OrderSchema);

export default Order;