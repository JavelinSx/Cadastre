// components/navigation/MainNavigation.vue
<template>
    <header class="border-b">
        <nav>
            <div class="container mx-auto flex justify-between py-2 gap-4">
                <div class="flex items-center gap-4">
                    <NavigationLogo />
                    <NavigationMainMenu />
                </div>

                <div class="flex items-center gap-4">
                    <NavigationUserMenu />
                    <NavigationMobileMenu />
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import NavigationLogo from './NavigationLogo.vue'
import NavigationMainMenu from './NavigationMainMenu.vue'
import NavigationUserMenu from './NavigationUserMenu.vue'
import NavigationMobileMenu from './NavigationMobileMenu.vue'
import { useSessionStore } from '~/stores/auth/session'
import { useUserStore } from '~/stores/auth/user'


const sessionStore = useSessionStore()
const userStore = useUserStore()
</script>