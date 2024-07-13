class AbstractFilter {
    constructor(queryParams) {
        this.queryParams = queryParams;
        this.caseFormat = 'camel';
        this.disallowedAttributes = [];
    }

    applyFilters() {
        const parsedFilters = this.parseQueryParams();
        return this.formatFilters(parsedFilters);
    }

    formatFilters(parsedFilters) {
        throw new Error('formatFilters method must be implemented');
    }

    parseCriteria(criteriaString) {
        const criteria = [];
        let currentCriteria = '';
        let inQuotes = false;

        for (let i = 0; i < criteriaString.length; i++) {
            const char = criteriaString[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                criteria.push(currentCriteria.trim());
                currentCriteria = '';
            } else {
                currentCriteria += char;
            }
        }
        criteria.push(currentCriteria.trim());

        return criteria.map(item => {
            const [criteriaType, criteriaValue] = item.split(':');
            if (criteriaType === 'contains' || criteriaType === 'equal') {
                return [criteriaType, criteriaValue.replace(/(^"|"$)/g, '')];
            }
            return [criteriaType, criteriaValue];
        });
    }

    parseQueryParams() {
        const filters = Object.entries(this.queryParams)
            .filter(([param]) => param.startsWith('f_'))
            .map(([param, value]) => ({
                field: param.substring(2),
                criteria: this.parseCriteria(value)
            }));

        filters.forEach(({ field }) => {
            if (this.disallowedAttributes.includes(field) || this.disallowedAttributes.includes(this.convertFieldName(field))) {
                throw new Error(`Le filtrage par "${field}" n'est pas autorisé`);
            }
        });

        return filters.reduce((acc, { field, criteria }) => {
            acc[field] = criteria;
            return acc;
        }, {});
    }

    convertFieldName(fieldName) {
        if (this.caseFormat.type === 'snake') {
            return fieldName.replace(/([A-Z])/g, "_$1").toLowerCase();
        }
        if (this.caseFormat.type === 'camel') {
            return fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        }
        return fieldName;
    }

    disallow(attributes) {
        const convertedAttributes = attributes.map(attr => this.convertFieldName(attr));
        this.disallowedAttributes = [...new Set([...this.disallowedAttributes, ...attributes, ...convertedAttributes])];
        return this;
    }
}

export default AbstractFilter;