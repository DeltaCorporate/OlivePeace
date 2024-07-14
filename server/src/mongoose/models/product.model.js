import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    _id: String,
    name: String,
    brand: String,
    description: String,
    price: Number,
    discountedPrice: Number,
    stock: Number,
    slug: String,
    createdAt: Date,
    updatedAt: Date,
    promotion: {
        name: String,
        value: Number
    },
    productCategory: {
        name: String
    }
    },{versionKey: false});

const Product = model('Product', ProductSchema);

export default Product;
