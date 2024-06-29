import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import ProductCategory from './product-category.model.js';
import Promotion from './promotion.model.js';

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
    },
    productCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: ProductCategory,
            key: 'id'
        }
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
    underscored: true

});

Product.belongsTo(ProductCategory);
Product.belongsTo(Promotion);

export default Product;
