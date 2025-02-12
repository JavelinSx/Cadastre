# app.vue
<template>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>

<script setup lang="ts">
import { useAuthSetup } from '~/composables/useAuthSetup'
import { ref, onMounted } from 'vue'

const isInitialized = ref(false)
const { initializeAuth } = useAuthSetup()

onMounted(async () => {
  await initializeAuth()
  isInitialized.value = true
})
</script>