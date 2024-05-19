<template>
<Panel :header="title" class="w-full h-full flex flex-col overflow-hidden"
:pt="{ 
    header: { class: 'h-12' },
    title: { class: 'dark:text-primary-500' },
    toggleablecontent: { class: 'h-full overflow-hidden' },
    content: { class: 'h-full overflow-hidden' }
    }"
:pt-options="{ mergeProps: true }">
    <template #header>
        <div class="w-full h-fit flex flex-row items-center justify-between font-bold dark:text-primary-500">
            <span>{{ title }}</span>
            <span class="text-xs p-2 border rounded-md border-primary-500">{{ activePair.title }}</span>
        </div>
    </template>
    <div ref="orderBookContainer" class="w-full h-full relative flex overflow-hidden">
        <DataTable :value="data" scrollable :scrollHeight="height + 'px'" size="small" class="w-full h-full">
            <Column header="Price" field="price" sortable></Column>
            <Column header="Quantity" field="quantity" sortable></Column>
            <Column v-if="largerThanSm" header="Total" sortable :field="( item: IOrder ) => ((item.price * item.quantity).toFixed(5).toString())"></Column>
        </DataTable>
    </div>
</Panel>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { breakpointsTailwind, useBreakpoints, useElementBounding } from '@vueuse/core';
import type { IOrder } from '@/stores/order-store';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings-store';
import { storeToRefs } from 'pinia';
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanSm = breakpoints.greater('sm');
const SettingsStore = useSettingsStore();
const { activePair } = storeToRefs( SettingsStore );
defineProps<{
    title: string,
    data: IOrder[],
}>();

const orderBookContainer = ref();
const { height } = useElementBounding( orderBookContainer );

</script>