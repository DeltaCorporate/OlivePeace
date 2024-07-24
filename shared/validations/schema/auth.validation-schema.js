import customJoi from "#shared/config/joi.config.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
const zipCodeRegex = /^[0-9]{5}$/;
export const registerSchema = customJoi.object({
    email: customJoi.string().email({ tlds: { allow: false } }).required(),
    password: customJoi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins 12 caractères, incluant des majuscules, minuscules, chiffres et symboles',
    }),
    zipCode: customJoi.string().pattern(zipCodeRegex).required(),
    address: customJoi.string().max(255).required(),
    city: customJoi.string().max(45).required(),
    firstName: customJoi.string().required(),
    lastName: customJoi.string().required(),
});

export const loginSchema = customJoi.object({
    email: customJoi.string().email({ tlds: { allow: false } }).required(),
    password: customJoi.string().required(),
});

export const resetPasswordSchema = customJoi.object({
    password: customJoi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins 12 caractères, incluant des majuscules, minuscules, chiffres et symboles',
    }),
});

export const requestPasswordResetSchema = customJoi.object({
    email: customJoi.string().email({ tlds: { allow: false } }).required(),
});