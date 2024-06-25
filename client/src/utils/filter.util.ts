class FilterBuilder {
    private filters: { [key: string]: string[] } = {};
    private currentField: string | null = null;

    add(field: string): this {
        if (!this.filters[field]) {
            this.filters[field] = [];
        }
        this.currentField = field;
        return this;
    }

    ord(direction: 'ASC' | 'DESC'): this {
        if (this.currentField) {
            this.filters[this.currentField].push(`ord:${direction}`);
        }
        return this;
    }

    min(value: number): this {
        if (this.currentField) {
            this.filters[this.currentField].push(`min:${value}`);
        }
        return this;
    }

    max(value: number): this {
        if (this.currentField) {
            this.filters[this.currentField].push(`max:${value}`);
        }
        return this;
    }

    contains(value: string): this {
        if (this.currentField) {
            // Échapper les guillemets dans la valeur pour éviter les conflits
            const escapedValue = value.replace(/"/g, '\\"');
            this.filters[this.currentField].push(`contains:"${escapedValue}"`);
        }
        return this;
    }

    build(): string {
        return Object.entries(this.filters)
            .map(([field, criteria]) => `f_${field}=${criteria.join(',')}`)
            .join('&');
    }
}

export default FilterBuilder;
