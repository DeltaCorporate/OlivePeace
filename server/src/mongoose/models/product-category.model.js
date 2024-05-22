import { Schema, model } from 'mongoose';

const ProductCategorySchema = new Schema({
    productCategoryId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, maxlength: 255 },
    imageName: { type: String, maxlength: 255 },
    description: { type: String },
    slug: { type: String, required: true, maxlength: 200 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    promotion_id: { type: Number }
});

const ProductCategory = model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
