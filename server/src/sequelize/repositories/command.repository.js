import Commande from '../models/command.model.js';
import CommandeDetail from '../models/command-detail.model.js';

class CommandRepository {
    static async create(data) {
        return await Commande.create(data, {
            include: [CommandeDetail],
        });
    }

    static async findById(id) {
        return await Commande.findByPk(id, {
            include: [CommandeDetail],
        });
    }

    static async update(id, data) {
        const commande = await this.findById(id);
        return await commande.update(data);
    }

    static async delete(id) {
        const commande = await this.findById(id);
        return await commande.destroy();
    }

    static async findAll(options) {
        return await Commande.findAndCountAll(options);
    }
}

export default CommandRepository;
