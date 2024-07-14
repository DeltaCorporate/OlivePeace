import ProductMongoose from '../../mongoose/models/product.model.js';
export const denormalizeProduct = async (product) => {
    try {
        const promotion = await product.getApplicablePromotion();
        // get product data
        const productData = product.toJSON();

        if(promotion && product.id > 4){
            productData.promotion = {
                name: promotion.name,
                value: promotion.value
            };
            }
        const productCategory = await product.getProductCategory();
        productData.productCategory = {
            name: productCategory.name
        };
        productData.discountedPrice = await product.discountedPrice;
        let productMongo = await ProductMongoose.findByIdAndUpdate(
            product.id,
            productData,
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.error('Failed to denormalize product in MongoDB:', error);
    }
};