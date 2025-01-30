# components/theme/ThemeSwitcher.vue
<template>
    <ClientOnly>
        <UButton ref="buttonRef" class="flex items-center border rounded-full p-2 text-lg" color="gray" variant="ghost"
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" @click="handleThemeToggle" />
    </ClientOnly>
</template>

<script setup>
const { isDark, toggleTheme } = useDarkMode()
const buttonRef = ref(null)
const isMobile = ref(false)

onMounted(async () => {
    // Динамический импорт GSAP только на клиенте
    const { gsap } = await import('gsap')

    // Проверяем ширину экрана при монтировании
    checkMobile()
    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', checkMobile)
})

function checkMobile() {
    isMobile.value = window.innerWidth < 768
}

async function handleThemeToggle() {
    const { gsap } = await import('gsap')

    if (isMobile.value) {
        // Мобильная анимация
        gsap.to(buttonRef.value.$el, {
            scale: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                toggleTheme()
                gsap.to(buttonRef.value.$el, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.in'
                })
            }
        })
    } else {
        // Десктопная анимация
        gsap.to(buttonRef.value.$el, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                toggleTheme()
                gsap.fromTo(buttonRef.value.$el,
                    {
                        y: -50,
                        opacity: 0,
                        rotation: -180
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.5,
                        ease: 'bounce.out'
                    }
                )
            }
        })
    }
}

// Очистка при размонтировании
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>