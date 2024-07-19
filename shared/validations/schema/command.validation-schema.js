import customJoi from "#shared/config/joi.config.js";

const commandeDetailSchema = customJoi.object({
    price: customJoi.number().positive().required(),
    quantity: customJoi.number().integer().min(1).required(),
    imageName: customJoi.string().required(),
    promotionName: customJoi.string().optional(),
    promotionValue: customJoi.number().positive().optional()
});

const commandeSchema = customJoi.object({
    userId: customJoi.string().guid({ version: 'uuidv4' }).required(),
    isPaid: customJoi.boolean().required(),
    paymentFailedMessage: customJoi.string().optional(),
    deliveryStatus: customJoi.string().valid('processing', 'shipping', 'delivered', 'delivery_issue').required(),
    details: customJoi.array().items(commandeDetailSchema).required()
});

export const commandeSchemaCreate = commandeSchema.fork(['userId', 'isPaid', 'deliveryStatus', 'details'], (schema) => schema.required());

export const commandeSchemaUpdate = commandeSchema.fork(['userId', 'isPaid', 'deliveryStatus', 'details'], (schema) => schema.optional());
