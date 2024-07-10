import customJoi from "#shared/config/joi.config.js";

const promotionSchema = customJoi.object({
    name: customJoi.string().min(2).max(30),
    value: customJoi.number().integer().min(1).max(100),
    expirationDate: customJoi.date().greater("now")
});

export const createPromotionSchema = promotionSchema.fork(['name', 'value', 'expirationDate'], (schema) => schema.required());

export const updatePromotionSchema = promotionSchema.fork(['name', 'value', 'expirationDate'], (schema) => schema.optional());
