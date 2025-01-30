<template>
    <NavigationUserMenu />
    <main>
        <slot></slot>
    </main>
</template>
<script setup lang="ts">
import NavigationUserMenu from '~/components/Navigation/NavigationUserMenu.vue';

</script>