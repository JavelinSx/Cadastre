# components/navigation/NavigationUserMenu.vue
<template>
    <div class="hidden md:flex items-center space-x-4">
        <ClientOnly>
            <template v-if="isAuthenticated">
                <div class="flex items-center gap-4">
                    <UserMenu v-if="isUser" />
                    <AdminMenu v-if="isAdmin" />
                    <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <UButton class="text-sm md:text-lg" color="gray" variant="ghost" :loading="loading"
                        :disabled="loading" @click="handleLogout">
                        <template #leading>
                            <UIcon name="i-heroicons-arrow-left-on-rectangle" />
                        </template>
                        Выйти
                    </UButton>
                    <ThemeSwitcher />
                </div>
            </template>
            <template v-else>
                <div class="flex items-center gap-4">
                    <UButton to="/login" variant="ghost" color="gray">
                        <template #leading>
                            <UIcon name="i-heroicons-arrow-right-on-rectangle" />
                        </template>
                        Войти
                    </UButton>
                    <ThemeSwitcher />
                </div>
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
import { useToast } from 'vue-toastification'

const adminAuthStore = useAdminAuthStore()
const userAuthStore = useUserAuthStore()
const toast = useToast()

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
        toast.success('Вы успешно вышли из системы')
        await navigateTo('/login')
    } catch (error) {
        console.error('Logout error:', error)
        toast.error('Ошибка при выходе из системы')
    }
}
</script>