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

