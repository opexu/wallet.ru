import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useWebSocket } from '@vueuse/core';
import { type IPair, useSettingsStore } from "@/stores/settings-store";

export interface IOrder {
    price: number;
    quantity: number;
};

export type IBidWS = [ 
    string, // Price level to be updated
    string, // Quantity
];

export interface IDepthWS {
    e: string, //"depthUpdate", // Event type
    E: number, // 1672515782136 // Event time
    s: string, // "BNBBTC",      // Symbol
    U: number, // 157,           // First update ID in event
    u: number, // 160,           // Final update ID in event
    b: IBidWS[], 
    a: IBidWS[],
};

export const useOrderStore = defineStore('OrderStore', () => {

    const limit = ref(100);
    
    const SettingsStore = useSettingsStore();
    const { activePair } = storeToRefs( SettingsStore );
    const activePairComputed = computed(() => activePair.value.title.split('/').join('') );
    watch( activePairComputed, ( pair ) => {
        wsURL.value = updateWSURL( pair );
        wsOpen();
        updateOrders();
    });
    

    const asksArr = ref<IOrder[]>([]);
    const bidsArr = ref<IOrder[]>([]);
    let lastUpdateId: number | null = null;

    let wsCache: IDepthWS | null = null;
    const wsURL = ref( updateWSURL( activePairComputed.value ) );
    function updateWSURL( pair: string ){
        return `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@depth`;
    }

    const { status: wsStatus, data: wsData, send, open: wsOpen, close: wsClose } = useWebSocket<string>( wsURL );
    watch( wsData, ( wsRaw ) => {
        if( !wsRaw || !lastUpdateId ) return;
        let wsJson: IDepthWS | null = null;
        try{
            wsJson = JSON.parse( wsRaw );
        }catch(e){
            wsJson = null;
            console.error('error at parse ws data');
        }
        if( !wsJson ) return;
        const { U: firstId, u: finalId, a, b, s: pair } = wsJson;
        if( pair !== activePairComputed.value ) return;
        if( finalId <= lastUpdateId ) return;
        if( firstId <= lastUpdateId + 1 && finalId >= lastUpdateId + 1 ){
            wsCache = wsJson;
            updateValues( asksArr.value, wsCache.a );
            updateValues( bidsArr.value, wsCache.b );
            lastUpdateId = finalId;
        }else{
            console.warn('something going wrong, updateOrders');
            updateOrders();
        }
    })
    
    function updateValues( oldData: IOrder[], newData: IBidWS[] ){
        const newDataLength = newData.length;
        for( let i = 0; i < newDataLength; i++ ){
            const n = newData[ i ];
            const newPrice = parseFloat( n[0] );
            const newQuantity = parseFloat( n[1] );
            if( newQuantity === 0 ) continue;
            if( newPrice > oldData[0].price ){
                oldData.unshift({ price: newPrice, quantity: newQuantity });
                oldData.pop();
                continue;
            }
            if( newPrice < oldData[oldData.length - 1].price ) continue;
            const index = oldData.findIndex( o => o.price <= newPrice );
            if( oldData[ index ].price === newPrice ){
                oldData.splice( index, 1, { price: newPrice, quantity: newQuantity });
            }else{
                oldData.splice( index, 0, { price: newPrice, quantity: newQuantity });
                oldData.pop();
            }
        }
    }

    async function updateOrders(){
        const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${activePairComputed.value}&limit=${limit.value}`);
        const data = await res.json() as { asks: IBidWS[], bids: IBidWS[], lastUpdateId: number };
        asksArr.value = data.asks.map( a => ({ price: parseFloat( a[0] ), quantity: parseFloat( a[1] ) }));
        bidsArr.value = data.bids.map( b => ({ price: parseFloat( b[0] ), quantity: parseFloat( b[1] ) }));
        lastUpdateId = data.lastUpdateId;
    }

    onMounted( async () => {
        // if( wsStatus.value === 'OPEN' || wsStatus.value === 'CONNECTING' ) wsClose();
        wsURL.value = updateWSURL( activePairComputed.value );
        // wsOpen();
        updateOrders();
    });
    
    onUnmounted(() => {
        // wsClose();
    });

    return { limit, asksArr, bidsArr, updateOrders }
})