import StockRepository from "#app/src/sequelize/repositories/stock.repository.js";
import { formatJoiErrors, handleError } from '../../utils/error.util.js';
import { stockSchemaCreate, stockSchemaUpdate } from '#shared/validations/schema/stock.validation-schema.js';
import { StockMessage, GlobalMessage } from '#app/src/validations/errors.messages.js';
import {getPagedData, getPagination} from "#app/src/utils/pagination.util.js";

class StockAdminController {
    constructor() {}

    static async create(req, res) {
        try {
            const data = req.body;
            let errors = formatJoiErrors(stockSchemaCreate, data);
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);
            const stock = await StockRepository.create(data);
            return res.created(stock);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            let errors = formatJoiErrors(stockSchemaUpdate, data);
            const stock = await StockRepository.findById(id);
            if (!stock) errors.push({ message: StockMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            await StockRepository.update(id, data);
            return res.success(stock);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const stock = await StockRepository.findById(id);

            if (!stock) return res.error(GlobalMessage.validationError, 404, [{ message: StockMessage.notFound }]);

            await StockRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const stock = await StockRepository.findById(id);

            if (!stock) return res.error(GlobalMessage.validationError, 404, [{ message: StockMessage.notFound }]);

            res.success(stock);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async list(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);

            const filter = {};
            const sort = [];

            const data = await StockRepository.findAll({ page, limit: paginationLimit, filter, sort });
            res.success(getPagedData(data, page, paginationLimit, data.totalItems));
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default StockAdminController;
