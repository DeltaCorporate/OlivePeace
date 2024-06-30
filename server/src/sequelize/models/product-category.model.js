import { Model, DataTypes, NOW } from 'sequelize';
import db from './index.js';
import Promotion from './promotion.model.js';
import ProductCategoryMongoose from '../../mongoose/models/product-category.model.js';
import {denormalizeProductCategory} from "../../services/denormalizations/product-category.denormalizer.js"; // Import du modèle Mongoose

class ProductCategory extends Model {}

ProductCategory.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    imageName: { type: DataTypes.STRING(255) },
    description: { type: DataTypes.TEXT },
    slug: { type: DataTypes.STRING(200), allowNull: false },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    },
    promotionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Promotion,
            key: 'id'
        }
    }
}, {
    sequelize: db.sequelize,
    underscored: true,
    hooks: {
        afterCreate: async (category, options) => {
            await denormalizeProductCategory(category);
        },
        afterUpdate: async (category, options) => {
            await denormalizeProductCategory(category);
        },
        afterDestroy: async (category, options) => {
           try {
                await ProductCategoryMongoose.findByIdAndDelete(category.id);
            } catch (error) {
                console.error('Failed to delete category in MongoDB:', error);
            }
        }
    }
});

ProductCategory.belongsTo(Promotion);

export default ProductCategory;
