import Product from '../sequelize/models/product.model.js';
import ProductMongoose from '../mongoose/models/product.model.js';
import { getPagination, getPagedData } from '../utils/pagination.util.js';
import upload from "#config/multer.config.js";
import { deleteUploadedFile, moveTmpToUpload } from "../utils/file.util.js";
import MongooseFilter from "../services/filters/mongoose.filter.js";
import {formatJoiErrors, handleError} from '../utils/error.util.js';
import {
    ProductCategoryMessage,
    ProductMessage,
    ImageMessage,
    PromotionMessage,
    GlobalMessage
} from '#app/src/validations/errors.messages.js';
import ProductCategory from "#app/src/mongoose/models/product-category.model.js";
import Promotion from "#app/src/mongoose/models/promotion.model.js";

class ProductController {
    constructor() {}

    static async findOne(req, res) {
        const errors = [];
        try {
            const { slugOrId } = req.params;
            const product = await Product.findOne({
                where: isNaN(slugOrId) ? { slug: slugOrId } : { id: parseInt(slugOrId) },
            });
            if (!product) errors.push({ message: ProductMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);
            res.success(product);
        } catch (error) {
            handleError(res, error);
        }
    }


}

export default ProductController;
