import StockMongoose from '../../mongoose/models/stock.model.model.js'; // Import du modèle Mongoose

export const denormalizeStock = async (stock) => {
    try {
        await StockMongoose.findByIdAndUpdate(
            stock.id,
            stock.toJSON(),
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.error('Failed to denormalize stock in MongoDB:', error);
    }
};
