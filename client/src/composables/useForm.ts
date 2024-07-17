import { ref, reactive, computed, watch } from 'vue';
import Joi from 'joi';
import { ResponseType } from '@/types/response.type';

interface UseFormOptions<T, R> {
    validationSchema: Joi.ObjectSchema<T>;
    transformers?: Partial<Record<keyof T, (value: any) => any>>;
    submitQuery: (values: T) => Promise<ResponseType<R>>;
    onSuccess?: (response: ResponseType<R>) => void;
    onError?: (error: any) => void;
}

export function useForm<T extends Record<string, any>, R>({
                                                              validationSchema,
                                                              transformers = {},
                                                              submitQuery,
                                                              onSuccess,
                                                              onError
                                                          }: UseFormOptions<T, R>) {
    const formData = reactive<T>({} as T);
    const errors = reactive<Partial<Record<keyof T, string>>>({});
    const serverError = ref<string | null>(null);
    const isSubmitting = ref(false);
    let abortController = ref(new AbortController());

    const validateField = (field: keyof T) => {
        if (!isFieldInSchema(field)) return;
        const { error } = validationSchema.extract(field).validate(formData[field]);
        if (error) errors[field] = error.details[0].message;
        else delete errors[field];
    };

    const isFieldInSchema = (field: keyof T) => {
        try {
            validationSchema.extract(field);
            return true;
        } catch (e) {
            return false;
        }
    }

    const getFillableFields = (data: object) => {
        if (!validationSchema) return data;
        const originalData = { ...data };
        const fillableFields = {};
        for (const key in formData) {
            if (isFieldInSchema(key))
                fillableFields[key] = originalData[key];
        }
        return fillableFields;
    }


    const validateForm = () => {
        for (const key in formData)
            validateField(key as keyof T);

        return Object.keys(errors).length === 0;
    };

    const updateFormData = (newData: Partial<T>) => {
        Object.keys(newData).forEach(key => {
            const typedKey = key as keyof T;
            if (transformers[typedKey])
                formData[typedKey] = transformers[typedKey]!(newData[typedKey]);
            else
                formData[typedKey] = newData[typedKey];
        });
        validateForm();
    };

    const initFormData = (newData: object) => {
        updateFormData(newData);
        watch(() => formData,
            (value,oldValue) => { updateFormData(value)}, { deep: true });
    }

    const handleSubmit = async () => {
        abort();
        abortController.value = new AbortController();
        if (!validateForm() && validationSchema) return;
        isSubmitting.value = true;
        serverError.value = null;
        try {
            const response = await submitQuery(getFillableFields(formData) as T);
            if (response.isSuccess) {
                onSuccess && onSuccess(response);
                updateFormData(response.data);
            } else {
                handleErrors(response);
            }
            return response;
        } catch (error) {
            onError && onError(error);
            serverError.value = (error as Error).message;
        } finally {
            isSubmitting.value = false;
        }
    };
    const handleFileChange = (event) => {
        const target = event.target as HTMLInputElement;
        const nameField = event.target.name;
        if (target.files && target.files.length > 0)
            formData[event.target.name] = target.files[0];
        else if(target.files.length === 0 && formData[nameField])
            delete formData[nameField];
    }
    const handleErrors = (response: ResponseType<R>) => {
        if (response.errors) {
            response.errors.forEach(error => {
                if (error.field)
                    errors[error.field as keyof T] = error.message;
                else
                    serverError.value = error.message;
            });
        }
    };

    const abort = () => {
        abortController.value.abort();
    }

    return {
        formData,
        errors,
        serverError,
        isSubmitting,
        initFormData,
        updateFormData,
        handleSubmit,
        handleFileChange,
        abort
    };
}