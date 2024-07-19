import CommandRepository from '../sequelize/repositories/command.repository.js';
import CommandDetailRepository from '../sequelize/repositories/command-detail.repository.js';
import { formatJoiErrors, handleError } from '../utils/error.util.js';
import { commandeSchemaCreate } from '#shared/validations/schema/commande.validation-schema.js';
import { CommandeMessage, GlobalMessage } from '../validations/errors.messages.js';
import {getPagedData, getPagination} from "#app/src/utils/pagination.util.js";
import MongooseFilter from "#app/src/services/filters/mongoose.filter.js";
import ProductMongoose from "#app/src/mongoose/models/product.model.js";
import Commande from "#app/src/mongoose/models/command.model.js";

class CommandController {
    constructor() {}

    static async create(req, res) {
        try {
            const data = req.body;
            data.userId = req.user.id;
            let errors = formatJoiErrors(commandeSchemaCreate, data);
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            const commande = await CommandRepository.create(data);
            const commandeDetails = data.details.map(detail => ({
                ...detail,
                commandeId: commande.id
            }));
            await CommandDetailRepository.bulkCreate(commandeDetails);

            return res.created(commande);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const commande = await CommandRepository.findById(id);

            if (!commande) return res.error(GlobalMessage.validationError, 404, [{ message: CommandeMessage.notFound }]);

            res.success(commande);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async findByUserId(req, res) {
        try {
            const { userId } = req.params;
            const commandes = await CommandRepository.findAll({ where: { userId } });

            if (!commandes) return res.error(GlobalMessage.validationError, 404, [{ message: CommandeMessage.notFound }]);

            res.success(commandes);
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
            const totalItems = await CommandeMongoose.countDocuments(filter);
            const data = await ProductMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit)

            const orders = getPagedData(data, page, paginationLimit, data.totalItems);
            res.success(orders);
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default CommandController;
