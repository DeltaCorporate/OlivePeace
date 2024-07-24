import customJoi from "#shared/config/joi.config.js";

const productSchema = customJoi.object({
    name: customJoi.string().max(255).required(),
    brand: customJoi.string().max(255).required(),
    description: customJoi.string().allow(null, ''),
    price: customJoi.number().precision(2).positive().required(),
    stock: customJoi.number().integer().min(0).required(),
    slug: customJoi.slug().min(1).max(200).required(),
    ProductCategoryId: customJoi.number().integer().positive().required(),
    PromotionId: customJoi.any().allow(null).optional(),
    image: customJoi.any().required()
});

//pour le create le stock est minimum 1
export const productSchemaCreate = productSchema.keys({
    stock: customJoi.number().integer().min(1).required()
});
export const productSchemaUpdate = productSchema;