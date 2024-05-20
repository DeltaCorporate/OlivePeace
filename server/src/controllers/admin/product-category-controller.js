import ProductCategory from '../../sequelize/models/product-category.js';
import customJoi from '../../config/joi.js';
import { getPagination, getPagedData } from '../../utils/pagination.js';
import PromotionValidation from "../../validations/promotion.validation.js";
import ProductCategoryValidation from "../../validations/product-category.validation.js";

class ProductCategoryController {
    static categorySchemaCreate = customJoi.object({
        name: customJoi.string().max(255).required(),
        description: customJoi.string().allow(null, ''),
        slug: customJoi.slug().min(1).max(200).required().external(ProductCategoryValidation.slugNotExist),
        promotion_id: customJoi.any().external(PromotionValidation.isNotExistAndNotExpired).optional()
    });
    static categorySchemaUpdate = ProductCategoryController.categorySchemaCreate.fork(['slug'],(schema) => schema.optional());


    constructor() {}

    static async create(req, res) {
        try {
            const data = req.body;
            const validatedData = await ProductCategoryController.categorySchemaCreate.validateAsync(data);
            validatedData.imageName = req.file?.filename ?? null;
            const category = await ProductCategory.create(validatedData);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (req.file) {
                data.image = await ProductCategoryService.uploadImage(req, res);
            }
            const validatedData = await ProductCategoryController.categorySchemaUpdate.validateAsync(data);
            const category = await ProductCategory.update(validatedData, {
                where: { id },
                returning: true
            });

            if (category[0] === 1) res.status(200).json(category[1][0]);
            else res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await ProductCategoryService.deleteOldImage(id);
            const result = await ProductCategory.destroy({ where: { id } });
            if (result) res.status(204).send();
            else res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const category = await ProductCategory.findByPk(id);
            if (category) res.status(200).json(category);
            else res.status(404).json({ message: 'Category not found' });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProductCategoryController;
