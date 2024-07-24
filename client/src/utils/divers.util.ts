import {useAuthStore} from "@/stores/auth.store.ts";

export const isEmpty = (value: object): boolean => {
    return Object.keys(value).length === 0;
}

export const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

export const slugify = (text: string): string => {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/ /g, '-')
        .replace(/^-+|-+$/g, '');
}

export const isNullUndefined = (value: any): boolean => {
    return value == 'undefined' || value === null;
}

export const hasRoles = (roles: string[]) => {
    let authStore = useAuthStore();
    if(!authStore.isAuthenticated) return false;
    return roles.some(role => authStore.user.roles.includes(role));
}
export const getNestedValue = (obj: any, path: string | undefined): any => {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((prev, curr) => {
        return prev && typeof prev === 'object' ? prev[curr] : undefined;
    }, obj);
};

export const toFrenchPrice: string  = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export const object2Array = (obj: object): any[] => {
    return Object.keys(obj).map(key => obj[key]);
}

export const array2Object = (arr: any[]): object => {
    return arr.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});
}