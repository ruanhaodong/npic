<template>
    <div class="w-full h-screen">
        <div class="p-4 space-y-2 h-full flex flex-col ">
            <div class="flex w-full items-center">
                <h1 class="text-lg">NPC关系网</h1>
                <div class="btn btn-sm ml-3" @click="refresh()">刷新</div>
                <NuxtLink class="btn btn-sm ml-auto px-12" to="/world/npc/new">新增NPC</NuxtLink>
                <!-- <div ></div> -->
            </div>
            <div>
            </div>
            <div class="flex w-full h-full  gap-4 flex-wrap ">
                <div class="relative  bg-neutral  w-full flex-1
         p-4">
                    <NetworkBaseNetwork v-if="data" :relations="(data as any)" @refresh="refresh"></NetworkBaseNetwork>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { refresh, data, } = await useFetch('/api/npc')




</script>

<style scoped></style>