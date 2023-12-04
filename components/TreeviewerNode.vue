<template>
    <div class="block py-1">
            <div class="relative current_node bg-base-300 flex  items-center px-2 py-1   text-sm rounded space-x-1 
        hover:bg-slate-500 hover:cursor-pointer">
            <div v-if="!root" class="horizontal_line absolute h-[2px]   bg-base-300 w-2 -left-2 "/>
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            <p class="z-10" >Name{{ tree }}</p>
        </div>
        <di  class="child_nodes ">
            <div  class="vertical_line   relative border-base-300  border-l-2 ml-2 pl-2 ">
                <TreeviewerNode class=" relative " v-if="tree>0" :tree="tree-1" ></TreeviewerNode>
            </div>
        </di>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['kv','tree','root'])
const emit = defineEmits(['update:kv'])


const isIterable = computed(()=>{
    return typeof props.kv === 'object' || Array.isArray(props.kv)
})

</script>

<style scoped>
/* .line:after{
    position: absolute;
    height: 1px;
    background-color: brown;
    content: '';
    width: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    top: 50%;
    transform: translateY(50%);

    
} */
</style>