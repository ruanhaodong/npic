<template >
    <div class="w-full h-screen overflow-y-scroll">
        <div class="m-4 space-y-2">
            <h1 class="text-lg">背景故事</h1>
            <div class="flex w-full h-60 lg:h-32 gap-4 flex-wrap">
                <div class="relative bg-neutral w-64 p-4 rounded-lg transition-all hover:scale-[101%] group">
                    <textarea
                        class="p-0 textarea h-full w-full bg-transparent focus:outline-none outline-none focus:ring-0 border-none"
                        ref="bg_prompt" placeholder="提示词"></textarea>


                    <div class="absolute right-2 bottom-2 flex gap-2 items-center">
                        <!-- <div class="btn btn-xs hidden group-hover:flex" >缩放</div> -->
                        <div class="btn btn-sm" @click="gen()">生成</div>
                    </div>
                </div>
                <div class="flex-1 flex-grow relative bg-neutral h-full p-4 rounded-lg">
                    <textarea
                        class="textarea h-full resize-none w-full bg-transparent focus:outline-none outline-none focus:ring-0 border-none"
                        v-model="story" id="background" placeholder="背景故事"></textarea>
                    <div class="absolute right-2 bottom-2 flex gap-2 items-center">
                        <!-- <div class="btn btn-xs hidden group-hover:flex" >缩放</div> -->
                        <div class="btn btn-sm" @click="saveBackgroundStory">保存</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-4 space-y-2">
            <h1 class="text-lg">世界地图</h1>
            <div class=" btn btn-xs mr-2"  v-for="area in areas" @click="addArea(area)">{{ area.name }}</div>
            <div class="flex w-full gap-4">
                <div class="relative bg-neutral h-[500px] w-full p-4 rounded-lg group overflow-hidden">
                    <!-- <img :src="bgUrl" class="object-cover" alt="" /> -->
                    <Map :preset_map-data="data?.map ? (data?.map[0] as any) : undefined" ref="map"></Map>

                    <div class="absolute right-2 bottom-2 flex gap-2 items-center">
                        <!-- <div class="btn btn-xs hidden group-hover:flex" >缩放</div> -->
                        <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="uploadFile" />
                        <div class="btn btn-sm" @click="chooseFile">上传背景图片</div>
                        <div class="btn btn-sm" @click="saveMap">保存地图</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="m-4 space-y-2">
            <h1 class="text-lg">大事记（根据NPC记忆总结）</h1>
            <div class="flex w-full gap-4 flex-wrap">
                <div class="relative bg-neutral w-full p-4 rounded-lg transition-all hover:scale-[101%] group">
                    <TimelineDetail  :memories="memory"   ></TimelineDetail>
                    
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup lang="ts">

import Map from '../map/map.client.vue';
import { NewBackgroundPrompt } from "~/utils/store/prompt";
import untruncateJson from "untruncate-json";
import { put } from '~/server/upload';

const bg_prompt = ref<HTMLInputElement>()
const prompts = reactive({
    messages: NewBackgroundPrompt({}),
})

const {$client:client} = useNuxtApp()
const {data } = client.worldRule.get.useQuery()
const { abort, fetch, value, loading, event } = useReadStream(prompts)
const {data:memory, refresh} = useNuxtApp().$client.memory.get.useQuery({})

watchEffect(() => {
    value.value = data.value?.background_story || ""
})


var textarea = document.getElementById("background") as any;
const story: any = computed(()=>{
    const tmp = story.value || ""
    try{
        const data = untruncateJson(value.value)
        return JSON.parse(data).story
    }catch(e){
        return tmp.story 
    }
})

const areas: any = computed(()=>{
    const tmp = areas.value || []
    let count = 0
    
    try{
        const data = untruncateJson(value.value)
        if (JSON.parse(data).areas.length >= 1) {
            count = JSON.parse(data).areas.length
        }
        
        return JSON.parse(data).areas
    }catch(e){
        return tmp.areas 
    }
})

const gen = () => {
    console.log();
    prompts.messages =  NewBackgroundPrompt({
       extra_Prompt: bg_prompt.value!.value 
    })
    nextTick(() => {
        fetch()
    })
}

const instance = getCurrentInstance();
const fileInput = ref();
const map = ref<InstanceType<typeof Map> | null>(null);
let bgUrl = "";


const chooseFile = () => {
    fileInput.value.click();
};

const uploadFile = async (event: any) => {
    const file = event.target.files[0];
    // 在这里处理上传文件的逻辑
    console.log(file);
    const result = await put(file);
    console.log(result);
    bgUrl = result.url;
    map.value?.initCanvas()
    map.value?.loadImage(bgUrl)
    instance?.proxy?.$forceUpdate();
};


const saveBackgroundStory = async () => {
    const r = await client.worldRule.update.mutate({ background_story: value.value });
}
const saveMap = async () => {
    const mapData = map.value?.saveMapToJson()
    console.log(mapData)
    const r = await client.worldRule.update.mutate({
        background_story: value.value, map: {
            background_id: mapData!.background,
            id: mapData!.mapId,
            areas: mapData!.areas,
            jsonData: mapData!.jsonData
        }
    })

}

const addArea = (areaInfo: any) => {
    map.value?.setArea(areaInfo)
}


</script>
    
<style scoped></style>~/server/upload