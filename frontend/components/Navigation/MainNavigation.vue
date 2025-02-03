# components/navigation/MainNavigation.vue
<template>
    <header class="border-b">
        <nav>
            <div class="container mx-auto flex justify-between py-2 gap-4">
                <div class="flex items-center gap-4">
                    <NavigationLogo />
                    <NavigationMainMenu />
                </div>

                <ClientOnly>
                    <div class="flex items-center gap-4">
                        <NavigationUserMenu />
                        <NavigationMobileMenu />
                    </div>

                    <template #fallback>
                        <div class="flex items-center gap-4">
                            <UButton to="/login" variant="ghost" color="gray">
                                Войти
                            </UButton>
                            <UButton to="/register" color="primary">
                                Регистрация
                            </UButton>
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import NavigationLogo from './NavigationLogo.vue'
import NavigationMainMenu from './NavigationMainMenu.vue'
import NavigationUserMenu from './NavigationUserMenu.vue'
import NavigationMobileMenu from './NavigationMobileMenu.vue'
</script>