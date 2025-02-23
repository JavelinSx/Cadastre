<template>
    <div class="mt-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-2">
            <h4 class="text-xl w-full mb-4">Документы по услуге</h4>
            <UButton class="w-full" color="primary" variant="solid" size="sm" @click="showAddDocumentModal = true">
                <template #leading>
                    <UIcon name="i-heroicons-plus" />
                </template>
                Добавить документ
            </UButton>
        </div>
        <div class="grid gap-3">
            <div v-for="doc in service.documents" :key="doc.type"
                class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                    <span class="font-medium">{{ getDocumentName(doc.type) }}</span>
                    <span v-if="doc.isRequired" class="text-xs text-red-500 ml-2">
                        Обязательный
                    </span>
                </div>

                <div class="flex items-center gap-4">
                    <USelect v-model="documentStatuses[doc.type]" :options="documentStatusOptions"
                        @update:model-value="(newStatus: DocumentStatus) => handleStatusChange(doc.type, newStatus)" />
                    <UButton v-if="doc.status === DocumentStatus.REJECTED" color="red" variant="ghost"
                        icon="i-heroicons-information-circle" @click="showDocumentComment(doc)" />
                </div>
            </div>
        </div>

        <!-- Модальное окно добавления документа -->
        <AddDocumentModal v-model="showAddDocumentModal" :service-id="service.id" @document-added="onDocumentAdded" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { DocumentStatus, type DocumentCheckItem } from '~/types/documents'
import { DocumentTypeEnum, documentNames } from '~/utils/docs'
import AddDocumentModal from './AddDocumentModal.vue'

interface DocumentStatuses {
    [key: string]: DocumentStatus;
}

interface ServiceDocument extends Omit<DocumentCheckItem, 'type'> {
    type: string | DocumentTypeEnum;
}

const props = defineProps<{
    service: CadastralService
}>();

const emit = defineEmits<{
    'document-update': []
}>();

const toast = useToast();
const cadastralStore = useAdminCadastralStore();
const showAddDocumentModal = ref(false);

const documentStatusOptions = [
    { label: 'Ожидает проверки', value: DocumentStatus.PENDING },
    { label: 'Проверен', value: DocumentStatus.VERIFIED },
    { label: 'Отклонен', value: DocumentStatus.REJECTED }
] as const;

const documentStatuses = reactive<DocumentStatuses>(
    props.service.documents.reduce((acc, doc) => ({
        ...acc,
        [doc.type]: doc.status
    }), {} as DocumentStatuses)
);

const getDocumentName = (type: string): string => {
    // Если тип соответствует перечислению, возвращаем соответствующее имя
    if (Object.values(DocumentTypeEnum).includes(type as DocumentTypeEnum)) {
        return documentNames[type as DocumentTypeEnum] || type;
    }
    // Иначе возвращаем сам тип как пользовательское имя
    return type;
};

const handleStatusChange = async (docType: string, newStatus: DocumentStatus): Promise<void> => {
    try {
        await cadastralStore.updateDocumentStatus(props.service.id, docType, newStatus);
        toast.success('Статус документа успешно обновлен');
        emit('document-update'); // Уведомляем родительский компонент
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса документа');
        const originalDoc = props.service.documents.find(d => d.type === docType);
        if (originalDoc) {
            documentStatuses[docType] = originalDoc.status;
        }
    }
};

const showDocumentComment = (doc: ServiceDocument): void => {
    if (doc.comment) {
        toast.info(doc.comment, {
            timeout: 5000
        });
    }
};

const onDocumentAdded = () => {
    emit('document-update'); // Уведомляем родительский компонент о необходимости обновить данные
};
</script>