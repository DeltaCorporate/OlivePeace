import mongoose from "mongoose";

const { Schema } = mongoose;

const CartItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    reservedUntil: { type: Date, required: true }
});

const CartSchema = new Schema({
    userId: { type: String, required: true },
    items: [CartItemSchema]
});

CartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

CartSchema.index({ user: 1 });
CartSchema.index({ "items.reservationExpiry": 1 });

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;