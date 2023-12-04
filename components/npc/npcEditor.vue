<template>
  
    <div class="flex flex-col border-green-400">
        <div class="p-4 space-y-2  flex flex-col sticky top-0 bg-base-100 z-10 ">
            <div class="flex ">
                <div class="w-20 h-20 bg-neutral  rounded-md">
                </div>
                <!-- {{ npc_preset_profile }} -->
                <!-- {{ npcProfile }} -->
                <div class="names  px-3 font-bold">
                    <p>{{ npcProfile.fullname }}</p>
                    <p>{{ npcProfile.npc_id }}</p>
                
                </div>
                <div class="ml-auto space-x-3  flex items-center flex-wrap">
                    <div class="flex-grow btn btn-sm btn-error ">删除</div>

                    <div v-if="newNpcIsGenerating" class="flex-grow btn btn-sm btn-disabled">生成中</div>
                    <div v-else class="flex-grow btn btn-sm " @click="saveNpc()">保存</div>
                </div>
            </div>
        </div>

        <div class="p-4 pt-0 space-y-2 ">
            <h1 class="text-lg font-bold">描述</h1>

            <div class="relative  bg-neutral  w-full p-4 rounded-lg transition-all hover:scale-[101%] group">
                <textarea class="p-0 textarea h-full w-full bg-transparent  
            focus:outline-none  outline-none 
            border-none focus:ring-0 
            " v-model="promptInput" ref="bg_prompt" placeholder="输入你想创造的任务有关信息，随机生成请直接点【生成】"></textarea>
                <div class="absolute right-2 bottom-2 flex gap-2 items-center">
                    <div class="btn btn-sm" @click="geneateNewNpc">生成</div>
                </div>

            </div>
        </div>

        <div class="p-4 pt-0 space-y-2 ">
            <h1 class="text-lg font-bold">NPC信息 </h1>

            <div class="space-y-2">
                <p class="text">基础类</p>
                <div class="bg-neutral  p-6 rounded-lg
            grid 
            grid-cols-2
            md:grid-cols-3
            gap-2 ">
                    <KeyNode class="" label="姓名" v-model="npcProfile.fullname"></KeyNode>
                    <KeyNode label="性别" v-model="npcProfile.gender"></KeyNode>
                    <KeyNode label="年龄" v-model="npcProfile.age"></KeyNode>
                    <KeyNode label="职业" v-model="npcProfile.job"></KeyNode>
                    <KeyNode label="MBTI" v-model="npcProfile.MBTI"></KeyNode>
                    <!-- <KeyNode class="col-start-1 col-end-2" label="区域" v-model="[]"></KeyNode> -->
                    <KeyNode class=" col-span-full" label="人物特质" v-model="npcProfile.traits"></KeyNode>
                    <InputEditableKeyNode settingButton class=" col-span-full" inputType="textarea" label="个人介绍"
                        v-model="npcProfile.backstory"></InputEditableKeyNode>
                   
                        <KeyNode class="col-span-full" label="秘密" v-model="npcProfile.hidden_secret"></KeyNode>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text">社交关系</p>
                <div class="bg-neutral  p-6 rounded-lg gap-2 grid sm:grid-cols-2 lg:grid-cols-5 ">



                    <template v-for="r in npcProfile.social_relations">
                        <RelationCard :relation="r"></RelationCard>
                    </template>

                    <template v-for="r in npcProfile.family">
                        <RelationCard class="bg-base-200" :relation="r"></RelationCard>
                    </template>



                </div>
            </div>
            <div class="space-y-2">
                <div class="flex w-full  items-center">
                    <div class="text">记忆事件</div>
                    <div class="ml-auto space-x-2">
                        <div class="btn btn-sm" @click="generateTimeline" > 生成记忆</div>
                        <div class="btn btn-sm"> 智能修改</div>
                        <div class="btn btn-sm" @click="updateMemory"> 保存</div>
                        <div class="btn btn-sm" @click="deleteAll"> 删除</div>
                    </div>

                </div>
              
                <div class="bg-neutral  p-6 rounded-lg">
                  
                    <NpcTimeline  :npcProfile="npcProfile" ref="npcTimeLineRef"></NpcTimeline>
                </div>
            </div>
            <!-- <div class="space-y-2">
                <p class="text">拥有道具</p>
                <div class="  p-6 grid  sm:grid-cols-2 lg:grid-cols-5 gap-2">


                    <WorldItemNode></WorldItemNode>
                    <WorldItemNode></WorldItemNode>
                    <WorldItemNode></WorldItemNode>

                </div>
            </div> -->

        </div>




    </div>
</template>

<script setup lang="ts">
import type { Npc } from '@prisma/client';
import untruncateJson from 'untruncate-json';
import NpcTimeline from '~/components/timeline/NpcTimelines.vue'
import { NewNpcPrompt, type newBackgroundCallBack } from '~/utils/store/prompt';



