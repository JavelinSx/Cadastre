# components/admin/CreateClientForm.vue
<template>
    <UCard class="border p-8 rounded max-w-md mx-auto">
        <template #header>
            <h2 class="text-xl font-semibold">Создание клиента</h2>
        </template>

        <UForm :schema="schema" :state="formState" @submit="onSubmit" class="flex flex-col gap-2">
            <!-- Переключатель типа контакта -->
            <div class="flex gap-4 mb-4">
                <URadio v-model="contactType" value="email" label="Email" name="contact-type" />
                <URadio v-model="contactType" value="phone" label="Телефон" name="contact-type" />
            </div>

            <!-- Динамическое поле контакта -->
            <InputForm v-model="formState[contactType]" :name="contactType"
                :label="contactType === 'email' ? 'Почта' : 'Телефон'"
                :placeholder="contactType === 'email' ? 'example@mail.com' : '+7 999 999 99 99'"
                :error="errors[contactType]" :type="contactType === 'email' ? 'email' : 'tel'" />

            <InputForm v-model="formState.password" name="password" label="Пароль" placeholder="Введите пароль"
                type="password" :show-password-toggle="true" :error="errors.password" />

            <div v-if="error" class="text-red-500 mb-4">
                {{ error }}
            </div>

            <UButton type="submit" :loading="loading" class="mt-4 flex flex-row items-center justify-center pt-2 pb-2">
                {{ loading ? 'Создание...' : 'Создать' }}
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import InputForm from './UI/InputForm'
import { computed, reactive, ref } from 'vue'
import { useAdminUsersStore } from '~/stores/admin/users'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const adminUsersStore = useAdminUsersStore()
const loading = ref(false)
const contactType = ref<'email' | 'phone'>('email')
const error = ref<string | null>(null)

const formState = reactive({
    email: '',
    phone: '',
    password: ''
})

const errors = reactive({
    email: '',
    phone: '',
    password: ''
})

// Динамическая схема валидации в зависимости от типа контакта
const schema = computed(() => {
    const baseSchema = {
        password: z.string()
            .min(10, 'Минимум 10 символов')
            .regex(
                /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
                'Недопустимые символы в пароле'
            )
    }

    if (contactType.value === 'email') {
        return z.object({
            ...baseSchema,
            email: z.string()
                .email('Введите корректный email')
                .min(1, 'Email обязателен'),
            phone: z.string().optional()
        })
    } else {
        return z.object({
            ...baseSchema,
            phone: z.string()
                .regex(/^\+?[\d\s-]{10,}$/, 'Введите корректный номер телефона')
                .min(1, 'Телефон обязателен'),
            email: z.string().optional()
        })
    }
})

const clearErrors = () => {
    errors.email = ''
    errors.phone = ''
    errors.password = ''
    error.value = null
}

const onSubmit = async (event: FormSubmitEvent<typeof schema>) => {
    clearErrors()
    loading.value = true

    try {
        const userData = {
            password: formState.password,
            [contactType.value]: formState[contactType.value]
        }

        await adminUsersStore.createUser(userData)

        // Очищаем форму после успешного создания
        formState.email = ''
        formState.phone = ''
        formState.password = ''

        // Показываем уведомление об успехе
        const { toast } = useToast()
        toast({
            title: 'Успешно',
            description: 'Клиент успешно создан',
            color: 'green'
        })

    } catch (e: any) {
        // Обработка ошибок
        if (e.response?.status === 409) {
            error.value = 'Пользователь с таким email/телефоном уже существует'
        } else if (e.message === 'Network Error') {
            error.value = 'Ошибка сети. Проверьте подключение'
        } else {
            error.value = e.message || 'Произошла ошибка при создании клиента'
        }

        // Обработка ошибок валидации
        if (e.response?.data?.errors) {
            errors.email = e.response.data.errors.email?.[0] || ''
            errors.phone = e.response.data.errors.phone?.[0] || ''
            errors.password = e.response.data.errors.password?.[0] || ''
        }
    } finally {
        loading.value = false
    }
}

function useToast(): { toast: any } {
    throw new Error('Function not implemented.')
}
</script>