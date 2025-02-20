// components/admin/users/ServiceHeader.vue
<template>
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-lg font-medium">{{ getServiceTypeName(service.type) }}</h3>
            <p class="text-sm text-gray-500">
                Создано: {{ formatDate(service.createdAt) }}
            </p>
            <p v-if="service.completedAt" class="text-sm text-green-600">
                Завершено: {{ formatDate(service.completedAt) }}
            </p>
            <p v-if="service.comment" class="text-sm text-gray-600 mt-1">
                {{ service.comment }}
            </p>
        </div>

        <div class="flex items-center gap-4">
            <UBadge v-if="!service.payment" color="red" variant="subtle">
                Не оплачено
            </UBadge>
            <UBadge v-if="service.price" color="blue" variant="subtle">
                {{ formatPrice(service.price) }}
            </UBadge>
            <USelect v-model="status" :options="serviceStatusOptions"
                @update:model-value="(newStatus: ServiceStatus) => handleStatusChange(newStatus)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { ServiceStatus, CadastralServiceType } from '~/types/cadastral'
import { formatDate, formatPrice } from '~/utils/formatters'

const props = defineProps<{
    service: CadastralService
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()
const status = ref<ServiceStatus>(props.service.status)

watch(() => props.service.status, (newStatus) => {
    status.value = newStatus
})

const serviceStatusOptions = [
    { label: 'Первичная консультация', value: ServiceStatus.CONSULTATION },
    { label: 'Сбор документов', value: ServiceStatus.DOCUMENTS_COLLECTION },
    { label: 'Съёмка объекта', value: ServiceStatus.OBJECT_SURVEY },
    { label: 'Подготовка чертежей', value: ServiceStatus.DRAWING_PREPARATION },
    { label: 'Формирование пакета документов', value: ServiceStatus.PACKAGE_PREPARATION },
    { label: 'Ожидание ответа из Росреестра', value: ServiceStatus.AWAITING_RESPONSE },
    { label: 'Отказ Росреестра', value: ServiceStatus.REJECTED },
    { label: 'Готово к выдаче', value: ServiceStatus.COMPLETED },
    { label: 'Ожидает оплаты', value: ServiceStatus.READY_FOR_PAYMENT }
] as const

const serviceTypeNames: Record<CadastralServiceType, string> = {
    [CadastralServiceType.LAND_SURVEY]: 'Межевание земельного участка',
    [CadastralServiceType.BUILDING_PLAN]: 'Технический план здания',
    [CadastralServiceType.ROOM_PLAN]: 'Технический план помещения',
    [CadastralServiceType.INSPECTION_ACT]: 'Акт обследования',
    [CadastralServiceType.LAND_LAYOUT]: 'Схема расположения ЗУ'
}

const getServiceTypeName = (type: CadastralServiceType): string => {
    return serviceTypeNames[type]
}

const handleStatusChange = async (newStatus: ServiceStatus): Promise<void> => {
    try {
        await cadastralStore.updateServiceStatus(props.service.id, newStatus)
        toast.success('Статус услуги успешно обновлен')
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса услуги')
        status.value = props.service.status
    }
}
</script>