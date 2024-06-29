import ProductCategoryMongoose from '../../mongoose/models/product-category.model.js'; // Import du modèle Mongoose

export const denormalizeProductCategory = async (category) => {
    try {
        let productCategoryMongo = await ProductCategoryMongoose.findByIdAndUpdate(
            category.id,
            category.toJSON(),
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.error('Failed to denormalize product category in MongoDB:', error);
    }
};