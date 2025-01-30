# components/navigation/menus/AdminMenu.vue
<template>
    <div class="flex  items-center gap-4">
        <UButton class="text-sm md:text-lg" v-for="item in menuItems" :key="item.path" :to="item.path" variant="ghost"
            color="gray">
            {{ item.label }}
        </UButton>
    </div>
</template>

<script setup>
const menuItems = [
    {
        label: 'Заказы',
        path: '/admin/orders',
    },
    {
        label: 'Чаты',
        path: '/admin/chats',
    },
    {
        label: 'Пользователи',
        path: '/admin/users',
    },
]
</script>