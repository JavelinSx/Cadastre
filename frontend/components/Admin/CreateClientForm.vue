# components/admin/CreateClientForm.vue
<template>
    <UCard class="border p-8 rounded max-w-md mx-auto">
        <template #header>
            <h2 class="text-xl font-semibold">Создание клиента</h2>
        </template>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
            <!-- Previous template code remains the same -->
            <div class="flex gap-4 mb-4">
                <URadio v-model="contactType" value="email" label="Email" name="contact-type" />
                <URadio v-model="contactType" value="phone" label="Телефон" name="contact-type" />
            </div>

            <InputForm :model-value="getContactValue" @update:model-value="updateContactValue" :name="contactType"
                :label="contactType === 'email' ? 'Почта' : 'Телефон'"
                :placeholder="contactType === 'email' ? 'example@mail.com' : '+7 999 999 99 99'"
                :error="errors[contactType]" :type="contactType === 'email' ? 'email' : 'tel'"
                @blur="validateContact" />

            <InputForm v-model="formData.password" name="password" label="Пароль" placeholder="Введите пароль"
                type="password" :show-password-toggle="true" :error="errors.password" @blur="validatePassword" />

            <div v-if="globalError" class="text-red-500 text-sm">
                {{ globalError }}
            </div>

            <UButton type="submit" :loading="loading" :disabled="hasErrors || loading" class="mt-4">
                {{ loading ? 'Создание...' : 'Создать' }}
            </UButton>
        </form>
    </UCard>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAdminUsersStore } from '~/stores/admin/users'
import { useToast } from 'vue-toastification'
import InputForm from '../UI/InputForm.vue'

type ContactType = 'email' | 'phone'

const adminUsersStore = useAdminUsersStore()
const loading = ref(false)
const contactType = ref<ContactType>('email')
const globalError = ref('')
const toast = useToast()

// Previous code with types and validations remains the same...
interface FormData {
    email: string;
    phone: string;
    password: string;
}

interface FormErrors {
    email: string;
    phone: string;
    password: string;
}

const formData = reactive<FormData>({
    email: '',
    phone: '',
    password: ''
})

const errors = reactive<FormErrors>({
    email: '',
    phone: '',
    password: ''
})

// All previous validation methods remain the same...
const getContactValue = computed(() => formData[contactType.value])

const updateContactValue = (value: string) => {
    formData[contactType.value] = value
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(phone)
}

const validatePassword = () => {
    const password = formData.password
    if (password.length < 10) {
        errors.password = 'Минимум 10 символов'
        return false
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/.test(password)) {
        errors.password = 'Пароль должен содержать буквы и цифры'
        return false
    }
    errors.password = ''
    return true
}

const validateContact = () => {
    const value = formData[contactType.value]
    if (!value) {
        errors[contactType.value] = `${contactType.value === 'email' ? 'Email' : 'Телефон'} обязателен`
        return false
    }

    if (contactType.value === 'email') {
        if (!validateEmail(value)) {
            errors.email = 'Некорректный email'
            return false
        }
    } else {
        if (!validatePhone(value)) {
            errors.phone = 'Некорректный номер телефона'
            return false
        }
    }

    errors[contactType.value] = ''
    return true
}

const hasErrors = computed(() => {
    return Object.values(errors).some(error => error !== '') ||
        !formData[contactType.value] ||
        !formData.password
})

const clearForm = () => {
    formData.email = ''
    formData.phone = ''
    formData.password = ''
    globalError.value = ''
    Object.keys(errors).forEach(key => {
        errors[key as keyof FormErrors] = ''
    })
}

const handleError = (error: any) => {
    if (error.response?.status === 409) {
        const contactTypeText = contactType.value === 'email' ? 'Email' : 'Телефон';
        globalError.value = `${contactTypeText} уже используется`;
        toast.error(`${contactTypeText} уже используется`);
    } else if (error.message === 'Network Error') {
        globalError.value = 'Ошибка сети. Проверьте подключение';
        toast.error('Ошибка сети. Проверьте подключение');
    } else {
        globalError.value = error.message || 'Произошла ошибка при создании клиента';
        toast.error('Произошла ошибка при создании клиента');
    }
};

const onSubmit = async () => {
    if (!validateContact() || !validatePassword()) {
        return;
    }

    loading.value = true;
    globalError.value = '';

    try {
        await adminUsersStore.createClient({
            [contactType.value]: formData[contactType.value],
            password: formData.password,
        });

        toast.success('Клиент успешно создан');
        clearForm();
    } catch (error: any) {
        handleError(error);
    } finally {
        loading.value = false;
    }
};
</script>