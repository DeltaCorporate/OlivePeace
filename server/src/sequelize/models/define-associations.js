/*import User from "#app/src/sequelize/models/user.model.js";
import ProductCategory from "#app/src/sequelize/models/product-category.model.js";
import Promotion from "#app/src/sequelize/models/promotion.model.js";
import OrderDetail from "#app/src/sequelize/models/order-detail.model.js";
import Product from "#app/src/sequelize/models/product.model.js";
import Cart from "#app/src/sequelize/models/cart.model.js";
import Order from "#app/src/sequelize/models/order.model.js";

export default function defineAssociations(){
    Product.belongsTo(ProductCategory);
    Product.belongsTo(Promotion);
    Product.hasMany(OrderDetail);

    ProductCategory.belongsTo(Promotion);

    Cart.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Order);

    Order.hasMany(OrderDetail);
    OrderDetail.belongsTo(Order);
    OrderDetail.belongsTo(Product);
}*/