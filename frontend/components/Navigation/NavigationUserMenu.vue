# components/navigation/NavigationUserMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <template v-if="isAuthenticated">
            <ClientMenu v-if="userRole === 'client'" />
            <AdminMenu v-else-if="userRole === 'admin'" />
            <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="$emit('logout')">
                Выйти
            </UButton>
        </template>
        <template v-else>
            <UButton to="/login" variant="ghost" color="gray">
                Войти
            </UButton>
            <UButton to="/register" color="primary">
                Регистрация
            </UButton>
        </template>
    </div>
</template>

<script setup>
defineProps({
    isAuthenticated: Boolean,
    userRole: String
})

defineEmits(['logout'])
</script>