export const isEmpty = (value: object): boolean => {
    return Object.keys(value).length === 0;
}

export const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

export const toFormData = (fields: object | FormData): FormData => {
    if (fields instanceof FormData)
        return fields;
    const formData = new FormData();
    for (const key in fields)
        formData.append(key, fields[key]);
    return formData;
}