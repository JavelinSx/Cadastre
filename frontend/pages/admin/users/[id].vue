# pages/admin/users/[id].vue
<template>
    <div class="container mx-auto py-6">
        <!-- Заголовок -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-4">
                <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
                <h1 class="text-2xl font-semibold">
                    {{ user?.fullName || 'Профиль пользователя' }}
                </h1>
            </div>
            <UButton color="red" variant="soft" :loading="usersStore.loading" @click="handleToggleBlock">
                {{ user?.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
            </UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Основная информация -->
            <UCard class="md:col-span-2">
                <template #header>
                    <h2 class="text-xl">Основная информация</h2>
                </template>

                <form @submit.prevent="saveUserInfo" class="space-y-4">
                    <UFormGroup label="ФИО" name="fullName">
                        <UInput v-model="userForm.fullName" placeholder="Введите ФИО" />
                    </UFormGroup>

                    <UFormGroup label="Email" name="email">
                        <UInput v-model="userForm.email" type="email" placeholder="example@mail.com" />
                    </UFormGroup>

                    <UFormGroup label="Телефон" name="phone">
                        <UInput v-model="userForm.phone" type="tel" placeholder="+7 (999) 999-99-99" />
                    </UFormGroup>

                    <div class="flex justify-end">
                        <UButton type="submit" color="primary" :loading="saving">
                            Сохранить изменения
                        </UButton>
                    </div>
                </form>
            </UCard>

            <!-- Статистика и статус -->
            <div class="space-y-6">
                <UCard>
                    <template #header>
                        <h2 class="text-xl">Статус</h2>
                    </template>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-500">Статус аккаунта</span>
                            <UBadge :color="user?.isBlocked ? 'red' : 'green'" variant="subtle">
                                {{ user?.isBlocked ? 'Заблокирован' : 'Активен' }}
                            </UBadge>
                        </div>

                        <div class="flex justify-between items-center">
                            <span class="text-gray-500">Дата регистрации</span>
                            <span>{{ formatDate(user?.createdAt) }}</span>
                        </div>

                        <div class="flex justify-between items-center">
                            <span class="text-gray-500">Последний визит</span>
                            <span>{{ formatDate(user?.lastVisit) }}</span>
                        </div>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h2 class="text-xl">Документы</h2>
                    </template>

                    <div class="space-y-4">
                        <div v-for="checklist in user?.documentChecklists" :key="checklist.serviceId"
                            class="p-4 border rounded-lg">
                            <h3 class="font-medium mb-2">Услуга #{{ checklist.serviceId }}</h3>
                            <div class="space-y-2">
                                <div v-for="doc in checklist.documents" :key="doc.type"
                                    class="flex justify-between items-center">
                                    <span>{{ doc.type }}</span>
                                    <UBadge :color="getStatusColor(doc.status)" variant="subtle">
                                        {{ getStatusText(doc.status) }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- История взаимодействий -->
            <UCard class="md:col-span-3">
                <template #header>
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl">История взаимодействий</h2>
                        <UButton color="gray" variant="ghost" @click="showAddInteractionModal = true">
                            Добавить
                        </UButton>
                    </div>
                </template>

                <div class="space-y-4">
                    <div v-for="interaction in user?.interactions" :key="interaction.id"
                        class="flex items-start gap-4 p-4 border rounded-lg">
                        <UIcon :name="getInteractionIcon(interaction.type)" class="w-6 h-6 text-gray-400" />
                        <div class="flex-1">
                            <div class="flex justify-between">
                                <span class="font-medium">
                                    {{ getInteractionTypeText(interaction.type) }}
                                </span>
                                <span class="text-sm text-gray-500">
                                    {{ formatDate(interaction.date) }}
                                </span>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300 mt-1">
                                {{ interaction.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Модальное окно добавления взаимодействия -->
        <UModal v-model="showAddInteractionModal">
            <UCard>
                <template #header>
                    <h3 class="text-xl">Добавить взаимодействие</h3>
                </template>

                <form @submit.prevent="addInteraction" class="space-y-4">
                    <UFormGroup label="Тип" name="type">
                        <USelect v-model="newInteraction.type" :options="[
                            { label: 'Звонок', value: 'call' },
                            { label: 'Чат', value: 'chat' },
                            { label: 'Визит в офис', value: 'office' }
                        ]" />
                    </UFormGroup>

                    <UFormGroup label="Описание" name="description">
                        <UTextarea v-model="newInteraction.description" placeholder="Опишите взаимодействие" />
                    </UFormGroup>

                    <div class="flex justify-end gap-2">
                        <UButton color="gray" variant="ghost" @click="showAddInteractionModal = false">
                            Отмена
                        </UButton>
                        <UButton type="submit" color="primary" :loading="addingInteraction">
                            Добавить
                        </UButton>
                    </div>
                </form>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAdminUsersStore } from '~/stores/admin/users'
import type { InteractionType } from '~/types/users'
import { DocumentStatus } from '~/types/documents'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const usersStore = useAdminUsersStore()

const userId = route.params.id as string
const saving = ref(false)
const addingInteraction = ref(false)
const showAddInteractionModal = ref(false)

// Форма пользователя
const userForm = ref({
    fullName: '',
    email: '',
    phone: ''
})

// Форма взаимодействия
const newInteraction = ref({
    type: 'call' as InteractionType,
    description: ''
})

// Загрузка пользователя
const user = computed(() => usersStore.getUserById(userId))

// Вспомогательные функции
const formatDate = (date?: Date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString()
}

const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
        case DocumentStatus.VERIFIED:
            return 'green'
        case DocumentStatus.REJECTED:
            return 'red'
        default:
            return 'yellow'
    }
}

const getStatusText = (status: DocumentStatus) => {
    switch (status) {
        case DocumentStatus.VERIFIED:
            return 'Подтвержден'
        case DocumentStatus.REJECTED:
            return 'Отклонен'
        default:
            return 'Ожидает проверки'
    }
}

const getInteractionIcon = (type: InteractionType) => {
    switch (type) {
        case 'call':
            return 'i-heroicons-phone'
        case 'chat':
            return 'i-heroicons-chat-bubble-left-right'
        case 'office':
            return 'i-heroicons-building-office'
        default:
            return 'i-heroicons-question-mark-circle'
    }
}

const getInteractionTypeText = (type: InteractionType) => {
    switch (type) {
        case 'call':
            return 'Звонок'
        case 'chat':
            return 'Чат'
        case 'office':
            return 'Визит в офис'
        default:
            return 'Неизвестно'
    }
}

// Обработчики
const saveUserInfo = async () => {
    saving.value = true
    try {
        await usersStore.updateUser(userId, userForm.value)
        toast.success('Информация обновлена')
    } catch (error) {
        toast.error('Ошибка при сохранении')
    } finally {
        saving.value = false
    }
}

const handleToggleBlock = async () => {
    if (!user.value) return

    try {
        await usersStore.toggleBlockUser(
            userId,
            !user.value.isBlocked,
            user.value.isBlocked ? undefined : 'Заблокирован администратором'
        )
        toast.success(user.value.isBlocked ? 'Пользователь разблокирован' : 'Пользователь заблокирован')
    } catch (error) {
        toast.error('Ошибка при изменении статуса')
    }
}

const addInteraction = async () => {
    addingInteraction.value = true
    try {
        await usersStore.addInteraction(userId, newInteraction.value)
        showAddInteractionModal.value = false
        newInteraction.value.description = ''
        toast.success('Взаимодействие добавлено')
    } catch (error) {
        toast.error('Ошибка при добавлении взаимодействия')
    } finally {
        addingInteraction.value = false
    }
}

// Инициализация
onMounted(async () => {
    if (!user.value) {
        try {
            await usersStore.fetchUsers()
        } catch (error) {
            toast.error('Ошибка при загрузке пользователя')
            router.push('/admin/users')
            return
        }
    }

    if (user.value) {
        userForm.value = {
            fullName: user.value.fullName || '',
            email: user.value.email || '',
            phone: user.value.phone || ''
        }
    }
})
</script>