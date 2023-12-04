<template>
    <div class="p-4 space-y-2">

        <div class="text-lg font-bold">规则</div>

        <div class="flex items-end gap-4">
            <textarea class="textarea textarea-info " type="text" v-model="worldRules" />

<div class="btn btn-sm" @click="save">保存</div>

        </div>
       
    </div>
</template>

<script setup lang="ts">
const worldRules = ref('');
const { $client } = useNuxtApp();
const { data } = await $client.worldRule.get.useQuery()
if (data.value) {
    console.log(data.value)
    worldRules.value = (data.value.join('\n'))
}
const save = async () => {
    await $client.worldRule.update.mutate({
        rules: worldRules.value.split('\n')
    })
}




</script>

<style scoped></style>