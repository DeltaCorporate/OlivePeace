import customJoi from "#config/joi.config.js";

export const productCategorySchemaCreate = customJoi.object({
    name: customJoi.string().max(255).required(),
    description: customJoi.string().allow(null, ''),
    slug: customJoi.slug().min(1).max(200).required(),
    promotionId: customJoi.any().optional()
});
export const productCategorySchemaUpdate = productCategorySchemaCreate;
