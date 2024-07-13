/**
 * Construit les détails de l'erreur au format { field, message }.
 * @returns {Array} - Un tableau d'objets { field, message }.
 * @param schema
 * @param data
 */
export const formatJoiErrors = (schema,data) => {
    let error = schema.validate(data,{abortEarly: false}).error;
    return error ? error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
    })) : [];
};

/**
 * Gère les erreurs et envoie une réponse appropriée.
 * @param {Object} res - L'objet de réponse Express.
 * @param {Error} error - L'erreur à gérer.
 */
export const handleError = (res, error) => {
    if (error.isJoi) {
        const errorDetails = formatJoiErrors(error);
        res.error('Erreur de validation', 400, errorDetails);
    } else {
        res.error(error.message, 400);
    }
};