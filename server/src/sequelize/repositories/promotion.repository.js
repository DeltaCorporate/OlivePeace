import Promotion from '../models/promotion.model.js';
import AbstractRepository from "./abstract.repository.js";

class PromotionRepository extends AbstractRepository{

    constructor(idOrInstance){
        super(Promotion,idOrInstance);
    }
    /**
     * Vérifie si une promotion existe et n'est pas expirée
     * @param {number} promotionId - L'identifiant de la promotion
     * @returns {Promise<boolean>} - Retourne true si la promotion existe et n'est pas expirée, sinon false
     * @throws {Error} - Lance une erreur si promotionId n'est pas fourni
     */
    static async isPromotionExistAndNotExpired(promotionId) {
        if (!promotionId)
            throw new Error('Promotion ID is required');
        const promotion = await Promotion.findByPk(promotionId);
        if (!promotion)
            return false;

        return !(promotion.expirationDate && new Date(promotion.expirationDate) < new Date());
    }

}

export default PromotionRepository;
