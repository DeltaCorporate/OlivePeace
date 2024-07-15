class FilterBuilder {
    public filters: { [key: string]: string[] } = {};

    add(field: string): this {
        if (!this.filters[field]) this.filters[field] = [];
        return this;
    }

    contains(value: string): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`contains:${value}`);
        return this;
    }
    equal(value: string): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`equal:${value}`);
        return this;
    }

    logic(value: 'AND' | 'OR'): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`logic:${value}`);
        return this;
    }
    min(value: number): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`min:${value}`);
        return this;
    }
    max(value: number): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`max:${value}`);
        return this;
    }
    ord(direction: 'ASC' | 'DESC'): this {
        const field = Object.keys(this.filters).pop();
        if (field) this.filters[field].push(`ord:${direction}`);
        return this;
    }
    clear(){
        this.filters = {};
    }
    build(): string {
        return Object.entries(this.filters)
            .map(([field, criteria]) => `f_${field}=${criteria.join(',')}`)
            .join('&');
    }
}

export default FilterBuilder;