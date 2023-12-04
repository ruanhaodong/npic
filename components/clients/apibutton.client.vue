<template>
    <div class="btn btn-sm btn-block h-10">
    <Button onclick="my_modal_1.showModal()">APIKey</Button>
   

</div>
<dialog id="my_modal_1" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">输入APIKEY</h3>
            <p class="py-4 leading-6">
                API Key只会保存在浏览器端localstorage，不会上传到服务器，但还是建议用完后去OpenAI后台删除APIKey，当前用的模型是gpt-3.5-turbo-0613
            </p>
            <input v-model="apikey" type="text" class="input input-sm input-secondary" /> 
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>

</template>

<script setup lang="ts">

const apikey = useLocalStorage('apikey','')
</script>

<style scoped>

</style>
