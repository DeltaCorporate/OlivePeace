import AbstractFilter from './abstract.filter.js';

class MongooseFilter extends AbstractFilter {
    constructor(queryParams) {
        super(queryParams);
        this.searchQueries = [];
        this.otherFilters = [];
        this.sort = {};
    }

    formatFilters(parsedFilters) {
        for (const [field, { criteria, logic }] of Object.entries(parsedFilters)) {
            let fieldFilters = [];

            for (const [criteriaType, value] of criteria) {
                if (criteriaType === 'ord') {
                    this.sort[field] = value.toUpperCase() === 'ASC' ? 1 : -1;
                } else if (criteriaType === 'contains') {
                    this.searchQueries.push({ [field]: { $regex: value, $options: 'i' } });
                } else {
                    const filter = this[criteriaType](field, value);
                    if (filter) fieldFilters.push(filter);
                }
            }

            if (fieldFilters.length > 0) {
                if (logic === 'OR') {
                    this.otherFilters.push({ $or: fieldFilters });
                } else {
                    this.otherFilters.push(fieldFilters.length > 1 ? { $and: fieldFilters } : fieldFilters[0]);
                }
            }
        }

        let finalFilter = {};

        if (this.searchQueries.length > 0) {
            finalFilter.$and = [{ $or: this.searchQueries }];
            if (this.otherFilters.length > 0) {
                finalFilter.$and.push({ $and: this.otherFilters });
            }
        } else if (this.otherFilters.length > 0) {
            finalFilter = { $and: this.otherFilters };
        }

        return { filter: finalFilter, sort: this.sort };
    }

    contains(field, value) {
        return { [field]: { $regex: value, $options: 'i' } };
    }

    equal(field, value) {
        return { [field]: value };
    }

    min(field, value) {
        return { [field]: { $gte: parseFloat(value) } };
    }

    max(field, value) {
        return { [field]: { $lte: parseFloat(value) } };
    }
}

export default MongooseFilter;