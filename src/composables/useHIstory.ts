import type { IPair } from "@/stores/settings-store";
import { useStorage } from "@vueuse/core";
import { computed, ref } from "vue";

export interface IPairChange {
    newPair: IPair,
    oldPair: IPair,
    timestamp: number,
}

export interface IHistoryOpts {
    limit: number
}

export function useHistory( opts: IHistoryOpts ){

    const history = ref<IPairChange[]>([]);
    const historyStorage = useStorage('history-storage', history, localStorage );
    function add( newPair: IPair, oldPair: IPair ){
        if( history.value.length < opts.limit ){
            history.value.unshift({
                newPair, oldPair,
                timestamp: Date.now()
            });
        }else{
            history.value.pop();
            history.value.unshift({
                newPair, oldPair,
                timestamp: Date.now()
            });
        }
        
    }

    return { add, history }
}