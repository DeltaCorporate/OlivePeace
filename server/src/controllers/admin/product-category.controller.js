// controllers/ProductCategoryController.js
import ProductCategory from '../../sequelize/models/product-category.model.js';
import customJoi from '../../config/joi.config.js';
import { getPagination, getPagedData } from '../../utils/pagination.util.js';
import PromotionValidation from "../../validations/promotion.validation.js";
import ProductCategoryValidation from "../../validations/product-category.validation.js";
import upload from "../../config/multer.config.js";
import { deleteUploadedFile, moveTmpToUpload } from "../../utils/file.util.js";

class ProductCategoryController {
    static categorySchemaCreate = customJoi.object({
        name: customJoi.string().max(255).required(),
        description: customJoi.string().allow(null, ''),
        slug: customJoi.slug().min(1).max(200).required().external(ProductCategoryValidation.slugNotExist),
        promotion_id: customJoi.any().external(PromotionValidation.isNotExistAndNotExpired).optional()
    });
    static categorySchemaUpdate = ProductCategoryController.categorySchemaCreate.fork(['slug'], (schema) => schema.optional());

    constructor() {}

    static async create(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            if (err) return res.error(err.message, 400);

            try {
                const data = req.body;
                await ProductCategoryController.categorySchemaCreate.validateAsync(data);
                if (req.file) {
                    data.imageName = req.file.filename;
                    moveTmpToUpload(req.file.filename);
                }
                const category = await ProductCategory.create(data);
                return res.created(category);
            } catch (error) {
                res.error(error.message, 400);
            }
        });
    }

    static async update(req, res) {
        await upload.image.single('image')(req, res, async (err) => {
            if (err) return res.error(err.message, 400);

            try {
                const { id } = req.params;
                const data = req.body;
                await ProductCategoryController.categorySchemaUpdate.validateAsync(data);
                const category = await ProductCategory.findByPk(id);
                if (!category) return res.error('Category not found', 404);

                if (req.file) {
                    deleteUploadedFile(category.imageName);
                    data.imageName = req.file.filename;
                    moveTmpToUpload(req.file.filename);
                }
                await category.update(data);
                return res.success(category);
            } catch (error) {
                res.error(error.message, 400);
            }
        });
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await ProductCategory.findByPk(id);
            if (!category) return res.error('Category not found', 404);

            if (category.imageName)
                deleteUploadedFile(category.imageName);

            const result = await ProductCategory.destroy({ where: { id } });
            if (result) return res.status(204).send();
            else res.error('Category not found', 404);
        } catch (error) {
            res.error(error.message, 500);
        }
    }


    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const category = await ProductCategory.findByPk(id);
            if (category) res.success(category);
            else res.error('Category not found', 404);
        } catch (error) {
            res.error(error.message, 500);
        }
    }

    static async findAndCountAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);

            const { count: totalItems, rows: data } = await ProductCategory.findAndCountAll({
                limit: paginationLimit,
                offset,
                order: [['id', 'ASC']]
            });

            const categories = getPagedData(data, page, paginationLimit, totalItems);
            res.success(categories);
        } catch (error) {
            res.error(error.message, 500);
        }
    }
}

export default ProductCategoryController;
