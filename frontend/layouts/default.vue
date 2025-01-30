<template>
  <div>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <MainNavigation />
      <main class="container mx-auto py-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainNavigation from '~/components/Navigation/MainNavigation.vue';
</script>