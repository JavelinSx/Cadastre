// components/admin/users/ServicePayment.vue
<template>
    <div class="mt-4 pt-4 border-t flex justify-between items-center">
        <div v-if="service.price" class="text-sm">
            <span class="font-medium">Стоимость:</span>
            {{ formatPrice(service.price) }}
        </div>
        <UButton 
            v-if="canUpdatePayment"
            color="primary"
            @click="handlePaymentUpdate"
        >
            Отметить как оплаченное
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { formatPrice } from '~/utils/formatters'

const props = defineProps<{
    service: CadastralService
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()

const canUpdatePayment = computed(() => 
    !props.service.payment && props.service.status === 'ready_for_payment'
)

const handlePaymentUpdate = async () => {
    try {
        await cadastralStore.updatePaymentStatus(props.service.id, true)
        toast.success('Статус оплаты успешно обновлен')
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса оплаты')
    }
}
</script>