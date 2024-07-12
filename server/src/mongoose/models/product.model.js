import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    _id: String,
    name: String,
    brand: String,
    description: String,
    price: String,
    stock: String,
    slug: String,
    createdAt: Date,
    updatedAt: Date,
    promotionName: String,
    promotionValue: Number,
    productCategoryName: String,
},{versionKey: false});

const Product = model('Product', ProductSchema);

export default Product;
