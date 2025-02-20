// components/admin/users/CadastralServicesList.vue
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

        <div v-if="!services.length" class="text-center py-8 text-gray-500">
            У пользователя пока нет услуг
        </div>

        <div v-else class="space-y-6">
            <ServiceCard v-for="service in services" :key="service.id" :service="service" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CadastralService } from '~/types/cadastral'
import ServiceCard from './ServiceCard.vue';

const props = defineProps<{
    services: CadastralService[]
}>()

const hasUnpaidServices = computed(() =>
    props.services.some(service => !service.payment && service.status === 'ready_for_payment')
)
</script>