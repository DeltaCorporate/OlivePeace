import AbstractFilter from './abstract.filter.js';

class MongooseFilter extends AbstractFilter {
    constructor(queryParams) {
        super(queryParams);
        this.filters = {};
        this.sort = {};
    }

    formatFilters(parsedFilters) {
        for (const [field, criteriaList] of Object.entries(parsedFilters)) {
            const convertedField = this.convertFieldName(field);
            criteriaList.forEach(([criteria, criteriaValue]) => {
                this[criteria](convertedField, criteriaValue);
            });
        }
        return { filter: this.filters, sort: this.sort };
    }

    ord(field, direction) {
        this.sort[field] = direction === 'ASC' ? 1 : -1;
    }

    min(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field].$gte = value;
    }

    max(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field].$lte = value;
    }
}

export default MongooseFilter;
