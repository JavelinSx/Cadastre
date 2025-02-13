# components/navigation/NavigationUserMenu.vue
<template>
    <ClientOnly>
        <div class="hidden md:flex items-center space-x-4">
            <template v-if="isAuthenticated">
                <div class="flex items-center gap-4">
                    <UserMenu v-if="isUser && !loading" />
                    <AdminMenu v-if="isAdmin && !loading" />
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
                <ThemeSwitcher />
            </template>
        </div>

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
import UserMenu from './menus/UserMenu.vue'
import AdminMenu from './menus/AdminMenu.vue'
import { computed } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useAdminAuthStore } from '~/stores/auth/auth.admin'
import { useUserAuthStore } from '~/stores/auth/auth.user'


const adminAuthStore = useAdminAuthStore()
const userAuthStore = useUserAuthStore()

const isAuthenticated = computed(() => adminAuthStore.isAuthenticated || userAuthStore.isAuthenticated)
const isAdmin = computed(() => adminAuthStore.isAdmin)
const isUser = computed(() => userAuthStore.isUser)
const loading = computed(() => adminAuthStore.loading || userAuthStore.loading)

const handleLogout = async () => {
    try {
        if (isAdmin.value) {
            await adminAuthStore.logout()
        } else if (isUser.value) {
            await userAuthStore.logout()
        }
        await navigateTo('/login')
    } catch (error) {
        console.error('Logout error:', error)
    }
}
</script>