const { $client } = useNuxtApp();
const props = defineProps<{
    npc_preset_profile?: Npc
}>()
const {data:background } = $client.worldRule.get.useQuery()
const promptInput = ref('');
const npcTimeLineRef = ref<InstanceType<typeof NpcTimeline> >()
const prompt = ref({ messages: NewNpcPrompt({}) })
const { abort, fetch, value, loading, event } = useReadStream(prompt.value)
const npcProfile = ref<Npc_Profile>({
    npc_id: undefined,
    age: 0, backstory: '', fullname: '', gender: '', hidden_secret: '', job: '', MBTI: '', race: '', family: [], social_relations: [], traits: [], type: 'person'
    , ...props.npc_preset_profile?.npc_profile as any,
    
})
watchEffect(()=>{
    if ( props.npc_preset_profile?.npc_id!=undefined){
        npcProfile.value.npc_id = props.npc_preset_profile?.npc_id
        npcProfile.value.fullname = props.npc_preset_profile?.fullname

    }
    if (props.npc_preset_profile?.npc_profile){
        npcProfile.value.family = props.npc_preset_profile.family as any;
        npcProfile.value.social_relations = props.npc_preset_profile.relations as any
        // (npcProfile.value.traits = props.npc_preset_profile.npc_profile as any)

    }
})

const newNpcIsGenerating = ref(false);


const npNpcPromptMessage = ()=>{
    let bg:newBackgroundCallBack | null = null
   try{
     bg= JSON.parse(background.value!.background_story!)
   }
   catch(e){
   }
   

    const messagePrompt = NewNpcPrompt({
        preset_id:presetId,
        base_rule: bg ? bg.story : '',
        area_data: bg ? bg.areas.map(m=>  `${m.name}:${m.description}`).join('\n') : '',
        preset_fullname: npcProfile.value.fullname,
        npc_extra_info: promptInput.value,
    })
    return 
}
const geneateNewNpc = async () => {
    console.log(promptInput.value)
    newNpcIsGenerating.value = true
    let presetId =props.npc_preset_profile?.npc_id ; 
   if (presetId==undefined){
    const size = await $fetch('/api/npc/size')
    if (size!=null) presetId = 'npc'+size
   }

   let bg:newBackgroundCallBack | null = null
   try{
     bg= JSON.parse(background.value!.background_story!)
   }
   catch(e){
   }


   



   const npcs = await $fetch(`/api/npc/npcs/relation?npcid=${npcProfile.value.npc_id}`)
   const existedNpc = await $fetch(`/api/npc/npcs/exist?npcid=${npcProfile.value.npc_id}`)

    const messagePrompt = NewNpcPrompt({
        preset_id:presetId,
        base_rule: bg ? bg.story : '',
        area_data: bg ? bg.areas.map(m=>  `${m.name}:${m.description}`).join('\n') : '',
        preset_fullname: npcProfile.value.fullname,
        npc_extra_info: promptInput.value,
        existedNpc:existedNpc,
        npcs: npcs as any
    })
    console.log(messagePrompt)
    prompt.value.messages = messagePrompt
    console.log(prompt.value.messages)
    nextTick(() => {
        fetch()
    })
    const fn = () => {
        newNpcIsGenerating.value = false
    }
    event.on('onDone', (data) => {
        console.log(data)
        fn()
        event.off('onDone', fn)
    })
}
const onDataUpdate = ({ delta, full_text }: { delta: string, full_text: string }) => {
    const data = untruncateJson(full_text);
    try {
        const json = JSON.parse(data).npc
        npcProfile.value = { ...npcProfile.value, ...json }
    }
    catch (e) {
        console.error(e)
        abort()
    }
}
event.on('onUpdate', onDataUpdate)



const saveNpc = async () => {
    const a = await $client.npc.update.mutate(npcProfile.value)
}




const generateTimeline = async () => {

    let bg:newBackgroundCallBack | null = null
   try{
     bg= JSON.parse(background.value!.background_story!)
   }
   catch(e){
   }
   
    console.log("225",{
        generate_npc:npcProfile.value,
        base_rule: bg ? bg.story : '',
        area_data: bg ? bg.areas.map(m=>  `${m.name}:${m.description}`).join('\n') : '',
    })
    npcTimeLineRef.value!.generateTimeline({
        generate_npc:npcProfile.value,
        base_rule: bg ? bg.story : '',
        area_data: bg ? bg.areas.map(m=>  `${m.name}:${m.description}`).join('\n') : '',
    })
    console.log('called')
}
const updateMemory = async ()=>{
    npcTimeLineRef.value?.updateTimeline().then(()=>console.log('updated'))
}
const deleteAll = async ()=>{
    npcTimeLineRef.value?.deleteMemory().then(()=>console.log('deleted'))
}
</script>

<style lang="scss" scoped></style>