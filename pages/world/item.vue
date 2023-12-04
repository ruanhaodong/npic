<template>
    <div class="m-4 space-y-2 ">
        <div class="flex items-center">
            <h1 class="text-lg">道具</h1>
            <div class="btn btn-sm ml-auto" @click="openNewItemModal">新建道具</div>
        </div>

        <div class="flex w-full h-32  gap-4 flex-wrap">
            <div class="relative  bg-neutral  w-full p-4 rounded-lg transition-all hover:scale-[101%] group">
                <textarea class="p-0 textarea h-full w-full bg-transparent 
            focus:outline-none  outline-none focus:ring-0 border-none" ref="bg_prompt" placeholder="提示词"></textarea>



                <div class="absolute right-2 bottom-2 flex gap-2 items-center">
                    <div class="btn btn-sm">批量生成</div>
                </div>

            </div>

        </div>
    </div>


    <div class="m-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 ">

        <ItemNode></ItemNode>

    </div>



    <NewItem ref="newItemModal" title="创建道具" ></NewItem>
</template>

<script setup lang="ts">
import ItemNode from '~/components/world/itemNode.vue';
import NewItem from '~/components/modal/NewItem.vue';

const newItemModal = ref<InstanceType<typeof NewItem> | null>(null);

    const openNewItemModal =()=>{
        newItemModal.value?.setIsOpen(true)
    }


</script>

<style scoped></style>