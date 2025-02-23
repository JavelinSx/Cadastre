<template>
    <UInput :model-value="displayValue" @update:model-value="handleInput" :placeholder="placeholder" type="tel"
        @blur="handleBlur" @focus="handleFocus" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
}>();

const displayValue = ref('');
const isFocused = ref(false);

const formatForStore = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 11) return cleaned;

    // Всегда возвращаем в формате 79XXXXXXXXX (без +)
    return cleaned.startsWith('8') ?
        '7' + cleaned.slice(1) :
        cleaned.startsWith('7') ? cleaned : '7' + cleaned;
};

const formatDisplay = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.length < 11) return cleaned;

    // Форматируем для отображения: +7 (XXX) XXX-XX-XX
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
};

// Инициализация и отслеживание изменений входного значения
watch(() => props.modelValue, (newValue) => {
    // Если телефон начинается с +7, преобразуем его для отображения
    if (newValue && newValue.startsWith('+7')) {
        const cleaned = '8' + newValue.slice(2);
        displayValue.value = formatDisplay(cleaned);
    } else {
        displayValue.value = formatDisplay(newValue);
    }
}, { immediate: true });

const handleInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 11) {
        displayValue.value = formatDisplay(numericValue);
        const formattedValue = formatForStore(numericValue);
        emit('update:modelValue', formattedValue);
    }
};

const handleBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
};

const handleFocus = () => {
    isFocused.value = true;
};
</script>