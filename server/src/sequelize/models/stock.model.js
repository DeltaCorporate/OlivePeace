import { Model, DataTypes, NOW } from 'sequelize';
import db from './index.js';
import Product from './product.model.js';
import StockMongoose from '../../mongoose/models/stock.model.js';
import { denormalizeStock } from '../../services/denormalizations/stock.denormalizer.js';

class Stock extends Model {}

Stock.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: false },
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
        afterCreate: async (stock, options) => {
            await denormalizeStock(stock);
        },
        afterUpdate: async (stock, options) => {
            await denormalizeStock(stock);
        },
        afterDestroy: async (stock, options) => {
            try {
                await StockMongoose.findByIdAndDelete(stock.id);
            } catch (error) {
                console.error('Failed to delete stock in MongoDB:', error);
            }
        }
    }
});

Stock.belongsTo(Product, { foreignKey: 'productId' });

export default Stock;
