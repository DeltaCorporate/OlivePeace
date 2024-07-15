import {AxiosError, AxiosResponse} from 'axios';

export const formatAxiosError = (error: AxiosError) => {
    if (error.response) {
        return {
            code: error.response.status,
            isSuccess: false,
            errors: error.response.data || [],
        };
    }
    return {
        code: 500,
        isSuccess: false,
        errors: [],
    };
};
export const formatAxiosResponse = <T>(response: AxiosResponse<ResponseType<T>>): ResponseType<T> => {
        const data = response.data.data ? [...response.data.data] : {...response.data};

        const result = {
            data,
            isSuccess: true,
            code: response.status,
        };
        if(response.data.pagination)
            result.pagination = {...response.data.pagination};
        return result;
};