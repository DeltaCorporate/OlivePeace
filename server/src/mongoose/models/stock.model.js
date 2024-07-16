import { Schema, model } from 'mongoose';

const StockSchema = new Schema({
    _id: String,
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Stock = model('Stock', StockSchema);

export default Stock;
