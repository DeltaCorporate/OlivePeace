import ProductCategory from '../sequelize/models/product-category.model.js';
import ProductCategoryMongoose from '../mongoose/models/product-category.model.js';
import { getPagination, getPagedData } from '../utils/pagination.util.js';

import MongooseFilter from "../services/filters/mongoose.filter.js";
import {handleError} from '../utils/error.util.js';
import {
    ProductCategoryMessage,
    GlobalMessage
} from '#app/src/validations/errors.messages.js';
import Promotion from "#app/src/sequelize/models/promotion.model.js";
import ProductMongoose from "#app/src/mongoose/models/product.model.js";
import Product from "#app/src/sequelize/models/product.model.js";

class ProductCategoryController {
    constructor() {}

    static async findOne(req, res) {
        const errors = [];
        try {
            const { slugOrId } = req.params;
            const category = await ProductCategory.findOne({
                    where: isNaN(slugOrId) ? { slug: slugOrId } : { id: parseInt(slugOrId) },
                include: Promotion

            });
            if (!category) errors.push({ message: ProductCategoryMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);
            res.success(category);
        } catch (error) {
            handleError(res, error);
        }
    }
    static async products(req, res) {
        try {
            const errors = [];
            const { slugOrId } = req.params;
            const category = await ProductCategory.findOne({
                where: isNaN(slugOrId) ? { slug: slugOrId } : { id: parseInt(slugOrId) },
            });
            if (!category){
                errors.push({ message: ProductCategoryMessage.notFound });
                return res.error(GlobalMessage.validationError, 404, errors);
            }
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);
            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();
            filter.productCategory = { name : category.name};
            const totalItems = await ProductMongoose.countDocuments(filter);
            const data = await ProductMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit)
            const products = getPagedData(data, page, paginationLimit, totalItems);
            res.success(products);
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
            const totalItems = await ProductCategoryMongoose.countDocuments(filter);
            const data = await ProductCategoryMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit)

            const categories = getPagedData(data, page, paginationLimit, totalItems);
            res.success(categories);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default ProductCategoryController;
