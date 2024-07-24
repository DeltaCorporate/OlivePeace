import ProductCategory from '../../sequelize/models/product-category.model.js';
import ProductCategoryMongoose from '../../mongoose/models/product-category.model.js';
import { getPagination, getPagedData } from '../../utils/pagination.util.js';
import upload from "../../../config/multer.config.js";
import { deleteUploadedFile, moveTmpToUpload } from "../../utils/file.util.js";
import MongooseFilter from "../../services/filters/mongoose.filter.js";
import { productCategorySchemaCreate, productCategorySchemaUpdate } from '#shared/validations/schema/product-category.validation-schema.js';
import PromotionRepository from "#app/src/sequelize/repositories/promotion.repository.js";
import {formatJoiErrors, handleError} from '../../utils/error.util.js';
import {
    ProductCategoryMessage,
    ImageMessage,
    PromotionMessage,
    GlobalMessage
} from '#app/src/validations/errors.messages.js';
import Promotion from "#app/src/sequelize/models/promotion.model.js";
import {isEmpty} from "#app/src/utils/string.util.js";

class ProductCategoryController {
    constructor() {}

    static async create(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            let errors = [];
            if (err) errors.push({ field: 'image', message: ImageMessage.uploadError });
            try {
                const data = req.body;
                if (!isEmpty(data.PromotionId)) {
                    const isPromotionExistAndNotExpired = await PromotionRepository.isPromotionExistAndNotExpired(data.PromotionId);
                    if (!isPromotionExistAndNotExpired) errors.push({ field: 'PromotionId', message: PromotionMessage.notAvailable });
                }
                errors = errors.concat(formatJoiErrors(productCategorySchemaCreate,data))
                if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
                if (req.file) {
                    data.imageName = req.file.filename;
                    await moveTmpToUpload(req.file.filename);
                }
                const category = await ProductCategory.create(data);
                return res.created(category);
            } catch (error) {
                handleError(res, error);
            }
        });
    }

    static async update(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            let errors = [];
            if (err) errors.push({ field: 'image', message: ImageMessage.uploadError });

            try {
                const { id } = req.params;
                const data = req.body;
                if (!isEmpty(data.PromotionId)) {
                    const isPromotionExistAndNotExpired = await PromotionRepository.isPromotionExistAndNotExpired(data.PromotionId);
                    if (!isPromotionExistAndNotExpired) errors.push({ field: 'PromotionId', message: PromotionMessage.notAvailable });
                }else
                    data.PromotionId = null
                errors = errors.concat(formatJoiErrors(productCategorySchemaUpdate,data))
                const category = await ProductCategory.findByPk(id);
                if (!category) errors.push({ message: ProductCategoryMessage.notFound });
                if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
                if (req.file) {
                    await deleteUploadedFile(category.imageName);
                    data.imageName = req.file.filename;
                    await moveTmpToUpload(data.imageName);
                }
                await category.update(data);
                return res.success(category);
            } catch (error) {
                handleError(res, error);
            }
        });
    }
    static async getAll(req, res) {
        try {
            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();
            const data = await ProductCategoryMongoose.find(filter)
                .sort(sort)
            res.success(data);
        } catch (error) {
            handleError(res, error);
        }
    }
    static async delete(req, res) {
        const errors = [];
        try {
            const { id } = req.params;
            const category = await ProductCategory.findByPk(id);

            if (!category) errors.push({ message: ProductCategoryMessage.notFound });
            if (category && category.imageName) deleteUploadedFile(category.imageName);
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);

            const result = await category.destroy();
            if (result) return res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    }


}

export default ProductCategoryController;
