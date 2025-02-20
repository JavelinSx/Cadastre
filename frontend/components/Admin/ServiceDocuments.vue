// components/admin/users/ServiceDocuments.vue
<template>
    <div class="mt-4">
        <h4 class="font-medium mb-2">Документы по услуге</h4>
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
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminCadastralStore } from '~/stores/admin/cadastral'
import type { CadastralService } from '~/types/cadastral'
import { DocumentStatus, type DocumentCheckItem } from '~/types/documents'
import { DocumentTypeEnum, documentNames } from '~/utils/docs'

interface DocumentStatuses {
    [key: string]: DocumentStatus;
}

interface ServiceDocument extends Omit<DocumentCheckItem, 'type'> {
    type: DocumentTypeEnum;
}

const props = defineProps<{
    service: CadastralService & {
        documents: ServiceDocument[];
    }
}>()

const toast = useToast()
const cadastralStore = useAdminCadastralStore()

const documentStatusOptions = [
    { label: 'Ожидает проверки', value: DocumentStatus.PENDING },
    { label: 'Проверен', value: DocumentStatus.VERIFIED },
    { label: 'Отклонен', value: DocumentStatus.REJECTED }
] as const

const documentStatuses = reactive<DocumentStatuses>(
    props.service.documents.reduce((acc, doc) => ({
        ...acc,
        [doc.type]: doc.status
    }), {} as DocumentStatuses)
)

const getDocumentName = (type: DocumentTypeEnum): string => {
    return documentNames[type] || type
}

const handleStatusChange = async (docType: DocumentTypeEnum, newStatus: DocumentStatus): Promise<void> => {
    try {
        await cadastralStore.updateDocumentStatus(props.service.id, docType, newStatus)
        toast.success('Статус документа успешно обновлен')
    } catch (error: any) {
        toast.error(error.message || 'Ошибка при обновлении статуса документа')
        const originalDoc = props.service.documents.find(d => d.type === docType)
        if (originalDoc) {
            documentStatuses[docType] = originalDoc.status
        }
    }
}

const showDocumentComment = (doc: ServiceDocument): void => {
    if (doc.comment) {
        toast.info(doc.comment, {
            timeout: 5000
        })
    }
}
</script>