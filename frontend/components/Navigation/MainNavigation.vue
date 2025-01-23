# components/navigation/MainNavigation.vue
<template>
    <UHeader class="border-b">
        <nav>
            <div class="container mx-auto flex justify-between py-2">
                <!-- Логотип и основное меню -->
                <div class="flex items-center gap-4">
                    <NavigationLogo />
                    <NavigationMainMenu />
                </div>

                <!-- Правая часть навигации -->
                <div class="flex items-center gap-4">
                    <NavigationUserMenu :is-authenticated="isAuthenticated" :user-role="userRole"
                        @logout="handleLogout" />
                    <NavigationMobileMenu class="md:hidden" />
                </div>
            </div>
        </nav>
    </UHeader>
</template>

<script setup>
const isAuthenticated = ref(false)
const userRole = ref('client')

const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked')
}
</script>