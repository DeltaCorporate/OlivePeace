import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import Product from './product.model.js';

class ProductImage extends Model {}

ProductImage.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    imageName: { type: DataTypes.STRING(255), allowNull: false },
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
    sequelize: db.sequelize,
    modelName: 'ProductImage',
    underscored: true
});

ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

export default ProductImage;
