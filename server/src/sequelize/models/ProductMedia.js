import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import Product from './Product';

class ProductMedia extends Model {}

ProductMedia.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    mediaName: { type: DataTypes.STRING(255), allowNull: false },
    displayOrder: { type: DataTypes.INTEGER, allowNull: false },
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
    db,
    modelName: 'ProductMedia'
});

ProductMedia.belongsTo(Product, { foreignKey: 'product_id' });

export default ProductMedia;
