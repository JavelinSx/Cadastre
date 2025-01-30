# components/navigation/NavigationMainMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <UButton class="text-sm md:text-lg" v-for="item in mainMenuItems" :key="item.path" :to="item.path"
            variant="ghost" color="gray">

            {{ item.label }}
        </UButton>
    </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/menu';

const mainMenuItems: MenuItem[] = [
    {
        label: 'Главная',
        path: '/',
    },
    {
        label: 'Услуги',
        path: '/services',
    }
]
</script>