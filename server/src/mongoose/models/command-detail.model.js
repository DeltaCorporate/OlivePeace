import { Schema } from 'mongoose';

const CommandDetailSchema = new Schema({
    _id: String,
    price: Number,
    quantity: Number,
    imageName: String,
    promotionName: String,
    promotionValue: Number,
    createdAt: Date,
    updatedAt: Date
});

export default CommandDetailSchema;
