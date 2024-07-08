import {AxiosError, AxiosResponse} from 'axios';

export const formatAxiosError = (error: AxiosError) => {
    if (error.response) {
        return {
            message: error.response.data.message || error.message,
            code: error.response.status,
            status: error.response.data.status,
            data: error.response.data.data,
            errors: error.response.data.errors || [],
        };
    }
    return {
        message: error.message,
        code: 500,
        status: 'error',
        data: null,
        errors: [],
    };
};
export const formatAxiosResponse = <T>(response: AxiosResponse<ResponseType<T>>): ResponseType<T> => {
    return {
        ...response.data,
        code: response.status,
        errors: [],
    };
};