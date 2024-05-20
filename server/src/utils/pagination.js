/**
 * Crée un objet de pagination pour les requêtes Sequelize.
 * @param {number} page - La page courante.
 * @param {number} limit - Le nombre d'éléments par page.
 * @returns {Object} - Un objet contenant 'limit' et 'offset'.
 */
function getPagination(page, limit) {
    const limitValue = limit ? +limit : 10;
    const offset = page ? (page - 1) * limitValue : 0;
    return { limit: limitValue, offset };
}

/**
 * Construit une réponse de pagination.
 * @param {Array} data - Les données à paginer.
 * @param {number} page - La page courante.
 * @param {number} limit - Le nombre d'éléments par page.
 * @param {number} totalItems - Le nombre total d'éléments.
 * @returns {Object} - Un objet de réponse paginée.
 */
function getPagedData(data, page, limit, totalItems) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        data,
        pagination: {
            totalItems,
            totalPages,
            currentPage: +page,
            pageSize: data.length,
            limit
        }
    };
}

export { getPagination, getPagedData };
