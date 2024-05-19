<template>
<div class="w-full h-full flex flex-col gap-2 overflow-hidden">
    <Panel header="Выбор пары" class="w-full h-fit"
    :pt="{ 
        title: { class: 'dark:text-primary-500' }
        }"
    :pt-options="{ mergeProps: true }">
        <div class="w-full h-fit flex flex-row items-center justify-center gap-2">
            <Button v-for="(pair) in PAIRS_ARR" :key="pair.title"
            :text="pair.title !== activePair.title"
            class="w-full"
            :label="pair.title"
            @click="changeActivePair( pair )"
            />
        </div>
    </Panel>
    <Panel header="История изменений" class="w-full h-full flex flex-col overflow-hidden"
    :pt="{ 
        header: { class: 'h-12' },
        title: { class: 'dark:text-primary-500' },
        toggleablecontent: { class: 'h-full overflow-hidden' },
        content: { class: 'h-full overflow-hidden' }
        }"
    :pt-options="{ mergeProps: true }">
        <div ref="settingsContainerRef" class="w-full h-full relative flex overflow-hidden">
            <DataTable :value="history" scrollable :scrollHeight="height + 'px'" class="w-full h-full">
                <Column header="Новая пара" field="newPair.title"></Column>
                <Column header="Предыдущая пара" field="oldPair.title"></Column>
                <Column header="Время изменения" :field="( hist ) => ( formatDate( new Date( hist.timestamp ), 'YYYY-MM-DD HH:mm:ss' ))"></Column>
            </DataTable>
        </div>
    </Panel>
</div>

</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useSettingsStore, PAIRS_ARR } from '@/stores/settings-store';
import { storeToRefs } from 'pinia';
import { useElementSize, formatDate } from '@vueuse/core';
import { ref } from 'vue';

const SettingsStore = useSettingsStore();
const { changeActivePair } = SettingsStore;
const { activePair, history } = storeToRefs( SettingsStore );

const settingsContainerRef = ref();
const { height } = useElementSize( settingsContainerRef );

</script>