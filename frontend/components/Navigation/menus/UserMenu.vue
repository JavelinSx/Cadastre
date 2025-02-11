# components/navigation/menus/ClientMenu.vue
<template>
    <div class="flex items-center space-x-2">
        <UButton class="text-sm md:text-lg" v-for="item in menuItems" :key="item.path" :to="item.path" variant="ghost"
            color="gray">
            {{ item.label }}
        </UButton>
    </div>
</template>

<script setup>
const menuItems = [
    {
        label: 'Личный кабинет',
        path: '/dashboard',
    },
    {
        label: 'Заказы',
        path: '/orders',
    },
    {
        label: 'Поддержка',
        path: '/chat',
    }
]
</script>