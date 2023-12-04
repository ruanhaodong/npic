<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full h-3/4 max-w-3xl transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                            <div class="w-full h-full flex flex-col">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                    {{ npc.fullname }}
                                </DialogTitle>
                                <div ref="scrollArea" id="scrollArea"
                                    class="w-full h-2/3 mt-6 mb-8 flex flex-col overflow-scroll">
                                    <div class="chat chat-start mb-3" :class="item.role == 'user' ? 'chat-end' : 'chat-start'"
                                        v-show="index > 1" v-for="(item, index) in prompts.messages">
                                        <div class="chat-bubble" :class="item.role == 'user' ? 'chat-bubble-accent' : ''">{{
                                            item.content }}</div>
                                    </div>

                                    <div class="chat chat-start mb-3" v-show="saying">
                                        <div class="chat-bubble">{{ value }}</div>
                                    </div>

                                </div>
                                <textarea class="w-full h-28 input input-sm input-primary" style="resize: none;"
                                    placeholder="请输入对话内容" v-model="text"></textarea>
                            </div>

                            <svg t="1688552792009" class="icon absolute right-6 top-6 cursor-pointer" @click="closeModal"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2437"
                                width="30" height="30">
                                <path
                                    d="M481.834667 512L155.584 185.749333a21.333333 21.333333 0 0 1 30.165333-30.165333L512 481.834667 838.250667 155.584a21.333333 21.333333 0 0 1 30.165333 30.165333L542.165333 512l326.250667 326.250667a21.333333 21.333333 0 0 1-30.165333 30.165333L512 542.165333 185.749333 868.416a21.333333 21.333333 0 1 1-30.165333-30.165333L481.834667 512z"
                                    fill="#3D3D3D" p-id="2438"></path>
                            </svg>
                            <button type="button" class="btn btn-sm btn-primary absolute right-8 bottom-9"
                                @click="send">发送</button>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
  
  
<script setup lang="ts">
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import { NewChatPrompt } from "~/utils/store/prompt";

const scrollArea = ref(null);
const npcInfo = ref("")
const npc = ref()

const prompts = reactive({
    messages: NewChatPrompt({ extra_Prompt: npcInfo.value }),
})

const initConversation = async (data: any) => {
    console.log("1111", data)
    npc.value = data

    const npc_profile: any = data.npc_profile
    const family: any = data.family
    const relations: any = data.relations
    let familyStr: string = ""
    for (let member of family) {
        familyStr += member.role + "-" + member.fullname + ","
    }
    let relationStr: string = ""
    for (let member of relations) {
        relationStr += member.role + "-" + member.fullname + ","
    }



    const mems = await useNuxtApp().$client.memory.get.query({
        npc_id:npc_profile.npc_id
    })
    console.log('记忆加载',mems)
    const info = `
    姓名：${npc_profile.fullname}
    年龄：${npc_profile.age}
    性别：${npc_profile.gender}
    职业：${npc_profile.job}
    民族：${npc_profile.race}
    背景故事：${npc_profile.backstory}
    MBTI：${npc_profile.MBTI}
    特质：${npc_profile.traits}
    是否隐藏秘密：${npc_profile.hidden_secret}
    家庭关系：${familyStr},
    社会关系：${relationStr}
    人生经历: \n${mems.map((mem)=> npc_profile.fullname + mem.age+'岁时:'+mem.ctx).join('\n')}
    `
    npcInfo.value = info
    console.log(info)



    prompts.messages = NewChatPrompt({ extra_Prompt: npcInfo.value })
}

const { abort, fetch, value, loading, event } = useReadStream(prompts)

// watchEffect(() => {
//     value.value = data.value?.background_story || ""
// })

event.on("onDone", (data) => {
    saying.value = false
    prompts.messages.push({
        role: "assistant",
        content: data
    })
})

event.on("onUpdate", () => {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
})


const isOpen = ref(false)
const saying = ref(false)
let text = ""


const closeModal = () => {
    prompts.messages = NewChatPrompt({ extra_Prompt: npcInfo.value })
    setIsOpen(false)
}

function setIsOpen(value: boolean, data?: any) {
    if (data) {
        initConversation(data)
    }
    
    isOpen.value = value
}

function done(...args: any) {
    emit('done', ...args)
    closeModal()
}

const send = () => {
    console.log("text: ", text)
    prompts.messages.push({
        role: "user",
        content: text
    })
    nextTick(() => {
        scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
    })

    fetch()
    saying.value = true
    text = ""

    console.log(prompts.messages)
}

const emit = defineEmits(['done'])
defineExpose({
    setIsOpen
})
</script>
  
<style lang="scss" scoped></style>