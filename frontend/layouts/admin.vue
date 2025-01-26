<template>
    <AdminMenu />
    <main>
        <slot></slot>
    </main>
</template>
<script setup lang="ts">
import AdminMenu from '~/components/Navigation/menus/AdminMenu.vue';

</script>