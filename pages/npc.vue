<template>
   


    <button class="btn" @click="() => {
        dark = !dark;
        console.log(json) }">console</button>
       
    <div class="w-full "  :data-theme="`${dark?'dark':'light'}`">
        <div class=" max-h-screen min-h-96 overflow-scroll p-2 w-60 border">
            {{ 
        json }}
            <NodeEditor v-model:kv="json"></NodeEditor>
        </div>
    </div>
</template>

<script setup lang="ts">

const { data: npclist } = await useFetch('/api/npc')

const dark = ref(false)


const json = ref({
    hello: '123',
    hi: {
        who: 'i am',
        where: 'here',
        people: {
            name: '123',
            age: 123
        }
    },
    array: [
        1, 2, 3, 4, {
            a: 1,
            b: 2
        }
    ]
})

const createNpc = () => {

}


</script>

<style scoped></style>