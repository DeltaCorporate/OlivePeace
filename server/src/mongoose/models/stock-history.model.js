import { Schema, model } from 'mongoose';

const StockHistorySchema = new Schema({
    productId: {
        type: String,
    },
    stock: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const StockHistory = model('StockHistory', StockHistorySchema);

export default StockHistory;

