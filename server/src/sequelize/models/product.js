import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import ProductCategory from './product-category.js';
import Promotion from './promotion.js';

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
    underscored: true

});

Product.belongsTo(ProductCategory, { foreignKey: 'category_id' });
Product.belongsTo(Promotion, { foreignKey: 'promotion_id' });

export default Product;
