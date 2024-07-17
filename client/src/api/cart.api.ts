import apiClient from '@/../config/axios.ts';

export const fetchCart = async (userId: string) => {
    try {
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart data', error);
        throw error;
    }
};
