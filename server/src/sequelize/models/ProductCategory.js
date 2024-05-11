import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import Promotion from "./Promotion.js";

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
    underscored: true
});
ProductCategory.belongsTo(Promotion, { foreignKey: 'promotion_id' });

export default ProductCategory;
