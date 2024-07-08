import Joi from "joi";

const SlugRule = {};

SlugRule.joi = (joi) => ({
    type: 'slug',
    base: joi.string(),
    messages: {
        'slug.invalid': '"{{#label}}" doit être un slug d\'url valide'
    },
    validate(value, helpers) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
            return {value,errors: helpers.error('slug.invalid')};
        return {value};
    }
});

export default SlugRule;