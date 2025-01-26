# components/navigation/menus/ClientMenu.vue
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
        label: 'Личный кабинет',
        path: '/dashboard',
        icon: 'i-heroicons-home'
    },
    {
        label: 'Мои заказы',
        path: '/orders',
        icon: 'i-heroicons-document-text'
    },
    {
        label: 'Чат с поддержкой',
        path: '/chat',
        icon: 'i-heroicons-chat-bubble-left'
    }
]
</script>