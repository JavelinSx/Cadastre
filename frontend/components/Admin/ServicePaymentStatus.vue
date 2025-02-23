<template>
    <div class="flex flex-row md:flex-col justify-between items-center">
        <p>Статус:</p>
        <div class="flex items-center gap-2 ml-2">
            <UBadge :color="service.payment ? 'green' : 'red'" variant="subtle" class="w-full max-w-[200px]">
                {{ service.payment ? 'Оплачено' : 'Не оплачено' }}
            </UBadge>
            <UButton :icon="service.payment ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle'"
                :color="service.payment ? 'red' : 'green'" variant="ghost" size="sm" :loading="loading"
                @click="togglePaymentStatus" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'

const props = defineProps<{
    service: CadastralService
}>()

const emit = defineEmits<{
    'update': [service: CadastralService]
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()
const loading = ref(false)

const togglePaymentStatus = async () => {
    loading.value = true
    try {
        const updatedService = await cadastralStore.updatePaymentStatus(
            props.service.id,
            !props.service.payment
        )
        if (updatedService) {
            emit('update', updatedService)
            toast.success(
                props.service.payment ?
                    'Статус изменен на "Не оплачено"' :
                    'Статус изменен на "Оплачено"'
            )
        }
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса оплаты')
    } finally {
        loading.value = false
    }
}
</script>