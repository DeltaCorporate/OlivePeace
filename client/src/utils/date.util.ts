export function toFrenchDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
export function getCurrentYear(){
    return new Date().getFullYear();
}