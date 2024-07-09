import { reactive, ref } from 'vue';
import Joi, { Schema } from 'joi';

interface UseFormOptions<T> {
    initialValues: T;
    validationSchema: Schema;
    onSubmit: (values: T, signal: AbortSignal) => Promise<ResponseType<T>>;
}

export function useForm<T>({ initialValues, validationSchema, onSubmit }: UseFormOptions<T>) {
    const formData = reactive({ ...initialValues });
    const errors = reactive({} as Record<keyof T, string>);
    const isSubmitting = ref(false);
    const isSubmitted = ref(false);
    const serverError = ref<{ message: string; code: number } | null>(null);
    let abortController = new AbortController();

    const validate = () => {
        const { error } = validationSchema.validate(formData, { abortEarly: false });
        if (error) {
            error.details.forEach(err => {
                const path = err.path[0] as keyof T;
                errors[path] = err.message;
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        isSubmitting.value = true;
        serverError.value = null;
        abortController = new AbortController();

        try {
            const response = await onSubmit(formData, abortController.signal);
            if (response.status === 'error') {
                serverError.value = { message: response.message, code: response.code };
            } else {
                isSubmitted.value = true;
                serverError.value = null;
            }
        } catch (error) {
            console.error(error);
            serverError.value = { message: error.message, code: 500 }; // Or set a more appropriate code
        } finally {
            isSubmitting.value = false;
        }
    };

    const resetErrors = () => {
        Object.keys(errors).forEach(key => {
            errors[key as keyof T] = '';
        });
        serverError.value = null;
    };

    const abortRequest = () => {
        abortController.abort();
    };

    return {
        formData,
        errors,
        isSubmitting,
        isSubmitted,
        serverError,
        validate,
        handleSubmit,
        resetErrors,
        abortRequest,
    };
}
