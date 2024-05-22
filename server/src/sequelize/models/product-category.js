import { Model, DataTypes, NOW } from 'sequelize';
import db from './index.js';
import Promotion from './promotion.js';
import ProductCategoryMongoose from '../../mongoose/models/product-category.model.js'; // Import du modèle Mongoose

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
    }
}, {
    sequelize: db.sequelize,
    modelName: 'ProductCategory',
    underscored: true,
    hooks: {
        afterCreate: async (category, options) => {
            try {
                await ProductCategoryMongoose.create({
                    productCategoryId: category.id,
                    name: category.name,
                    imageName: category.imageName,
                    description: category.description,
                    slug: category.slug,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    promotion_id: category.promotion_id
                });
            } catch (error) {
                console.error('Failed to create category in MongoDB:', error);
            }
        },
        afterUpdate: async (category, options) => {
            try {
                await ProductCategoryMongoose.findOneAndUpdate(
                    { productCategoryId: category.id },
                    {
                        name: category.name,
                        imageName: category.imageName,
                        description: category.description,
                        slug: category.slug,
                        updatedAt: category.updatedAt,
                        promotion_id: category.promotion_id
                    }
                );
            } catch (error) {
                console.error('Failed to update category in MongoDB:', error);
            }
        },
        afterDestroy: async (category, options) => {
            try {
                await ProductCategoryMongoose.findOneAndDelete({ productCategoryId: category.id });
            } catch (error) {
                console.error('Failed to delete category in MongoDB:', error);
            }
        }
    }
});

ProductCategory.belongsTo(Promotion, { foreignKey: 'promotion_id' });

export default ProductCategory;
