<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="formData.email" type="email" class="form-control" />
      <span class="error" v-if="errors.email">{{ errors.email }}</span>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input id="password" v-model="formData.password" type="password" class="form-control" />
      <span class="error" v-if="errors.password">{{ errors.password }}</span>
    </div>
    <button type="submit" class="btn" :disabled="isSubmitting">Submit</button>
    <span class="success" v-if="isSubmitted">Form submitted successfully!</span>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useForm } from '@/composables/useForm';
import Joi from 'joi';

export default defineComponent({
  setup() {
    const validationSchema = Joi.object({
      email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Invalid email address',
        'string.empty': 'Email is required',
      }),
      password: Joi.string().min(12).pattern(new RegExp('[a-z]')).pattern(new RegExp('[A-Z]')).pattern(new RegExp('[0-9]')).pattern(new RegExp('[^a-zA-Z0-9]')).required().messages({
        'string.min': 'Password must be at least 12 characters',
        'string.pattern.base': 'Password must contain lowercase, uppercase, number, and special character',
        'string.empty': 'Password is required',
      }),
    });

    const { formData, errors, isSubmitting, isSubmitted, handleSubmit } = useForm({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema,
      onSubmit: async (values) => {
        // simulate form submission
        return new Promise((resolve) => setTimeout(resolve, 1000));
      },
    });

    return {
      formData,
      errors,
      isSubmitting,
      isSubmitted,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.success {
  color: green;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}
</style>
