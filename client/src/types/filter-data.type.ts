interface FilterItem {
    key: string;
    value: string | number;
}

export interface FilterObject {
    name: string;
    filters: FilterItem[];
}