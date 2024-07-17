export const isEmpty = (value: object): boolean => {
    return Object.keys(value).length === 0;
}

export const autoResize = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}