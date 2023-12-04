<template>
     <div class=" btn btn-xs ">{{ name || '红色小刀' }}</div>
</template>

<script setup lang="ts">
defineProps(['name'])
</script>

<style scoped>

</style>