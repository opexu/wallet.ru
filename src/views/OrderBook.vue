<template>
<div id="order-book" class="w-full h-full flex flex-col gap-2 overflow-hidden">
    <div ref="orderBookContainer" class="w-full h-full flex flex-row gap-2 overflow-hidden">
        <Order
        title="BIDS"
        :data="bidsArr"
        />
        <Order
        title="ASKS"
        :data="asksArr"
        />
    </div>

    <Panel
    :pt="{ 
        header: { class: 'hidden' },
        content: { class: 'p-2 pt-2' } 
    }"
    :pt-options="{ mergeProps: false }">
        <div id="test" class="w-full h-fit flex flex-row items-center justify-end">
            <Dropdown v-model="limit" 
            :options="[ 100, 500, 1000 ]"
            :placeholder="limit.toString()"
            @update:modelValue="updateOrders"
            >
            </Dropdown>
        </div>
    </Panel>
</div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import Dropdown from 'primevue/dropdown';
import Order from '@/components/Order.vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order-store';

const OrderStore = useOrderStore();
const { limit, asksArr, bidsArr } = storeToRefs( OrderStore );
const { updateOrders } = OrderStore;

</script>