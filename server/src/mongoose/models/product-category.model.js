import { Schema, model } from 'mongoose';

const ProductCategorySchema = new Schema({
    _id: String,
    name: String,
    imageName: String,
    description: String,
    slug: String,
    createdAt: Date,
    updatedAt: Date,
    promotionId: Number
});

const ProductCategory = model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
