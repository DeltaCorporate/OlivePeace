import mongoose from "mongoose";

const { Schema } = mongoose;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    reserved: {
        type: Boolean,
        default: false
    },
    reservationExpiry: {
        type: Date
    }
});

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour mettre à jour la date de mise à jour
CartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Définition des index
CartSchema.index({ user: 1 });
CartSchema.index({ "items.reservationExpiry": 1 });

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;