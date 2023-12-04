<template>

    <div class="sticky top-0 z-20">
        <Timeline v-bind="$attrs" :memories="editableMemory"  >
    </Timeline>
    </div>
   
    <div class="list">
        <div class="flex justify-end w-full">
          

            <table class="table">
                <tbody>
                    <tr>
                        <td>年龄</td>
                        <td>事迹</td>
                    </tr>
                    <tr v-for="i in editableMemory.memories" class="justify-center">
                        <td class="w-20">
                            <KeyNode class="w-full" label="" v-model="i.age" placeholder="年龄"></KeyNode>
                        </td>
                        <td class="">
                            <InputEditableKeyNode settingButton class=" col-span-full" inputType="textarea" v-model="i.ctx"
                                input-style="h-[36px] p-1 px-2"></InputEditableKeyNode>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import untruncateJson from 'untruncate-json';
import { NPCStoryPromptParams, NewNpCStoryPrompt } from '~/utils/store/prompt';

export type StreamingMemory = {
    bornAt: number,
    draft_memories: {
        age: number,
        ctx: string,
        // emoji: string
    }[],
    standard_memories: {
        age: number,
        ctx: string,
        emoji: string
    }[]
}



const props = defineProps<{
    npcProfile: Npc_Profile
}>()




const editableMemory = ref<Memory>({
    bornAt: 0,
    memories: []
})
const promptMessage = ref({
    messages: NewNpCStoryPrompt({ generate_npc: props.npcProfile })
})
const { abort, fetch, value: streamText, loading, event } = useReadStream(promptMessage.value)

event.on('onDone', console.log)
const computedStream = computed<StreamingMemory>(() => {
    const tmp = computedStream.value as StreamingMemory;
    try {
        const jsonstr = untruncateJson(streamText.value)
        return JSON.parse(jsonstr) as StreamingMemory
    } catch (e) {
        return tmp as StreamingMemory
    }
})

const { data, refresh } = useNuxtApp().$client.memory.get.useQuery({
    npc_id: props.npcProfile.npc_id
});

watchEffect(() => {
   
    const a: Memory = {
        bornAt: 0,
        memories:[]
    }
        a.memories= data.value?.map(m => {
            a.bornAt = m.bornAt
            return {
                age: m.age,
                ctx: m.ctx,
                emoji: m.emoji,
                npc_id: m.npc_id ,
                id: m.id,
            }
        }) as Memory['memories']
    

    editableMemory.value = a
})

watchEffect(() => {
    try {
        const jsonstr = untruncateJson(streamText.value)
        const steamingdata = JSON.parse(jsonstr) as StreamingMemory
        if (steamingdata.draft_memories) {
            editableMemory.value = {
                bornAt: steamingdata.bornAt,
                memories: steamingdata.draft_memories
            }
            if (steamingdata.standard_memories) {
                steamingdata.standard_memories.forEach((standard, index) => {
                    if (steamingdata.standard_memories.length <= index) {
                        // 没有下一个了
                    }
                    const replace = editableMemory.value?.memories.find((m) => m.age === standard.age)
                    if (replace) {
                        (replace.ctx = standard.ctx)
                    }
                    else {
                        editableMemory.value?.memories.push(standard)
                        editableMemory.value?.memories.sort((a, b) => a.age - b.age)
                    }
                });



            }
        }
        editableMemory.value?.memories.forEach(memory => {
            memory.npc_id = props.npcProfile.npc_id
        });
    } catch (e) {
        // throw e
        return;
    }



    // computedStream.value.standard_memories.forEach(standard => {

    // });
    // // editableMemory.value = {
    // //     bornAt: computedStream.value.bornAt,
    // //     memories: computedStream.value.standard_memories
    // // }
    // }

})










const generateTimeline = (promptParams: NPCStoryPromptParams) => {
    abort()
    promptMessage.value.messages = NewNpCStoryPrompt(promptParams)
    console.log('prompt',promptMessage.value.messages)
    nextTick(() => {
        fetch()
    })
}


const updateTimeline = async () => {

    if (!editableMemory.value) return
     await useNuxtApp().$client.memory.updateBranch.mutate({
        npc_timeline: true,
        data: editableMemory.value
    });
    refresh()
    return
}


const refreshMemoryData = async () => {
    if (!editableMemory.value) return
    refresh()
}
const deleteMemory = async () => {
    if (!editableMemory.value) return
    await useNuxtApp().$client.memory.deleteAll.mutate({npc_id:props.npcProfile.npc_id})
    refresh()
}

defineExpose({
    generateTimeline,
    editableMemory,
    updateTimeline,
    refreshMemoryData,
    deleteMemory

})


</script>

<style scoped></style>