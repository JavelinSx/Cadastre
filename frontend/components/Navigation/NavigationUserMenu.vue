# components/navigation/NavigationUserMenu.vue
<template>
    <ClientOnly>
        <div class="hidden md:flex items-center space-x-4">
            <template v-if="isAuthenticated">
                <div class="flex items-center gap-4">
                    <ClientMenu v-if="isClient" />
                    <AdminMenu v-if="isAdmin" />
                    <UButton class="text-sm md:text-lg" color="gray" variant="ghost" :loading="loading"
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

        <!-- Fallback для серверного рендеринга -->
        <template #fallback>
            <div class="hidden md:flex items-center space-x-4">
                <UButton to="/login" variant="ghost" color="gray">
                    Войти
                </UButton>
                <UButton to="/register" color="primary">
                    Регистрация
                </UButton>
                <ThemeSwitcher />
            </div>
        </template>
    </ClientOnly>
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

const isAuthenticated = computed(() => sessionStore.isAuthenticated)
const isClient = computed(() => clientStore.isClient)
const isAdmin = computed(() => adminStore.isAdmin)
const loading = computed(() => authStore.loading)

const handleLogout = async () => {
    try {
        await authStore.logout()
        await navigateTo('/login')
    } catch (error) {
        console.error('Logout error:', error)
    }
}
</script>