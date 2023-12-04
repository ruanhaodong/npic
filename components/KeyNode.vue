<template>
    <div class=" m-1  ">
        <div class=" flex w-full  ">
            <div v-if="label!=''" class=" label btn-sm  min-w-max">
                {{ label }}

            </div>

            <div class=" flex-1   ">
                <div class="relative">
                    <template v-if="inputType == 'input'">
                        <input :class="`input min-w-0 w-full  input-sm rounded-lg focus:outline-none focus:ring-0 ${inputStyle}`"
                        :placeholder="placeholder"
                            :value="modelValue"
                            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
                    </template>
                    <template v-else>
                        <textarea
                        :placeholder="placeholder"
                            :class="`rounded-lg block  input min-w-0 w-full h-32    input-sm focus:outline-none focus:ring-0 border-none ${inputStyle}`"
                            type="text"
                            :value="(modelValue as any)"
                            @input="$emit('update:modelValue', ($event.target  as HTMLInputElement).value)"></textarea>
                    </template>

                    <!-- <div v-if="settingButton" class="absolute bottom-1 right-1 btn btn-sm ">
                        <div class="dropdown dropdown-left dropdown-top   ">
                            <label tabindex="0" class="">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-3 h-3">
                                    <path
                                        d="M6 12a.75.75 0 01-.75-.75v-7.5a.75.75 0 111.5 0v7.5A.75.75 0 016 12zM18 12a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0118 12zM6.75 20.25v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0zM18.75 18.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0zM12.75 5.25v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0zM12 21a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0112 21zM3.75 15a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM12 11.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM15.75 15a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
                                </svg>
                            </label>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box ">
                                <li><a>扩写信息</a></li>
                                <li><a>重新生成</a></li>
                                <li><a>管理节点</a></li>
                            </ul>
                        </div>

                    </div> -->

                </div>

              <slot name="content"></slot>



            </div>





        </div>
    </div>
</template>


<script setup lang="ts">

 type inputType = 'input' | 'textarea';


defineProps({
    modelValue: {
        // required: true,
    },
    label: {
        type: String,
        default: '',
    },
    inputType: {
        type: String as PropType<inputType>,
        default: 'input',
    },
    settingButton: {
        type: Boolean,
        default: false,
    },
    placeholder:{
        type:String,
        default:''
    
    },
    inputStyle:{
        type: String  ,
        default:'',

    
    }

})

</script>

<style lang="scss" scoped></style>