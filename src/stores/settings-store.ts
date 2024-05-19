import { useManualRefHistory, useStorage, formatDate, type UseRefHistoryRecord  } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, onMounted, onBeforeMount, ref, watch, toRaw } from "vue";
import { useHistory } from "@/composables/useHIstory";

export interface IPair {
    title: string;
};

export const PAIRS_ARR: IPair[] = [
    {
        title: 'BTC/USDT',
    },
    {
        title: 'BNB/BTC',
    },
    {
        title: 'ETH/BTC',
    },
];

export const useSettingsStore = defineStore('SettingsStore', () => {

    const activePair = ref<IPair>( PAIRS_ARR[0] );
    watch( activePair, ( newPair, oldPair ) => {
        if( newPair === oldPair || !oldPair ) return;
        history.add( toRaw( newPair ), toRaw( oldPair ) );
    });
    
    const history = useHistory( { limit: 10 } );

    function changeActivePair( newPair: IPair ){
        activePair.value = newPair;
    }

    return {
        activePair, history: history.history,
        changeActivePair,
    }
})