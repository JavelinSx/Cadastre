# components/Form/FormInput.vue
<template>
    <div class="w-full">
        <UFormGroup :label="label" :name="name" :ui="{
            error: 'mt-1 text-red-500 dark:text-red-400 !text-[10px]' // переопределяем стили ошибки
        }">
            <div class="relative">
                <UInput :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
                    :placeholder="placeholder" :type="showPasswordToggle ? (showPassword ? 'text' : 'password') : type"
                    :ui="{
                        input: {
                            base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 rounded-lg',
                            padding: showPasswordToggle ? 'pr-10' : 'px-3 py-2',
                            variant: {
                                error: 'border-red-500 ring-red-500 focus:ring-red-500'
                            }
                        }
                    }" v-bind="$attrs" />
                <UButton v-if="showPasswordToggle" class="absolute right-2 top-1/2 -translate-y-1/2" color="gray"
                    variant="ghost" :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    @click="showPassword = !showPassword" />
            </div>
            <template v-if="error" #error>
                <div>{{ error }}</div>
            </template>
        </UFormGroup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    modelValue: string
    label?: string
    name?: string
    placeholder?: string
    type?: string
    showPasswordToggle?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    name: '',
    placeholder: '',
    type: 'text',
    showPasswordToggle: false,
    error: ''
})

defineEmits<{
    'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
</script>