# components/admin/CadastralServicesList.vue
<template>
    <UCard class="md:col-span-3">
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="text-xl">Кадастровые услуги</h2>
                <UBadge :color="hasUnpaidServices ? 'red' : 'green'" variant="subtle">
                    {{ hasUnpaidServices ? 'Есть неоплаченные услуги' : 'Все услуги оплачены' }}
                </UBadge>
            </div>
        </template>

        <div v-if="loading" class="flex justify-center py-8">
            <LoadingSpinner />
        </div>

        <div v-else-if="!services.length" class="text-center py-8 text-gray-500">
            У пользователя пока нет услуг
        </div>

        <div v-else>
            <UAccordion :items="accordionItems">
                <!-- Кастомизация кнопки-заголовка -->
                <template #default="{ item, open }">
                    <UButton class="w-full !border-0" :class="[
                        item.paid ? 'border-l-4 !border-l-green-500' : 'border-l-4 !border-l-red-500'
                    ]" color="gray" variant="ghost">
                        <div class="w-full flex items-start justify-between">
                            <div class="flex flex-col items-start">
                                <span class="font-medium">{{ item.serviceName }}</span>
                                <span class="text-sm text-gray-500">
                                    Создано: {{ formatDate(item.createdAt) }}
                                </span>
                            </div>
                            <UIcon name="i-heroicons-chevron-right-20-solid"
                                class="w-5 h-5 transform transition-transform duration-200 mt-1"
                                :class="[open && 'rotate-90']" />
                        </div>
                    </UButton>
                </template>

                <!-- Кастомизация содержимого -->
                <template #item="{ item }">
                    <div class="px-4">
                        <ServiceHeader :service="item.service" @update="onServiceUpdate" />
                        <ServiceDocuments :service="item.service" @document-update="onDocumentUpdate" />
                        <ServicePayments :service="item.service" @payment-update="onPaymentUpdate" />
                    </div>
                </template>
            </UAccordion>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { formatDate } from '~/utils/formatters';
import { useAdminCadastralStore } from '~/stores/admin/cadastral';
import type { CadastralService } from '~/types/cadastral';
import { CadastralServiceType } from '~/types/cadastral';
import LoadingSpinner from '../UI/LoadingSpinner.vue';
import ServiceDocuments from './ServiceDocuments.vue';
import ServicePayments from './ServicePayments.vue';
import ServiceHeader from './ServiceHeader.vue';

const props = defineProps<{
    userId: string
}>();

const cadastralStore = useAdminCadastralStore();
const services = ref<CadastralService[]>([]);
const loading = ref(true);

// Названия типов услуг
const serviceTypeNames: Record<CadastralServiceType, string> = {
    [CadastralServiceType.LAND_SURVEY]: 'Межевание земельного участка',
    [CadastralServiceType.BUILDING_PLAN]: 'Технический план здания',
    [CadastralServiceType.ROOM_PLAN]: 'Технический план помещения',
    [CadastralServiceType.INSPECTION_ACT]: 'Акт обследования',
    [CadastralServiceType.LAND_LAYOUT]: 'Схема расположения ЗУ'
};

// Формируем элементы для аккордеона
const accordionItems = computed(() => {
    return services.value.map(service => ({
        service, // Сохраняем оригинальный объект услуги для использования в компонентах
        serviceName: serviceTypeNames[service.type],
        createdAt: service.createdAt,
        paid: service.payment,
        defaultOpen: false // По умолчанию все закрыты
    }));
});

const hasUnpaidServices = computed(() =>
    services.value.some(service => !service.payment)
);

// Загрузка услуг
const loadServices = async () => {
    if (!props.userId) return;

    loading.value = true;
    try {
        services.value = await cadastralStore.getUserServices(props.userId);
    } catch (error) {
        console.error('Ошибка при загрузке услуг:', error);
        services.value = [];
    } finally {
        loading.value = false;
    }
};

// Обработчики обновлений
const onServiceUpdate = async (updatedService: CadastralService) => {
    await loadServices();
};

const onDocumentUpdate = async () => {
    await loadServices();
};

const onPaymentUpdate = async () => {
    await loadServices();
};

// Загружаем услуги при монтировании компонента
onMounted(loadServices);

// Следим за изменением userId
watch(() => props.userId, loadServices);
</script>