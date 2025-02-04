<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { useAuthSetup } from '~/composables/useAuthSetup'

useAuthSetup()
</script>