# components/theme/ThemeSwitcher.vue
<template>
    <UButton color="gray" variant="ghost" :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        :title="isDark ? 'Светлая тема' : 'Тёмная тема'" @click="toggleTheme" />
</template>

<script setup>
const { isDark, toggleTheme } = useDarkMode()
</script>