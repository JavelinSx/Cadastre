// components/admin/cadastral/AddDocumentModal.vue
<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                <h3 class="text-xl">Добавить документ</h3>
            </template>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <UFormGroup label="Название документа" name="type" required>
                    <UInput v-model="formData.type" placeholder="Введите название документа" />
                </UFormGroup>

                <UFormGroup label="Обязательный" name="isRequired">
                    <UCheckbox v-model="formData.isRequired" label="Документ обязателен" />
                </UFormGroup>

                <UFormGroup label="Статус документа" name="status">
                    <USelect v-model="formData.status" :options="documentStatusOptions" placeholder="Выберите статус" />
                </UFormGroup>

                <UFormGroup label="Комментарий" name="comment">
                    <UTextarea v-model="formData.comment" placeholder="Дополнительная информация" :rows="3" />
                </UFormGroup>

                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="ghost" @click="handleClose">
                        Отмена
                    </UButton>
                    <UButton type="submit" color="primary" :loading="loading" :disabled="!isValid || loading">
                        Добавить
                    </UButton>
                </div>
            </form>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import { DocumentStatus } from '~/types/documents'

interface FormData {
    type: string
    isRequired: boolean
    status: DocumentStatus | ''
    comment: string
}

const props = defineProps<{
    serviceId: string
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'document-added': []
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()
const loading = ref(false)
const isOpen = ref(props.modelValue)

const formData = ref<FormData>({
    type: '',
    isRequired: true,
    status: DocumentStatus.PENDING,
    comment: ''
})

const documentStatusOptions = [
    { label: 'Ожидает проверки', value: DocumentStatus.PENDING },
    { label: 'Проверен', value: DocumentStatus.VERIFIED },
    { label: 'Отклонен', value: DocumentStatus.REJECTED }
] as const

const isValid = computed(() => Boolean(formData.value.type && formData.value.status))

const resetForm = () => {
    formData.value = {
        type: '',
        isRequired: true,
        status: DocumentStatus.PENDING,
        comment: ''
    }
}

const handleClose = () => {
    resetForm()
    isOpen.value = false
    emit('update:modelValue', false)
}

const handleSubmit = async () => {
    if (!formData.value.type || !formData.value.status) return

    loading.value = true
    try {
        await cadastralStore.addServiceDocument(props.serviceId, {
            type: formData.value.type,
            isRequired: formData.value.isRequired,
            status: formData.value.status,
            comment: formData.value.comment || undefined
        })

        toast.success('Документ успешно добавлен')
        emit('document-added')
        handleClose()
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при добавлении документа')
    } finally {
        loading.value = false
    }
}

// Синхронизация с внешним состоянием
watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue
})

// Сброс формы при закрытии модального окна
watch(() => isOpen.value, (newValue) => {
    if (!newValue) {
        emit('update:modelValue', false)
        resetForm()
    }
})
</script>