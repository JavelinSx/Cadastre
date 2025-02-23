<template>
    <div class="flex flex-col md:flex-row justify-between items-start mb-4">
        <div class="mt-4">
            <p>Текущий статус услуги:</p>
            <USelect v-model="status" :options="serviceStatusOptions"
                @update:model-value="(newStatus: ServiceStatus) => handleStatusChange(newStatus)" />

            <div class="flex flex-col justify-between w-full mt-4 gap-2">
                <ServicePriceControl :service="service" @update="handleServiceUpdate" />

                <ServicePaymentStatus :service="service" @update="handleServiceUpdate" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { ServiceStatus, CadastralServiceType } from '~/types/cadastral'
import ServicePaymentStatus from './ServicePaymentStatus.vue'
import ServicePriceControl from './ServicePriceControl .vue'

const props = defineProps<{
    service: CadastralService
}>()

const emit = defineEmits<{
    update: [service: CadastralService]
}>()

const handleServiceUpdate = (updatedService: CadastralService) => {
    emit('update', updatedService)
}

const toast = useToast();
const cadastralStore = useAdminCadastralStore();
const status = ref<ServiceStatus>(props.service.status);

watch(() => props.service.status, (newStatus) => {
    status.value = newStatus;
});

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
] as const;

const serviceTypeNames: Record<CadastralServiceType, string> = {
    [CadastralServiceType.LAND_SURVEY]: 'Межевание земельного участка',
    [CadastralServiceType.BUILDING_PLAN]: 'Технический план здания',
    [CadastralServiceType.ROOM_PLAN]: 'Технический план помещения',
    [CadastralServiceType.INSPECTION_ACT]: 'Акт обследования',
    [CadastralServiceType.LAND_LAYOUT]: 'Схема расположения ЗУ'
};

const getServiceTypeName = (type: CadastralServiceType): string => {
    return serviceTypeNames[type];
};

const handleStatusChange = async (newStatus: ServiceStatus): Promise<void> => {
    try {
        const updatedService = await cadastralStore.updateServiceStatus(props.service.id, newStatus);
        toast.success('Статус услуги успешно обновлен');

        // Уведомляем родительский компонент об обновлении
        if (updatedService) {
            emit('update', updatedService);
        }
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса услуги');
        status.value = props.service.status;
    }
};
</script>