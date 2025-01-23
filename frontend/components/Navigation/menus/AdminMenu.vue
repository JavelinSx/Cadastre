# components/navigation/menus/AdminMenu.vue
<template>
    <div class="flex items-center space-x-4">
        <UButton v-for="item in menuItems" :key="item.path" :to="item.path" variant="ghost" color="gray">
            <UIcon :name="item.icon" class="mr-1" />
            {{ item.label }}
        </UButton>
    </div>
</template>

<script setup>
const menuItems = [
    {
        label: 'Заказы',
        path: '/admin/orders',
        icon: 'i-heroicons-document-text'
    },
    {
        label: 'Чаты',
        path: '/admin/chats',
        icon: 'i-heroicons-chat-bubble-left-right'
    },
    {
        label: 'Пользователи',
        path: '/admin/users',
        icon: 'i-heroicons-users'
    },
    {
        label: 'Отчеты',
        path: '/admin/reports',
        icon: 'i-heroicons-chart-bar'
    }
]
</script>