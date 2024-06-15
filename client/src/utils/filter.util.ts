import {FilterObject} from "@/types/filter-data.type.ts";

export default class Filter {
    private filters: FilterObject[] = [];

    add(name: string, key: string, value: string | number): void {
        let filterObject = this.filters.find(f => f.name === name);

        if (!filterObject) {
            filterObject = { name, filters: [] };
            this.filters.push(filterObject);
        }

        const existingFilter = filterObject.filters.find(f => f.key === key);

        if (existingFilter) {
            existingFilter.value = value;
        } else {
            filterObject.filters.push({ key, value });
        }
    }

    remove(name: string, key?: string): void {
        const filterIndex = this.filters.findIndex(f => f.name === name);

        if (filterIndex !== -1) {
            if (key) {
                const filterObject = this.filters[filterIndex];
                filterObject.filters = filterObject.filters.filter(f => f.key !== key);

                if (filterObject.filters.length === 0) {
                    this.filters.splice(filterIndex, 1);
                }
            } else {
                this.filters.splice(filterIndex, 1);
            }
        }
    }

    build(): FilterObject[] {
        return this.filters;
    }

    toString(): string {
        return this.filters.map(obj => {
            const filters = obj.filters.map(filter => `${filter.key}:${filter.value}`).join(',');
            return `f_${obj.name}=${filters}`;
        }).join('&');
    }
}
