# components/navigation/NavigationMobileMenu.vue
<template>
    <div>
        <UButton icon="i-heroicons-bars-3" color="gray" variant="ghost" @click="isOpen = true" />

        <USlideover v-model="isOpen" :ui="{ width: 'w-72' }">
            <template #header>
                <NavigationLogo />
            </template>

            <div class="space-y-4 p-4">
                <!-- Основное меню -->
                <div class="space-y-2">
                    <UButton v-for="item in mainMenuItems" :key="item.path" :to="item.path" block variant="ghost"
                        color="gray" @click="isOpen = false">
                        {{ item.label }}
                    </UButton>
                </div>

                <!-- Авторизованное меню -->
                <template v-if="isAuthenticated">
                    <div v-if="userRole === 'client'" class="space-y-2">
                        <UButton v-for="item in clientMenuItems" :key="item.path" :to="item.path" block variant="ghost"
                            color="gray" @click="isOpen = false">
                            <UIcon :name="item.icon" class="mr-1" />
                            {{ item.label }}
                        </UButton>
                    </div>

                    <div v-else-if="userRole === 'admin'" class="space-y-2">
                        <UButton v-for="item in adminMenuItems" :key="item.path" :to="item.path" block variant="ghost"
                            color="gray" @click="isOpen = false">
                            <UIcon :name="item.icon" class="mr-1" />
                            {{ item.label }}
                        </UButton>
                    </div>

                    <UButton block color="gray" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle"
                        @click="handleLogout">
                        Выйти
                    </UButton>
                </template>

                <!-- Неавторизованное меню -->
                <template v-else>
                    <div class="space-y-2">
                        <UButton to="/login" block variant="ghost" color="gray" @click="isOpen = false">
                            Войти
                        </UButton>
                        <UButton to="/register" block color="primary" @click="isOpen = false">
                            Регистрация
                        </UButton>
                    </div>
                </template>
            </div>
        </USlideover>
    </div>
</template>

<script setup>
const isOpen = ref(false)
const isAuthenticated = ref(false)
const userRole = ref('client')

const mainMenuItems = [
    { label: 'Главная', path: '/' },
    { label: 'Услуги', path: '/services' }
]

const clientMenuItems = [
    {
        label: 'Личный кабинет',
        path: '/dashboard',
        icon: 'i-heroicons-home'
    },
    {
        label: 'Мои заказы',
        path: '/orders',
        icon: 'i-heroicons-document-text'
    },
    {
        label: 'Чат с поддержкой',
        path: '/chat',
        icon: 'i-heroicons-chat-bubble-left'
    }
]

const adminMenuItems = [
    {
        label: 'Заказы',
        path: '/admin/orders',
        icon: 'i-heroicons-document-text'
    },
    {
        label: 'Чаты',
        path: '/admin/chats',
        icon: 'i-heroicons-chat-bubble-left-right'
    },
    {
        label: 'Пользователи',
        path: '/admin/users',
        icon: 'i-heroicons-users'
    },
    {
        label: 'Отчеты',
        path: '/admin/reports',
        icon: 'i-heroicons-chart-bar'
    }
]

const handleLogout = () => {
    isOpen.value = false
    // TODO: Implement logout logic
}
</script>