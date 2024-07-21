import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import ProductCategory from './product-category.model.js';
import Promotion from './promotion.model.js';

import ProductMongoose from "#app/src/mongoose/models/product.model.js";
import {denormalizeProduct} from "../../services/denormalizations/product.denormalizer.js";
import StockHistory from "#app/src/mongoose/models/stock-history.model.js";
import ProductService from "#app/src/services/product.service.js";
import {isChanged} from "#app/src/utils/string.util.js";
import OrderDetail from "#app/src/sequelize/models/order-detail.model.js";
class Product extends Model {

    async getApplicablePromotion () {
        const promotion = await this.getPromotion();
        if (promotion) return promotion;
        const productCategory = await this.getProductCategory({
           include: [Promotion]
        });
        if(productCategory.hasOwnProperty('Promotion'))
            return productCategory.Promotion;
        return null;
    };
    async toJsonWithVirtuals() {
        const productData = await this.toJSON();
        productData.discountedPrice = await this.discountedPrice;
        return productData;
    }
    getDataForStockHistory() {
        return {
            productId: this.id,
            stock: this.stock
        };
    }
}



Product.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    brand: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false },
    imageName: { type: DataTypes.STRING(200), allowNull: false },
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
}, {
    sequelize: db.sequelize,
    underscored: true,
    getterMethods: {
        async discountedPrice() {
            const promotion = await this.getApplicablePromotion();
            if (!promotion) return this.price;
            const discount = this.price * (promotion.value / 100);
            return this.price - discount;
        }
    },
    hooks: {
        afterCreate: async (product, options) => {
            await denormalizeProduct(product);
            await StockHistory.create(product.getDataForStockHistory());

        },
        afterUpdate: async (product, options) => {
            await denormalizeProduct(product);
            if (isChanged(product,'stock')){
                if(product.stock == 0) await ProductService.alertLowStock(product);
                await StockHistory.create(product.getDataForStockHistory());
            }
        },
        afterDestroy: async (product, options) => {
            try {
                await ProductMongoose.findByIdAndDelete(product.id);
                await StockHistory.deleteMany({ productId: product.id });
            } catch (error) {
                console.error('Failed to delete product in MongoDB:', error);
            }
        }
    }
});


Product.belongsTo(ProductCategory);
Product.belongsTo(Promotion);
Product.hasMany(OrderDetail);

OrderDetail.belongsTo(Product);
export default Product;
