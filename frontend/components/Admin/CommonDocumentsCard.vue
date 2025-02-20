# components/admin/users/CommonDocumentsCard.vue
<template>
    <UCard>
        <template #header>
            <h2 class="text-xl">Общие документы</h2>
        </template>

        <div class="space-y-4">
            <div v-for="doc in documents" :key="doc.type" class="p-4 border rounded-lg dark:border-gray-700">
                <div class="flex justify-between items-center gap-4">
                    <div>
                        <span class="font-medium">{{ getDocumentName(doc.type) }}</span>
                        <span v-if="doc.isRequired" class="text-xs text-red-500 ml-2">
                            Обязательный
                        </span>
                    </div>

                    <USelect v-model="doc.status" :options="documentStatusOptions" @change="handleStatusChange(doc)" />
                </div>

                <p v-if="doc.comment" class="text-sm text-gray-500 mt-2">
                    {{ doc.comment }}
                </p>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useAdminUsersStore } from '~/stores/admin/users';
import type { DocumentCheckItem } from '~/types/documents'

const adminUsersStore = useAdminUsersStore()
const toast = useToast();

const props = defineProps<{
    userId: string;
    documents: DocumentCheckItem[];
}>();

const documentStatusOptions = [
    { label: 'Ожидает проверки', value: 'pending' },
    { label: 'Проверен', value: 'verified' },
    { label: 'Отклонен', value: 'rejected' }
]

const getDocumentName = (type: string): string => {
    const documentNames: Record<string, string> = {
        passport: 'Паспорт',
        snils: 'СНИЛС',
        contact: 'Контактные данные',
        personal_data: 'Согласие на обработку ПД'
    }
    return documentNames[type] || type
}

const handleError = (error: any, docType: string) => {
    const docName = getDocumentName(docType);
    if (error.response?.status === 404) {
        toast.error(`Документ "${docName}" не найден`);
    } else if (error.message === 'Network Error') {
        toast.error('Ошибка сети. Проверьте подключение');
    } else {
        toast.error(`Ошибка при обновлении статуса документа "${docName}"`);
    }
};

const handleStatusChange = async (doc: DocumentCheckItem) => {
    try {
        await adminUsersStore.updateDocumentStatus(
            props.userId,
            doc.type,
            doc.status,
            doc.comment
        );
    } catch (error) {
        handleError(error, doc.type);
    }
};
</script>