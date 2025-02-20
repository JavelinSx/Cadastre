# components/admin/users/UserInfoCard.vue
<template>
    <UCard class="md:col-span-2">
        <template #header>
            <h2 class="text-xl">Основная информация</h2>
        </template>

        <form @submit.prevent="onSubmit" class="space-y-4">
            <UFormGroup label="ФИО" name="fullName">
                <UInput v-model="formData.fullName" placeholder="Введите ФИО" />
            </UFormGroup>

            <UFormGroup label="Email" name="email">
                <UInput v-model="formData.email" type="email" placeholder="example@mail.com" />
            </UFormGroup>

            <UFormGroup label="Телефон" name="phone">
                <UInput v-model="formData.phone" type="tel" placeholder="+7 (999) 999-99-99" />
            </UFormGroup>

            <div class="flex justify-end">
                <UButton type="submit" color="primary" :loading="loading">
                    Сохранить изменения
                </UButton>
            </div>
        </form>
    </UCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '~/types'

interface Props {
    user: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    update: [data: { fullName?: string; email?: string; phone?: string }]
}>()

const loading = ref(false)
const formData = ref({
    fullName: '',
    email: '',
    phone: ''
})

// Следим за изменениями props.user
watch(() => props.user, (newUser) => {
    if (newUser) {
        formData.value = {
            fullName: newUser.fullName || '',
            email: newUser.email || '',
            phone: newUser.phone || ''
        }
    }
}, { immediate: true })

const onSubmit = async () => {
    loading.value = true
    try {
        emit('update', formData.value)
    } finally {
        loading.value = false
    }
}
</script>