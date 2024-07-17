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

export const pickError = (errors: ErrorObject[], field?: string): { field?: string; message: string } | null => {
    if (!Array.isArray(errors) || errors.length === 0) return null;
    if (field) {
        const errorWithField = errors.find(error => error.field === field);
        if (errorWithField) return errorWithField;
    } else {
        for (let i = errors.length - 1; i >= 0; i--)
            if (!errors[i].field) return { message: errors[i].message };
    }
    return {field: null, message:null};
};