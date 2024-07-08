import { reactive, ref } from 'vue';
import Joi, { Schema } from 'joi';

interface UseFormOptions<T> {
    initialValues: T;
    validationSchema: Schema;
    onSubmit: (values: T) => Promise<void>;
}

export function useForm<T>({ initialValues, validationSchema, onSubmit }: UseFormOptions<T>) {
    const formData = reactive({ ...initialValues });
    const errors = reactive({} as Record<keyof T, string>);
    const isSubmitting = ref(false);
    const isSubmitted = ref(false);

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
        try {
            await onSubmit(formData);
            isSubmitted.value = true;
        } catch (error) {
            console.error(error);
        } finally {
            isSubmitting.value = false;
        }
    };

    const resetErrors = () => {
        Object.keys(errors).forEach(key => {
            errors[key as keyof T] = '';
        });
    };

    return {
        formData,
        errors,
        isSubmitting,
        isSubmitted,
        validate,
        handleSubmit,
        resetErrors,
    };
}
