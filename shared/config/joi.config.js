// src/config/joi.config.frontend.js

import Joi from 'joi';

import SlugRule from '#shared/validations/rules/slug.rule.js';

let customJoi = Joi;

customJoi = customJoi.extend(SlugRule.joi);

export default customJoi;