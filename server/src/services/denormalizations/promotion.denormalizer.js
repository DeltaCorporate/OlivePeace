import PromotionMongoose from '../../mongoose/models/promotion.model.js'; // Import du modèle Mongoose

export const denormalizePromotion = async (promotion) => {
    try {
        let promotionMongo = await PromotionMongoose.findByIdAndUpdate(
            promotion.id,
            promotion.toJSON(),
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.error('Failed to denormalize promotion in MongoDB:', error);
    }
};