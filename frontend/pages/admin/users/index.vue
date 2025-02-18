# pages/admin/users/index.vue
<template>
    <div class="container mx-auto py-6">
        <!-- Заголовок и кнопка создания -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">Пользователи</h1>
            <UButton @click="isFormVisible = !isFormVisible" color="primary">
                {{ isFormVisible ? 'Свернуть форму' : 'Создать клиента' }}
            </UButton>
        </div>

        <!-- Форма создания -->
        <UCard v-if="isFormVisible" class="mb-8">
            <CreateClientForm @success="handleCreateSuccess" />
        </UCard>

        <!-- Список пользователей -->
        <ClientOnly>
            <UCard>
                <template #header>
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl">Список пользователей</h2>
                        <!-- Фильтры и поиск -->
                        <div class="flex gap-4">
                            <UInput v-model="searchQuery" placeholder="Поиск..."
                                icon="i-heroicons-magnifying-glass-20-solid" class="w-64" />
                            <USelect v-model="filterStatus" :options="[
                                { label: 'Все', value: 'all' },
                                { label: 'Активные', value: 'active' },
                                { label: 'Заблокированные', value: 'blocked' }
                            ]" class="w-48" />
                        </div>
                    </div>
                </template>

                <!-- Скелетон при загрузке -->
                <div v-if="usersStore.loading" class="space-y-4">
                    <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
                </div>

                <!-- Список пользователей -->
                <div v-else-if="filteredUsers.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div v-for="user in filteredUsers" :key="user.id"
                        class="py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors rounded-lg"
                        @click="navigateToUserProfile(user.id)">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-medium">{{ user.fullName || 'Без имени' }}</h3>
                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ user.email || user.phone || 'Нет контактных данных' }}
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <UBadge :color="user.isBlocked ? 'red' : 'green'" variant="subtle">
                                    {{ user.isBlocked ? 'Заблокирован' : 'Активен' }}
                                </UBadge>
                                <UIcon name="i-heroicons-chevron-right" class="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Пустое состояние -->
                <div v-else class="text-center py-12">
                    <UIcon name="i-heroicons-users" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Пользователи не найдены
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400">
                        {{ searchQuery ? 'Попробуйте изменить параметры поиска' : 'Создайте первого пользователя' }}
                    </p>
                </div>

                <!-- Пагинация -->
                <template #footer>
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-500">
                            Всего: {{ usersStore.pagination.total }}
                        </div>
                        <UPagination v-model="currentPage" :total="usersStore.pagination.total"
                            :per-page="usersStore.pagination.limit" />
                    </div>
                </template>
            </UCard>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminUsersStore } from '~/stores/admin/users'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import CreateClientForm from '~/components/CreateClientForm.vue'

const router = useRouter()
const toast = useToast()
const usersStore = useAdminUsersStore()

// Состояния
const isFormVisible = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)

// Получение пользователей
const fetchUsers = async () => {
    try {
        await usersStore.fetchUsers({
            search: searchQuery.value,
            isBlocked: filterStatus.value === 'blocked' ? true :
                filterStatus.value === 'active' ? false : undefined,
            page: currentPage.value
        })
    } catch (error) {
        toast.error('Ошибка при загрузке пользователей')
    }
}

// Фильтрация пользователей
const filteredUsers = computed(() => usersStore.users)

// Обработчики
const handleCreateSuccess = () => {
    isFormVisible.value = false
    fetchUsers()
    toast.success('Пользователь успешно создан')
}

const navigateToUserProfile = (userId: string) => {
    router.push(`/admin/users/${userId}`)
}

// Наблюдатели
watch([searchQuery, filterStatus, currentPage], () => {
    fetchUsers()
})

// Инициализация
onMounted(() => {
    fetchUsers()
})
</script>