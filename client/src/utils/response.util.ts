import {AxiosError, AxiosResponse} from 'axios';

export const formatAxiosError = (error: AxiosError) => {
    if (error.response) {
        return {
            code: error.response.status,
            isSuccess: false,
            errors: error.response.data.errors || [],
        };
    }
    return {
        code: 500,
        isSuccess: false,
        errors: [],
    };
};
export const formatAxiosResponse = <T>(response: AxiosResponse<ResponseType<T>>): ResponseType<T> => {
    return {
        ...response.data,
        ...response.pagination,
        isSuccess: true,
        code: response.status,
    };
};