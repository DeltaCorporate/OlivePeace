import customJoi from "#shared/config/joi.config.js";

export const stockSchema = customJoi.object({
    productId: customJoi.number().integer(),
    quantity: customJoi.number().integer().min(0),
    location: customJoi.string().max(255)
});

export const stockSchemaCreate = stockSchema.fork(['productId', 'quantity', 'location'], (schema) => schema.required());

export const stockSchemaUpdate = stockSchema.fork(['productId', 'quantity', 'location'], (schema) => schema.optional());