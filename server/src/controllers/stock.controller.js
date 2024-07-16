import Stock from '../sequelize/models/stock.model.js';
import StockMongoose from '../mongoose/models/stock.model.js';
import { getPagination, getPagedData } from '../utils/pagination.util.js';
import { handleError } from '../utils/error.util.js';
import { StockMessage, GlobalMessage } from '#app/src/validations/errors.messages.js';
import MongooseFilter from "#app/src/services/filters/mongoose.filter.js";

class StockController {
    constructor() {}

    static async findOne(req, res) {
        const errors = [];
        try {
            const { slugOrId } = req.params;
            const stock = await Stock.findOne({
                where: isNaN(slugOrId) ? { slug: slugOrId } : { id: parseInt(slugOrId) },
            });
            if (!stock) errors.push({ message: StockMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);
            res.success(stock);
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
            const totalItems = await StockMongoose.countDocuments(filter);
            const data = await StockMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit)

            const stocks = getPagedData(data, page, paginationLimit, totalItems);
            res.success(stocks);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default StockController;
