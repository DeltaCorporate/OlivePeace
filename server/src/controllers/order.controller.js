import Order from '../mongoose/models/order.model.js';
import { getPagination, getPagedData } from '../utils/pagination.util.js';
import MongooseFilter from "../services/filters/mongoose.filter.js";
import {handleError} from "#app/src/utils/error.util.js";

class OrderController {
    static async list(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);
            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();

            filter.userId = req.user.id;

            const totalItems = await Order.countDocuments(filter);
            const data = await Order.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit);

            const orders = getPagedData(data, page, paginationLimit, totalItems);
            res.success(orders);
        } catch (error) {
            handleError(res,error);
        }
    }

    static async findOne(req, res) {
        try {
            const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
            if (!order)
                return res.error('', 404,[{message: 'Commande non trouvée'}]);
            res.success(order);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default OrderController;
