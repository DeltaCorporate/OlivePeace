import Product from '../sequelize/models/product.model.js';
import ProductMongoose from '../mongoose/models/product.model.js';
import { getPagination, getPagedData } from '../utils/pagination.util.js';
import MongooseFilter from "../services/filters/mongoose.filter.js";
import {handleError} from '../utils/error.util.js';
import {
    ProductMessage,
    GlobalMessage
} from '#app/src/validations/errors.messages.js';
import ProductCategory from "#app/src/sequelize/models/product-category.model.js";
import Promotion from "#app/src/sequelize/models/promotion.model.js";

class ProductController {
    constructor() {}

    static async findOne(req, res) {
        const errors = [];
        try {
            const { slugOrId } = req.params;
            let product = await Product.findOne({
                include: [ProductCategory, Promotion],
                where: isNaN(slugOrId) ? { slug: slugOrId } : { id: parseInt(slugOrId) },
            });
            if (!product) errors.push({ message: ProductMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);
            let productData = await product.toJsonWithVirtuals();
            res.success(productData);
        } catch (error) {
            handleError(res, error);
        }
    }
    static async list(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);

            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();
            const totalItems = await ProductMongoose.countDocuments(filter);
            const data = await ProductMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit);

            const products = getPagedData(data, page, paginationLimit, totalItems);
            res.success(products);
        } catch (error) {
            handleError(res, error);
        }
    }


}

export default ProductController;
