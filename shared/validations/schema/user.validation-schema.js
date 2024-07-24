import customJoi from "#shared/config/joi.config.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

const userSchemaBase = customJoi.object({
    email: customJoi.string().email({ tlds: { allow: false } }),
    firstName: customJoi.string().min(1).max(255),
    lastName: customJoi.string().min(1).max(255),
    zipCode: customJoi.string().max(10),
    address: customJoi.string().min(5).max(255),
    city: customJoi.string().min(5).max(255),
    roles: customJoi.array().items(customJoi.string()),
});
export const userSchemaCreate = userSchemaBase.keys({
    email: userSchemaBase.extract('email').required(),
    firstName: userSchemaBase.extract('firstName').required(),
    lastName: userSchemaBase.extract('lastName').required(),
    zipCode: userSchemaBase.extract('zipCode').required(),
    address: userSchemaBase.extract('address').required(),
    city: userSchemaBase.extract('city').required(),
    roles: userSchemaBase.extract('roles').required(),
    password: customJoi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins 12 caractères, incluant des majuscules, minuscules, chiffres et symboles',
    }),
});

export const userSchemaUpdate = userSchemaBase;