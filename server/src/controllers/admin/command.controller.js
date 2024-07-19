import CommandRepository from '../../sequelize/repositories/command.repository.js';
import CommandDetailRepository from '../../sequelize/repositories/command-detail.repository.js';
import { formatJoiErrors, handleError } from '../../utils/error.util.js';
import { commandeSchemaCreate, commandeSchemaUpdate } from '#shared/validations/schema/commande.validation-schema.js';
import { CommandeMessage, GlobalMessage } from '../../validations/errors.messages.js';

class CommandeAdminController {
    constructor() {}

    static async create(req, res) {
        try {
            const data = req.body;
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

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            let errors = formatJoiErrors(commandeSchemaUpdate, data);
            const commande = await CommandRepository.findById(id);
            if (!commande) errors.push({ message: CommandeMessage.notFound });
            if (errors.length > 0) return res.error(GlobalMessage.validationError, 422, errors);

            await CommandRepository.update(id, data);
            if (data.details) {
                await CommandDetailRepository.deleteByCommandeId(id);
                const commandeDetails = data.details.map(detail => ({
                    ...detail,
                    commandeId: id
                }));
                await CommandDetailRepository.bulkCreate(commandeDetails);
            }
            return res.success(commande);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const commande = await CommandRepository.findById(id);

            if (!commande) return res.error(GlobalMessage.validationError, 404, [{ message: CommandeMessage.notFound }]);

            await CommandDetailRepository.deleteByCommandeId(id);
            await CommandRepository.delete(id);
            return res.status(204).send();
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default CommandeAdminController;
