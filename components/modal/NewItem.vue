<template>
  <BaseModal ref="modal" title="创建道具">
    <div class="space-y-2 w-full ">

      <input class="w-full input input-sm input-primary  " placeholder="道具名称">


      <input class="w-full input input-sm input-primary  " placeholder="归属人">
      <select class="select select-bordered select-sm select-primary w-full  px-2 py-0"
      placeholder="归属人"
      
      >
      <option  disabled selected>归属人</option>
  <option>Small Apple</option>
  <option>Small Orange</option>
  <option>Small Tomato</option>
</select>
      <textarea class="w-full h-20 input input-sm input-primary " placeholder="道具详情"></textarea>


    </div>

  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const modal = ref<InstanceType<typeof BaseModal> | null>(null);






const setIsOpen = (bol: boolean) => {
  modal.value?.setIsOpen(bol)
}

defineExpose({
  setIsOpen
})
</script>

<style scoped></style>