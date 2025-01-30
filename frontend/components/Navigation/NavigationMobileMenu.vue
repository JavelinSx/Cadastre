# components/navigation/NavigationMobileMenu.vue
<template>
    <div class="md:hidden">
        <UButton class="flex items-center p-2 border rounded-md" icon="i-heroicons-bars-3" color="red" variant="ghost"
            @click="isOpen = true" />

        <USlideover v-model="isOpen" :ui="{
            wrapper: 'fixed inset-0 flex z-50 justify-end',
            overlay: {
                background: 'bg-gray-950/50',
                transition: {
                    enter: 'ease-out duration-300',
                    enterFrom: 'opacity-0',
                    enterTo: 'opacity-100',
                    leave: 'ease-in duration-200',
                    leaveFrom: 'opacity-100',
                    leaveTo: 'opacity-0'
                }
            },
            base: 'relative flex-1 w-full max-w-xs flex flex-col bg-white dark:bg-gray-900',
            padding: 'p-4',
            width: 'w-screen max-w-xs',
            background: 'bg-white dark:bg-gray-900',
            shadow: 'shadow-lg',
            transition: {
                enter: 'transform transition ease-out duration-300',
                enterFrom: 'translate-x-full',
                enterTo: 'translate-x-0',
                leave: 'transform transition ease-in duration-200',
                leaveFrom: 'translate-x-0',
                leaveTo: 'translate-x-full'
            }
        }">
            <div class="flex flex-col h-full">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <NavigationLogo />
                    <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isOpen = false" />
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto mt-8">
                    <div class="flex flex-col items-center p-4 gap-3">
                        <!-- Основное меню -->
                        <div class="flex flex-col items-center w-full gap-3">
                            <UButton v-for="item in mainMenuItems" :key="item.path" :to="item.path" block
                                variant="ghost" color="gray" class="text-lg w-full flex items-center"
                                @click="isOpen = false">
                                <div class="menu-line left-line"></div>
                                <span class="px-2">{{ item.label }}</span>
                                <div class="menu-line right-line"></div>
                            </UButton>
                        </div>

                        <!-- Авторизованное меню -->
                        <template v-if="sessionStore.isAuthenticated">
                            <div class="flex flex-col items-center w-full gap-3" v-if="userStore.isClient">
                                <UButton v-for="item in clientMenuItems" :key="item.path" :to="item.path" block
                                    variant="ghost" color="gray" class="text-lg w-full flex items-center"
                                    @click="isOpen = false">
                                    <div class="menu-line left-line"></div>
                                    <span class="px-2">{{ item.label }}</span>
                                    <div class="menu-line right-line"></div>
                                </UButton>
                            </div>

                            <div class="flex flex-col items-center w-full gap-3" v-if="userStore.isAdmin">
                                <UButton v-for="item in adminMenuItems" :key="item.path" :to="item.path" block
                                    variant="ghost" color="gray" class="text-lg w-full flex items-center"
                                    @click="isOpen = false">
                                    <div class="menu-line left-line"></div>
                                    <span class="px-2">{{ item.label }}</span>
                                    <div class="menu-line right-line"></div>
                                </UButton>
                            </div>

                            <UButton block color="gray" variant="ghost" class="text-lg w-full flex items-center mb-8"
                                :class="{ 'opacity-50 cursor-not-allowed': authStore.loading }" @click="handleLogout">
                                <div class="menu-line left-line"></div>
                                <span class="px-2">Выйти</span>
                                <div class="menu-line right-line"></div>
                            </UButton>

                            <ThemeSwitcher />
                        </template>

                        <!-- Неавторизованное меню -->
                        <template v-else>
                            <div class="w-full mt-4 mb-4 h-[1px] bg-gray-200 dark:bg-gray-700 "></div>
                            <div class="flex flex-col items-center w-full gap-3 mb-8">
                                <UButton to="/login" block variant="ghost" color="gray"
                                    class="text-lg w-full flex items-center" @click="isOpen = false">
                                    <div class="menu-line left-line"></div>
                                    <span class="px-2">Войти</span>
                                    <div class="menu-line right-line"></div>
                                </UButton>
                                <UButton to="/register" block color="primary" class="text-lg w-full flex items-center"
                                    @click="isOpen = false">
                                    <div class="menu-line left-line"></div>
                                    <span class="px-2">Регистрация</span>
                                    <div class="menu-line right-line"></div>
                                </UButton>
                            </div>
                            <ThemeSwitcher />
                        </template>
                    </div>
                </div>
            </div>
        </USlideover>
    </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '~/components/Theme/ThemeSwitcher.vue'
import NavigationLogo from './NavigationLogo.vue'
import { ref } from 'vue'
import { useSessionStore } from '~/stores/auth/session'
import { useUserStore } from '~/stores/auth/user'
import { useAuthStore } from '~/stores/auth/'
import type { MenuItem } from '~/types/menu'

const sessionStore = useSessionStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const isOpen = ref(false)

const mainMenuItems: MenuItem[] = [
    { label: 'Главная', path: '/' },
    { label: 'Услуги', path: '/services' }
]

const clientMenuItems: MenuItem[] = [
    { label: 'Личный кабинет', path: '/dashboard' },
    { label: 'Заказы', path: '/orders' },
    { label: 'Поддержка', path: '/chat' }
]

const adminMenuItems: MenuItem[] = [
    { label: 'Заказы', path: '/admin/orders' },
    { label: 'Чаты', path: '/admin/chats' },
    { label: 'Пользователи', path: '/admin/users' }
]

const handleLogout = async () => {
    await authStore.logout()
    isOpen.value = false
}
</script>

<style scoped>
.menu-line {
    @apply h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-2;
}

.left-line {
    animation: slideInFromLeft 1s ease-in-out;
}

.right-line {
    animation: slideInFromRight 1s ease-in-out;
}

@keyframes slideInFromLeft {
    0% {
        transform: scaleX(0);
        transform-origin: left;
    }

    100% {
        transform: scaleX(1);
        transform-origin: left;
    }
}

@keyframes slideInFromRight {
    0% {
        transform: scaleX(0);
        transform-origin: right;
    }

    100% {
        transform: scaleX(1);
        transform-origin: right;
    }
}
</style>