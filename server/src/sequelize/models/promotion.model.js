import { Model, DataTypes,NOW } from 'sequelize';
import db from './index.js';
import {denormalizePromotion} from "#app/src/services/denormalizations/promotion.denormalizer.js";
import PromotionMongoose from "#app/src/mongoose/models/promotion.model.js";
class Promotion extends Model {}

Promotion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    expirationDate: { type: DataTypes.DATE, allowNull: false },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    }
}, {
    sequelize: db.sequelize,
    underscored: true,
    hooks: {
        afterCreate: async (promotion, options) => {
            await denormalizePromotion(promotion);
        },
        afterUpdate: async (promotion, options) => {
            await denormalizePromotion(promotion);
        },
        afterDestroy: async (promotion, options) => {
            try {
                await PromotionMongoose.findByIdAndDelete(promotion.id);
            } catch (error) {
                console.error('Failed to delete category in MongoDB:', error);
            }
        }
    }
});

export default Promotion;
