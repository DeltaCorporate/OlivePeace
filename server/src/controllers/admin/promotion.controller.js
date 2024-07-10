import Promotion from '../../sequelize/models/promotion.model.js';
import PromotionMongoose  from '../../mongoose/models/promotion.model.js';

import { createPromotionSchema, updatePromotionSchema } from '#shared/validations/schema/promotion.validation-schema.js';
import { formatJoiErrors, handleError } from '../../utils/error.util.js';
import { GlobalMessage, PromotionMessage } from '#app/src/validations/errors.messages.js';
import { getPagination, getPagedData } from '../../utils/pagination.util.js';
import MongooseFilter from "../../services/filters/mongoose.filter.js";
import PromotionRepository from "#app/src/sequelize/repositories/promotion.repository.js";

class PromotionController {
    constructor() {}

    static async create(req, res) {
        try {
            const data = req.body;
            const errors = formatJoiErrors(createPromotionSchema, data);

            const isNameTaken = await PromotionRepository.isNameTaken(data.name ?? null);
            if(isNameTaken) errors.push({ field:"name", message: PromotionMessage.nameIsTaken });

            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            const promotion = await Promotion.create(data);
            return res.created(promotion);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const errors = formatJoiErrors(updatePromotionSchema, data);
            const promotion = await Promotion.findByPk(id);
            const isNameTaken = data.name ? await PromotionRepository.isNameTaken(data.name) : false
            if (!promotion) errors.push({ message: PromotionMessage.notFound });
            if(isNameTaken) errors.push({ field:"name", message: PromotionMessage.nameIsTaken });

            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            Object.assign(promotion, data);
            await promotion.save();
            return res.success(promotion);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const promotion = await Promotion.findByPk(id);
            if (!promotion) return res.error(PromotionMessage.notFound, 404);
            await promotion.destroy();
            return res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;

            const promotion = await Promotion.findByPk(id);
            if (!promotion) return res.error(PromotionMessage.notFound, 404);

            return res.success(promotion);
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
            const totalItems = await PromotionMongoose.countDocuments(filter);
            const data = await PromotionMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit)

            const promotions = getPagedData(data, page, paginationLimit, totalItems);
            res.success(promotions);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default PromotionController;
