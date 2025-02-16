# pages/login-admin.vue
<template>
    <UCard class="border p-8 rounded max-w-md mx-auto">
        <template #header>Форма авторизации</template>

        <UForm :schema="schema" :state="formState" @submit="onSubmit" :loading="loading" class="flex flex-col gap-2">
            <InputForm v-model="formState.login" label="Логин" name="login" placeholder="Andrey"
                :error="errors.login" />

            <InputForm v-model="formState.password" label="Пароль" name="password" type="password"
                :show-password-toggle="true" :error="errors.password" />

            <div v-if="error" class="text-red-500 mb-4">
                {{ error }}
            </div>

            <UButton type="submit" :loading="loading" class="mt-4 flex flex-row items-center justify-center pt-2 pb-2">
                {{ loading ? 'Вход...' : 'Войти' }}
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import InputForm from '~/components/UI/InputForm.vue'
import { z } from 'zod'
import { computed, reactive, ref } from 'vue'
import { navigateTo } from 'nuxt/app'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { useAdminAuthStore } from '~/stores/auth/auth.admin'



const adminStore = useAdminAuthStore();


const loading = computed(() => adminStore.loading);

const schema = z.object({
    login: z.string()
        .min(4, 'Минимум 4 символа')
        .regex(/^[a-zA-Z0-9]*$/, 'Только буквы, цифры'),
    password: z.string()
        .min(10, 'Минимум 10 символов')
        .regex(
            /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
            'Недопустимые символы в пароле'
        )
});

const formState = reactive({
    login: '',
    password: ''
});

const errors = reactive({
    login: '',
    password: ''
});

const error = ref<string | null>(null);

const onSubmit = async (event: FormSubmitEvent<typeof schema>) => {
    console.log('Submit attempt');
    errors.login = '';
    errors.password = '';
    error.value = null;

    try {

        const result = await adminStore.login({
            login: formState.login,
            password: formState.password
        });


        await navigateTo('/admin/orders');
    } catch (e: any) {


        // Обрабатываем разные типы ошибок
        if (e.response?.status === 401) {
            error.value = 'Неверный логин или пароль';
        } else if (e.message === 'Network Error') {
            error.value = 'Ошибка сети. Проверьте подключение';
        } else if (e.message.includes('access_token')) {
            error.value = 'Ошибка авторизации. Попробуйте позже';
        } else {
            error.value = e.message || 'Произошла ошибка при входе';
        }

        // Обрабатываем ошибки валидации если есть
        if (e.response?.data?.errors) {
            errors.login = e.response.data.errors.login?.[0] || '';
            errors.password = e.response.data.errors.password?.[0] || '';
        }
    }
};
</script>