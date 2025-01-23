# components/navigation/NavigationMainMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <UButton v-for="item in menuItems" :key="item.path" :to="item.path" variant="ghost" color="gray">
            {{ item.label }}
        </UButton>
    </div>
</template>

<script setup>
const menuItems = [
    { label: 'Главная', path: '/' },
    { label: 'Услуги', path: '/services' }
]
</script>