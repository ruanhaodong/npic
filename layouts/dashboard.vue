<template>
    <div class="w-full  h-screen flex " data-theme="dracula">

        <div class="min-w-max m-2 w-40 flex item-center flex-col gap-3 p-6 bg-zinc-950">
            <img src="/logo1.png" class="w-44 mb-6 mt-2">
            <div class="btn btn-sm btn-block h-10">
                <NuxtLink to="/world/background">世界观</NuxtLink>
            </div>

            <div class="btn btn-sm btn-block h-10">
                <NuxtLink to="/world/npc">NPC</NuxtLink>
            </div>
            <ClientsApibutton></ClientsApibutton>
        
            <div class="btn mt-auto btn-sm btn-block h-10" @click="resetDb">重置世界</div>
            <!-- <div class="btn btn-sm btn-block">
                <NuxtLink to="/world/item">道具</NuxtLink>
            </div> -->

            <!-- <div class="btn btn-sm btn-block">  <NuxtLink to="/world/event">事件</NuxtLink></div> -->
            <!-- <div class="btn btn-sm btn-block">
                <NuxtLink to="/world/base-rule">规则</NuxtLink>
            </div> -->
        </div>

        <div class="flex-1     ">

            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const resetDb = async () => { await $fetch('/api/clear') }



</script>

<style scoped></style>