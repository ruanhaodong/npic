<template>
  <BaseModal ref="modal" title="创建区域" @done="submit">
    <div class="space-y-2 w-full ">

      <input v-model="name" class="w-full input input-sm input-primary" placeholder="区域名称">

      <textarea v-model="description" class="w-full h-20 input input-sm input-primary " placeholder="区域描述"></textarea>

    </div>

  </BaseModal>
</template>


<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const name = ref("")
const description = ref("")

const modal = ref<InstanceType<typeof BaseModal> | null>(null);

const submit = () => {
  const t = new Date();
  const data = {
    name: name.value,
    description: description.value
  }

  emit('done', data)

  name.value = ""
  description.value = ""
}


const setIsOpen = (bol: boolean, data?: any) => {
  modal.value?.setIsOpen(bol)
  if (data) {
    name.value = data.name,
    description.value = data.description

  }
}
const emit = defineEmits(['done'])
defineExpose({
  setIsOpen
})
</script>

<style scoped></style>