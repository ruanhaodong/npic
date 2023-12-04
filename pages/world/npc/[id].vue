<template>
    <NpcEditor :npc_preset_profile="(npc as any)" ></NpcEditor>
    <div>

      

    </div>
</template>

<script setup lang="ts">
import { Npc } from '@prisma/client';

const {$router} = useNuxtApp()
const { id } = useRoute().params
const {data:npc}  = await useFetch(`/api/npc/${id}`)


if (!npc.value) {
   $router.replace('/world/npc/new')
}


</script>

<style scoped>

</style>