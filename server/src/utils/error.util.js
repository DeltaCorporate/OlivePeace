/**
 * Construit les détails de l'erreur au format { field, message }.
 * @param {Error} error - L'erreur Joi à formater.
 * @returns {Array} - Un tableau d'objets { field, message }.
 */
export const formatJoiErrors = (error) => {
    return error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
    }));
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
        res.error(error.message, 400, [{ message: error.message }]);
    }
};