import CommandeDetail from '../models/command-detail.model.js';

class CommandDetailRepository {
    static async bulkCreate(details) {
        return await CommandeDetail.bulkCreate(details);
    }

    static async deleteByCommandeId(commandeId) {
        return await CommandeDetail.destroy({
            where: { commandeId }
        });
    }
}

export default CommandDetailRepository;
