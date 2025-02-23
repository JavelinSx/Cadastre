<template>
    <UCard class="md:col-span-2">
        <template #header>
            <h2 class="text-xl">Основная информация</h2>
        </template>

        <form @submit.prevent="onSubmit" class="space-y-4">
            <UFormGroup label="ФИО" name="fullName" :error="errors.fullName">
                <UInput v-model="formData.fullName" placeholder="Введите ФИО" @blur="validateField('fullName')" />
            </UFormGroup>

            <UFormGroup label="Email" name="email" :error="errors.email">
                <UInput v-model="formData.email" type="email" placeholder="example@mail.com"
                    @blur="validateField('email')" />
            </UFormGroup>

            <UFormGroup label="Телефон" name="phone" :error="errors.phone">
                <PhoneInput v-model="formData.phone" placeholder="8 (999) 999-99-99" @blur="validateField('phone')" />
            </UFormGroup>

            <div class="flex justify-end">
                <UButton type="submit" color="primary" :loading="loading" :disabled="!isFormValid || loading">
                    Сохранить изменения
                </UButton>
            </div>
        </form>
    </UCard>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAdminUsersStore } from '~/stores/admin/users';
import { useToast } from 'vue-toastification';
import type { User } from '~/types/users';
import PhoneInput from '../UI/PhoneInput.vue';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
}

interface FormErrors {
    fullName: string;
    email: string;
    phone: string;
}

const props = defineProps<{
    user: User | null;
}>();

const adminUsersStore = useAdminUsersStore();
const toast = useToast();
const loading = ref(false);

const formData = ref<FormData>({
    fullName: '',
    email: '',
    phone: ''
});

const errors = ref<FormErrors>({
    fullName: '',
    email: '',
    phone: ''
});

const isFormValid = computed(() => {
    return !Object.values(errors.value).some(error => error !== '') &&
        (formData.value.email || formData.value.phone) &&
        formData.value.fullName;
});

// Валидация полей
const validators = {
    fullName: (value: string) => {
        if (!value.trim()) return 'ФИО обязательно для заполнения';
        if (value.length < 5) return 'ФИО должно быть не менее 5 символов';
        if (!/^[а-яА-ЯёЁ\s-]+$/.test(value)) return 'ФИО может содержать только русские буквы';
        return '';
    },
    email: (value: string) => {
        if (!value) return '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Неверный формат email';
        return '';
    },
    phone: (value: string) => {
        if (!value) return '';
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 11 && cleaned.length !== 0) return 'Номер телефона должен содержать 11 цифр';

        // Проверяем формат с учетом +7
        if (value.startsWith('+') && !value.startsWith('+7')) {
            return 'Неверный формат номера';
        }
        return '';
    }
};

const validateField = (field: keyof FormData) => {
    errors.value[field] = validators[field](formData.value[field]);
};

const validateForm = (): boolean => {
    let isValid = true;
    Object.keys(formData.value).forEach((field) => {
        validateField(field as keyof FormData);
        if (errors.value[field as keyof FormData]) {
            isValid = false;
        }
    });

    if (!formData.value.email && !formData.value.phone) {
        toast.error('Необходимо указать email или телефон');
        isValid = false;
    }

    return isValid;
};

watch(() => props.user, (newUser) => {
    if (newUser) {
        formData.value = {
            fullName: newUser.fullName || '',
            email: newUser.email || '',
            phone: newUser.phone || ''
        };
        Object.keys(errors.value).forEach(key => {
            errors.value[key as keyof FormErrors] = '';
        });
    }
}, { immediate: true });

const onSubmit = async () => {
    if (!props.user?.id) {
        toast.error('Не удалось обновить пользователя: ID пользователя не найден');
        return;
    }

    if (!validateForm()) {
        return;
    }

    loading.value = true;
    try {
        // Отправляем данные как есть, без дополнительного форматирования
        await adminUsersStore.updateUser(props.user.id, formData.value);
        toast.success('Данные пользователя успешно обновлены');
    } catch (error: any) {
        console.error('Ошибка при обновлении пользователя:', error);
        toast.error(error.message || 'Не удалось обновить пользователя');
    } finally {
        loading.value = false;
    }
};
</script>