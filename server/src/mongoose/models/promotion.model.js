import { Schema, model } from 'mongoose';

const PromotionSchema = new Schema({
    _id: String,
    name: String,
    value: Number,
    expirationDate: Date,
    createdAt: Date,
    updatedAt: Date
},{versionKey:false});

const Promotion = model('Promotion', PromotionSchema);

export default Promotion;
