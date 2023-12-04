<template>
    <div class="card card-compact shadow-xl bg-base-100 p-2">
        <div class="card-title justify-center text-xs min-w-max"> <div class="name badge badge-primary">{{ 
            relation?.role
             }}</div>
            {{ relation?.fullname }} 

            <div class="ml-auto">
              
               
            <!-- <div class="btn btn-xs ">修</div>
            <div class="btn btn-xs ">生成</div> -->
            </div>
            </div>
       <div v-if="npc_profile?.npc_profile" class="card-body items-center  text-xs truncate overflow-clip" >
        <!-- <div class="w-12 h-12 rounded-full bg-base-200 "></div> -->
        <!-- <div >{{ relation?.fullname }}</div> -->
        {{ (npc_profile?.npc_profile as Npc_Profile).backstory }}
      
       </div>
        <div class="card-actions gap-1 justify-end">
            <NuxtLink :to="`/world/npc/${npc_profile?.npc_id}`">
                    <div class="btn btn-xs btn-error">{{ 
                        npc_profile?.npc_profile ? '编辑' : '创建'
                        }}</div>
            </NuxtLink>
        </div>
       
    </div>
</template>

<script setup lang="ts">


const props = defineProps({
    relation:{
        type : Object as PropType<RelationNode>
    }
})

const {  data:npc_profile} = await useFetch(`/api/npc/${props.relation?.id}`)



</script>

<style scoped>

</style>