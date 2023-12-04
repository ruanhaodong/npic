<template>
    <Timeline v-bind="$attrs" :memories="editableMemory">
    </Timeline>
    <div class="list">
        <div class="flex justify-end w-full">
            <table class="table">
                <tbody>
                    <tr v-for="i in editableMemory.memories" class="justify-center ">

                        <td class="w-20">
                            <KeyNode v-model="i.age" class="w-full" label="" placeholder="时间"></KeyNode>
                           
                        </td>
                        <td class="">
                            <InputEditableKeyNode settingButton class=" col-span-full" inputType="textarea"
                                input-style="h-[43px] p-1 px-2" v-model="i.ctx"></InputEditableKeyNode>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="">
            </div>
            <!-- <KeyNode class="w-full"  placeholder="事件" setting-button ></KeyNode> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { Memory, PrismaClient } from '@prisma/client';


const props = defineProps<{
    memories: Memory[]
}>()


const editableMemory = ref<globalThis.Memory>(
    {
        bornAt: 0,
        memories: []
    }
)

watchEffect(() => {
    if (!props.memories) return;
    let bornAt = Infinity;
    const mem = props.memories.map(i => {
        if (i.bornAt < bornAt) {
            bornAt = i.bornAt
        }
        return {
            id: i.id,
            age: i.age,
            npc_id: i.npc_id,
            ctx: i.ctx,
            emoji: i.emoji
        } 

    }

    )
    editableMemory.value = {
        bornAt,
        memories: mem as unknown as globalThis.Memory['memories']
    }
})
const generateTimeline = () => {

}


defineExpose({
    generateTimeline,
})


</script>

<style scoped></style>