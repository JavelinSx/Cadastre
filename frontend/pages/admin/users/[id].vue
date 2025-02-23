// pages/admin/users/[id].vue
<template>
    <div class="container mx-auto py-6">
        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
        </div>

        <template v-else>
            <!-- Заголовок и кнопка добавления услуги -->
            <div class="mb-6 flex-col md: flex-ro items-center justify-between">
                <h1 class="text-2xl font-semibold mb-2">
                    Профиль пользователя:
                </h1>
                <UButton class="w-full mt-4" color="primary" @click="isAddServiceModalOpen = true">
                    Добавить услугу
                </UButton>
            </div>

            <!-- Основной контент -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                <UserInfoCard :user="selectedUser" />

                <CadastralServicesList :user-id="userId" />
            </div>

            <!-- Модальное окно добавления услуги -->
            <AddServiceModal v-if="isAddServiceModalOpen" :user-id="userId" :model-value="isAddServiceModalOpen" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import { useAdminUsersStore } from '~/stores/admin/users'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import AddServiceModal from '~/components/Admin/AddServiceModal.vue'
import CadastralServicesList from '~/components/Admin/CadastralServicesList.vue'
import UserInfoCard from '~/components/Admin/UserInfoCard.vue'
import LoadingSpinner from '~/components/UI/LoadingSpinner.vue'

const route = useRoute()
const toast = useToast()
const adminUsersStore = useAdminUsersStore()
const cadastralStore = useAdminCadastralStore()

// Состояние и реактивные значения
const { selectedUser, loading } = storeToRefs(adminUsersStore)
const isAddServiceModalOpen = ref(false)
const userId = computed(() => route.params.id as string)
console.log('User ID from route:', userId);
// Получаем общие документы пользователя
const commonDocuments = computed(() => {
    if (!selectedUser.value?.documentChecklists?.length) return []

    return selectedUser.value.documentChecklists[0].documents || []
})

// Получаем список услуг
const services = computed(() =>
    selectedUser.value?.services || []
)

// Загрузка данных при монтировании
onMounted(async () => {
    try {
        if (!userId.value) {
            console.error('ID пользователя отсутствует');
            toast.error('ID пользователя не указан');
            return;
        }

        console.log('Начало загрузки данных для пользователя:', userId.value);

        await Promise.all([
            adminUsersStore.fetchUserById(userId.value)
                .catch(error => {
                    console.error('Ошибка загрузки данных пользователя:', error);
                    toast.error('Ошибка при загрузке данных пользователя');
                    throw error;
                }),
            cadastralStore.getUserServices(userId.value)
                .catch(error => {
                    console.error('Ошибка загрузки услуг:', error);
                    toast.error('Ошибка при загрузке списка услуг');
                    throw error;
                })
        ]);

        console.log('Данные успешно загружены');
    } catch (error) {
        console.error('Общая ошибка:', error);
        toast.error('Ошибка при загрузке данных пользователя');
    }
});
</script>