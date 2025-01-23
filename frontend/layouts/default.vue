<template>
    <ClientMenu />
    <main>
        <slot></slot>
    </main>
</template>
<script setup lang="ts">
import ClientMenu from '~/components/Navigation/menus/ClientMenu.vue';

</script>