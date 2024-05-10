import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import ProductCategory from './ProductCategory.js';
import Promotion from './Promotion.js';

class Product extends Model {}

Product.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    brand: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
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
    modelName: 'Product',

});

Product.belongsTo(ProductCategory, { foreignKey: 'categoryId' });
Product.belongsTo(Promotion, { foreignKey: 'promotionId' });

export default Product;
