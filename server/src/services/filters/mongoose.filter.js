import AbstractFilter from './abstract.filter.js';

class MongooseFilter extends AbstractFilter {
    constructor(queryParams) {
        super(queryParams);
        this.filters = {};
        this.sort = {};
    }

    formatFilters(parsedFilters) {
        for (const [field, criteriaList] of Object.entries(parsedFilters)) {
            criteriaList.forEach(([criteria, criteriaValue]) => {
                this[criteria](field, criteriaValue);
            });
        }
        console.log('Filtre construit:', this.filters);
        console.log('Tri:', this.sort);
        return { filter: this.filters, sort: this.sort };
    }

    ord(field, direction) {
        this.sort[field] = direction.toUpperCase() === 'ASC' ? 1 : -1;
    }

    min(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field].$gte = parseFloat(value);
    }

    max(field, value) {
        if (!this.filters[field]) this.filters[field] = {};
        this.filters[field].$lte = parseFloat(value);
    }

    equal(field, value) {
        this.filters[field] = value;
    }

    contains(field, value) {
        this.filters[field] = { $regex: value, $options: 'i' };
    }
}

export default MongooseFilter;