// components/admin/users/ServiceCard.vue
<template>
    <div class="border rounded-lg p-6 transition-all duration-200 hover:shadow-md dark:border-gray-700">
        <ServiceHeader :service="service" />
        <ServiceDocuments :service="service" />
        <ServicePayment :service="service" />
    </div>
</template>

<script setup lang="ts">
import type { CadastralService } from '~/types/cadastral'

defineProps<{
    service: CadastralService
}>()
</script>