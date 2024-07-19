export type CommandType = {
    id: string;
    userId: string;
    isPaid: boolean;
    paymentFailedMessage?: string;
    deliveryStatus: 'processing' | 'shipping' | 'delivered' | 'delivery_issue';
    createdAt: string;
    updatedAt: string;
    details: CommandDetailType[];
};

export type CommandDetailType = {
    id: string;
    commandeId: string;
    price: number;
    quantity: number;
    imageName: string;
    promotionName?: string;
    promotionValue?: number;
    createdAt: string;
    updatedAt: string;
};
