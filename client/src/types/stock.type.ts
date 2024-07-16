export type StockType = {
    _id?: number;
    product?: {
        _id: number;
        name: string;
        imageName: string;
    };
    quantity?: number;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
};
