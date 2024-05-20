import Joi from 'joi';
import ProductCategoryRepository from "../sequelize/repositories/product-category.repository.js";

const ProductCategoryValidation = {};

ProductCategoryValidation.joi = (joi) => ({
    type: 'productCategory',
    base: joi.any()
});

ProductCategoryValidation.slugNotExist = async (value, helpers) => {
    if (value === undefined) return value;
    const isExist = await ProductCategoryRepository.isSlugExist(value);
    if (isExist)
        throw new Error('Le slug pour une catégorie de produit est déjà pris');
    return value;
}

export default ProductCategoryValidation;
