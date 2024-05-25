import AbstractFilter from './abstract.filter.js';
import { Op } from 'sequelize';

class SequelizeFilter extends AbstractFilter {
    constructor(queryParams) {
        super(queryParams);
        this.filters = {};
        this.order = [];
    }

    formatFilters(parsedFilters) {
        for (const [field, criteriaList] of Object.entries(parsedFilters)) {
            const convertedField = this.convertFieldName(field);
            criteriaList.forEach(([criteria, criteriaValue]) => {
                this[criteria](convertedField, criteriaValue);
            });
        }
        return { where: this.filters, order: this.order };
    }

    ord(field, direction) {
        this.order.push([field, direction]);
    }

    min(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field][Op.gte] = value;
    }

    max(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field][Op.lte] = value;
    }
}

export default SequelizeFilter;
