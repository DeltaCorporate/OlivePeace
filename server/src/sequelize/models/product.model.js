import {Model, DataTypes, NOW} from 'sequelize';
import db from './index.js';
import ProductCategory from './product-category.model.js';
import Promotion from './promotion.model.js';

class Product extends Model {

    async getApplicablePromotion () {
        const promotion = await this.getPromotion();
        if (promotion) return promotion;
        const productCategory = await this.getProductCategory({
           include: [Promotion]
        });

        if(productCategory.Promotion) return productCategory.Promotion;
        return null;
    };
}



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
    }
});


Product.belongsTo(ProductCategory);
Product.belongsTo(Promotion);


export default Product;
