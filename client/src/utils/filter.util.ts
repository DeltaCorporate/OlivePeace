class FilterBuilder {
    private filters: { [key: string]: string[] } = {};
    private currentField: string | null = null;

    add(field: string): this {
        if (!this.filters[field])
            this.filters[field] = [];

        this.currentField = field;
        return this;
    }

    private setFilter(type: string, value: string): this {
        if (this.currentField) {
            this.filters[this.currentField] = this.filters[this.currentField].filter(f => !f.startsWith(`${type}:`));
            this.filters[this.currentField].push(`${type}:${value}`);
        }
        return this;
    }

    ord(direction: 'ASC' | 'DESC'): this {
        return this.setFilter('ord', direction);
    }

    min(value: number): this {
        return this.setFilter('min', value.toString());
    }

    max(value: number): this {
        return this.setFilter('max', value.toString());
    }
    logic(value: 'AND' | 'OR'){
        return this.setFilter('logic', value.toString());
    }
    contains(value: string): this {
        if (this.currentField) {
            const escapedValue = value.replace(/"/g, '\\"');
            this.filters[this.currentField] = this.filters[this.currentField].filter(f => !f.startsWith('contains:'));
            this.filters[this.currentField].push(`contains:"${escapedValue}"`);
        }
        return this;
    }

    remove(field: string, filter?: string): this {
        if (filter) {
            if (this.filters[field]) {
                this.filters[field] = this.filters[field].filter(f => !f.startsWith(filter));
                if (this.filters[field].length === 0)
                    delete this.filters[field];
            }
        } else
            delete this.filters[field];
        return this;
    }
    clean(): this {
        Object.keys(this.filters).forEach(field => {
            this.filters[field] = this.filters[field].filter(f => {
                const [type, value] = f.split(':');
                return value.trim() !== '' && !(type === 'contains' && value === '""');
            });
            if (this.filters[field].length === 0)
                delete this.filters[field];
        });
        return this;
    }
    clear(): this {
        this.filters = {};
        this.currentField = null;
        return this;
    }
    build(): string {
        this.clean();  // Ensure the filters are cleaned before building the query string
        return Object.entries(this.filters)
            .map(([field, criteria]) => `f_${field}=${criteria.join(',')}`)
            .join('&');
    }
}

export default FilterBuilder;