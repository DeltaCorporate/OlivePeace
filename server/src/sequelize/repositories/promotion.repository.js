import Promotion from '../models/promotion.model.js';
import AbstractRepository from "./abstract.repository.js";

class PromotionRepository extends AbstractRepository{

    constructor(idOrInstance){
        super(Promotion,idOrInstance);
    }
    /**
     * Vérifie si une promotion existe et n'est pas expirée
     * @param {number} promotion_id - L'identifiant de la promotion
     * @returns {Promise<boolean>} - Retourne true si la promotion existe et n'est pas expirée, sinon false
     * @throws {Error} - Lance une erreur si promotion_id n'est pas fourni
     */
    static async isPromotionExistAndNotExpired(promotion_id) {
        if (!promotion_id)
            throw new Error('Promotion ID is required');
        const promotion = await Promotion.findByPk(promotion_id);
        if (!promotion)
            return false;

        return !(promotion.expirationDate && new Date(promotion.expirationDate) < new Date());
    }

}

export default PromotionRepository;
