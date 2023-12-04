<template>
    <div>

    </div>
</template>

<script setup lang="ts">
useSupabaseClient().from('npc').select('*').then((data) => {
    console.log(data);
})
</script>

<style scoped>

</style>