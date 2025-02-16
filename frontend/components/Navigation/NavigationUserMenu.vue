# components/navigation/NavigationUserMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <ClientOnly>
            <template v-if="isAuthenticated">
                <div class="flex items-center gap-4">
                    <UserMenu v-if="isUser" />
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
                <ThemeSwitcher />
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '~/components/Theme/ThemeSwitcher.vue'
import UserMenu from './menus/UserMenu.vue'
import AdminMenu from './menus/AdminMenu.vue'
import { computed, onMounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useAdminAuthStore } from '~/stores/auth/auth.admin'
import { useUserAuthStore } from '~/stores/auth/auth.user'

const adminAuthStore = useAdminAuthStore()
const userAuthStore = useUserAuthStore()

const isAuthenticated = computed(() => adminAuthStore.isAuthenticated || userAuthStore.isAuthenticated)
const isAdmin = computed(() => adminAuthStore.isAdmin)
const isUser = computed(() => userAuthStore.isUser)
const loading = computed(() => adminAuthStore.loading || userAuthStore.loading)

onMounted(async () => {
    if (process.client) {
        await adminAuthStore.initializeAuth()
    }
})

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