<template>
 
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{title}}
              </DialogTitle>
              <div class="mt-2">
               <slot></slot>
              </div>

              <div class="mt-4 flex  justify-end gap-2">
                <button
                  type="button"
                  class="btn btn-sm "
                  @click="closeModal"
                >
                  关闭
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-primary "
                  @click="done"
                >
                  确认
                </button>

              </div>
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





defineProps(['title'])

const isOpen = ref(false)

const closeModal = () => {
  setIsOpen(false)
}
function setIsOpen(value:boolean) {
  isOpen.value = value
}



function done(...args:any){
  emit('done',...args)
  closeModal()
}

const emit = defineEmits(['done'])
defineExpose({
  setIsOpen
})
</script>

<style lang="scss" scoped></style>