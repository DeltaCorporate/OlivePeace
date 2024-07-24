import User from '../../sequelize/models/user.model.js';
import UserMongoose from '../../mongoose/models/user.model.js';
import { getPagination, getPagedData } from '../../utils/pagination.util.js';
import MongooseFilter from "../../services/filters/mongoose.filter.js";
import { handleError, formatJoiErrors } from '../../utils/error.util.js';
import { UserMessage, GlobalMessage } from '#app/src/validations/errors.messages.js';
import { sendConfirmationEmail } from '../../services/emails/auth.email.js';
import { userSchemaCreate, userSchemaUpdate } from '#shared/validations/schema/user.validation-schema.js';

class UserController {
    static async list(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { limit: paginationLimit, offset } = getPagination(page, limit);

            const mongooseFilter = new MongooseFilter(req.query);
            const { filter, sort } = mongooseFilter.applyFilters();
            const totalItems = await UserMongoose.countDocuments(filter);
            const data = await UserMongoose.find(filter)
                .sort(sort)
                .skip(offset)
                .limit(paginationLimit);

            const users = getPagedData(data, page, paginationLimit, totalItems);
            res.success(users);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async findOne(req, res) {
        const errors = [];
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) errors.push({ message: UserMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 404, errors);
            res.success(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async create(req, res) {
        const errors = [];
        try {
            const data = req.body;
            errors.concat(formatJoiErrors(userSchemaCreate, data));
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            const user = await User.create(data);
            user.validateConfirmationToken();
            const userData = user.toJSON();
            userData.password = '';
            res.created(userData);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async update(req, res) {
        const errors = [];
        try {
            const { id } = req.params;
            const data = req.body;
            errors.concat(formatJoiErrors(userSchemaUpdate, data));

            const user = await User.findByPk(id);
            if (!user) errors.push({ message: UserMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            await user.update(data);
            res.success(user);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.error(UserMessage.notFound, 404);

            await user.anonymize();
            await user.save();
            res.success({ message: UserMessage.anonymized });
        } catch (error) {
            handleError(res, error);
        }
    }

    static async sendConfirmation(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) return res.error(UserMessage.notFound, 404,[{message: UserMessage.notFound}]);
            if (user.isConfirmed()) return res.error('', 400,[{message: UserMessage.alreadyConfirmed}]);

            user.regenerateConfirmationToken();
            await user.save();
            await sendConfirmationEmail(user.email, user.confirmationToken);
            res.success({ message: UserMessage.confirmationEmailSent });
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default UserController;