// components/admin/users/AddServiceModal.vue
<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                <h3 class="text-xl">Добавить кадастровую услугу</h3>
            </template>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <UFormGroup label="Тип услуги" name="type" required>
                    <USelect v-model="formData.type" :options="serviceTypeOptions" placeholder="Выберите тип услуги" />
                </UFormGroup>

                <UFormGroup label="Стоимость" name="price">
                    <UInput v-model.number="formData.price" type="number" min="0" step="100"
                        placeholder="Введите стоимость" />
                </UFormGroup>

                <UFormGroup label="Комментарий" name="comment">
                    <UTextarea v-model="formData.comment" placeholder="Дополнительная информация" rows="3" />
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
import { CadastralServiceType } from '~/types/cadastral'

interface FormData {
    type: CadastralServiceType | ''
    price: number | null
    comment: string
}

const props = defineProps<{
    userId: string
    modelValue: boolean
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()
const loading = ref(false)
const isOpen = ref(props.modelValue)

const formData = ref<FormData>({
    type: '',
    price: null,
    comment: ''
})

const serviceTypeOptions = [
    { label: 'Межевание земельного участка', value: CadastralServiceType.LAND_SURVEY },
    { label: 'Технический план здания', value: CadastralServiceType.BUILDING_PLAN },
    { label: 'Технический план помещения', value: CadastralServiceType.ROOM_PLAN },
    { label: 'Акт обследования', value: CadastralServiceType.INSPECTION_ACT },
    { label: 'Схема расположения ЗУ', value: CadastralServiceType.LAND_LAYOUT }
] as const

const isValid = computed(() => Boolean(formData.value.type))

const resetForm = () => {
    formData.value = {
        type: '',
        price: null,
        comment: ''
    }
}

const handleClose = () => {
    resetForm()
    isOpen.value = false
}

const handleSubmit = async () => {
    if (!formData.value.type) return

    loading.value = true
    try {
        await cadastralStore.addUserService(props.userId, {
            type: formData.value.type,
            price: formData.value.price || undefined,
            comment: formData.value.comment || undefined
        })

        toast.success('Услуга успешно добавлена')
        handleClose()
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при добавлении услуги')
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
        resetForm()
    }
})
</script>