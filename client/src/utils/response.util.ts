import {AxiosError, AxiosResponse} from 'axios';

export const formatAxiosError = (error: AxiosError) => {
    if (error.response) {
        return {
            message: error.response.data.message || error.message,
            code: error.response.status,
            isSuccess: false,
            data: error.response.data.data,
            errors: error.response.data.errors || [],
        };
    }
    return {
        message: error.message,
        code: 500,
        isSuccess: false,
        data: null,
        errors: [],
    };
};
export const formatAxiosResponse = <T>(response: AxiosResponse<ResponseType<T>>): ResponseType<T> => {
    return {
        ...response.data,
        isSuccess: true,
        code: response.status,
    };
};