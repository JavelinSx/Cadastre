<template>
    <div class="flex flex-row md:flex-col justify-between items-center">
        <p>Цена:</p>
        <div class="flex items-center gap-2 ml-2">
            <UBadge v-if="!isEditing && service.price" color="blue" variant="subtle" class="w-full max-w-[200px]">
                {{ formatPrice(service.price) }}
            </UBadge>
            <UInput v-if="isEditing" v-model="priceInput" type="number" min="0" step="100" class="w-[150px]" />
            <UButton v-if="!isEditing" icon="i-heroicons-pencil" color="gray" variant="ghost" size="sm"
                @click="startEditing" />
            <template v-else>
                <UButton icon="i-heroicons-check" color="green" variant="ghost" size="sm" :loading="loading"
                    @click="savePrice" />
                <UButton icon="i-heroicons-x-mark" color="red" variant="ghost" size="sm" @click="cancelEditing" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { formatPrice } from '~/utils/formatters'

const props = defineProps<{
    service: CadastralService
}>()

const emit = defineEmits<{
    'update': [service: CadastralService]
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()
const loading = ref(false)
const isEditing = ref(false)
const priceInput = ref<number>(props.service.price || 0)

const startEditing = () => {
    priceInput.value = props.service.price || 0
    isEditing.value = true
}

const cancelEditing = () => {
    isEditing.value = false
    priceInput.value = props.service.price || 0
}

const savePrice = async () => {
    if (priceInput.value < 0) return

    loading.value = true
    try {
        const updatedService = await cadastralStore.updateServicePrice(props.service.id, priceInput.value)
        if (updatedService) {
            emit('update', updatedService)
            toast.success('Стоимость успешно обновлена')
            isEditing.value = false
        }
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении стоимости')
    } finally {
        loading.value = false
    }
}
</script>