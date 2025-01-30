// components/navigation/NavigationUserMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <template v-if="sessionStore.isAuthenticated">
            <div class="flex items-center gap-4">
                <ClientMenu v-if="clientStore.isClient" />
                <AdminMenu v-if="adminStore.isAdmin" />
                <UButton class="text-sm md:text-lg" color="gray" variant="ghost" :loading="authStore.loading"
                    @click="handleLogout">
                    Выйти
                </UButton>
                <ThemeSwitcher />
            </div>

        </template>
        <template v-else>
            <UButton to="/login" variant="ghost" color="gray">
                Войти
            </UButton>
            <UButton to="/register" color="primary">
                Регистрация
            </UButton>
            <ThemeSwitcher />
        </template>
    </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '~/components/Theme/ThemeSwitcher.vue'
import ClientMenu from './menus/ClientMenu.vue'
import AdminMenu from './menus/AdminMenu.vue'
import { useSessionStore } from '~/stores/auth/session'
import { useClientStore } from '~/stores/auth/client'
import { useAdminStore } from '~/stores/auth/admin'
import { useAuthStore } from '~/stores/auth/'


const sessionStore = useSessionStore()
const clientStore = useClientStore()
const adminStore = useAdminStore()
const authStore = useAuthStore()


const handleLogout = () => {
    authStore.logout()
}
</script>