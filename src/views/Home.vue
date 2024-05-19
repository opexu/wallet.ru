<template>
<div class="w-full h-full p-4 flex flex-col gap-4 bg-surface-950 items-center justify-start select-none overflow-hidden">
    <header class="w-full h-fit flex flex-row space-x-2 items-center justify-between">
        <Image class="max-w-[250px]" src="https://firebasestorage.googleapis.com/v0/b/ko-static-master.appspot.com/o/images%2Fsystem%2Fdefault--dark%2Flogo.svg?alt=media&token=eb560c1b-49ce-4802-8829-0ff213df8a0c"/>
        <div class="w-full h-fit flex flex-row items-center justify-end gap-2">
            <Button v-for="(nav) in navBtns" :key="nav.label"
            :text="route.name !== nav.url"
            class="w-fit"
            :label="nav.label"
            @click="route.name !== nav.url && router.push( nav.url )"
            />
        </div>
    </header>

    <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
            <component :is="Component"/>
        </transition>
    </RouterView>
</div>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import Image from 'primevue/image';
import Button from 'primevue/button';
import { onMounted, ref } from 'vue';
const route = useRoute();
const router = useRouter();
interface INavigationBtn {
    label: string,
    url: string,
}
const navBtns = ref<INavigationBtn[]>([
    {
        label: 'Настройки',
        url: 'settings',
    },
    {
        label: 'OrderBook',
        url: 'order-book',
    }
]);

onMounted(() => router.push( navBtns.value[0].url ))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
