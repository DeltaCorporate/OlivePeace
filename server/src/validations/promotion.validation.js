import Joi from 'joi';
import PromotionRepository from '../sequelize/repositories/promotion.repository.js';

const PromotionValidation = {};

PromotionValidation.joi = (joi) => ({
    type: 'promotion',
    base: joi.any()
});

PromotionValidation.isNotExistAndNotExpired = async (value, helpers) => {
        if (value === undefined) return value;
        const isValid = await PromotionRepository.isPromotionExistAndNotExpired(value);
        if (!isValid)
            throw new Error('La promotion est invalide ou a expiré');
        return value;
}

export default PromotionValidation;
