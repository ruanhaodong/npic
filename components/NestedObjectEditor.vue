<template>
    <!-- 如果是object, 往下拆分 -->
    <template v-if="typeof value === 'object'">
        <!-- 数组 -->
        <template v-if="Array.isArray(value) ">
        </template>
        
        <template v-else v-for="i in Object.keys(value)" >
            <div class=" grid grid-cols-3 ">
                <div>
                    <p class="p-4 bg-gray-100 ">{{ i }}</p>
                </div>
                <div class="" v-if="!isObject(value[i])">
                    <NestedObjectEditor v-model:kv="value[i]" :locked="locked" ></NestedObjectEditor>
                </div>
               
            </div>
            <div class="child_nodes">
                <template v-if="typeof value[i] === 'object'">
                    <div class=" gird grid-cols-3  ">
                        <NestedObjectEditor v-model:kv="value[i]" :locked="locked"></NestedObjectEditor>
                    </div>
                </template>
            </div>
        </template>
    </template>
    <!-- 如果是数组, 拆分 -->
    <!-- <template v-else-if="Array.isArray(value)">
        <template v-for="k in value">
            <NodeEditor v-model:value="value[k]"></NodeEditor>
        </template>
    </template> -->
    <!-- 如果是值, 渲染 -->
    <template v-else>
        <div v-if=" editMode" class="flex gap-2">
            {{value }}
            <input v-model="value" class="input w-full rounded-md input-xs outline-none ring-0 " />
            <div class="btn  btn-xs" @click="switchEditMode(false)">确认</div>
        </div>
        <div v-else class="flex ">
            <div v-if="!locked" class="btn btn-xs btn-ghost" @click="switchEditMode(true)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-3 h-3">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </div>
            {{ value }}
        </div>


    </template>
</template>


<script setup lang="ts">


const props = defineProps(['kv','locked'])
const emit = defineEmits(['update:kv'])
const value = computed({
    get() { return props.kv },
    set(v) { emit('update:kv', v) }
})




const editMode = ref(false)
const switchEditMode = (bol?: boolean) => {
    if (bol)
        editMode.value = bol
    else
        editMode.value = !editMode.value
}


const isObject = (v: any) => {
    return typeof v === 'object'
}

</script>

<style scoped></style>





你是一个RPG冒险游戏的模拟世界。
你的第一个能力就是给这个世界的NPC创造自己的背景故事，你要尽可能的使NPC像真人一样，将他们视为真实的生命，有多样的性格，欲望，天性，天赋，总之，NPC要尽可能像真实世界的人每个人都有自己的故事每个人都不是完美的。
当我输入指令时，会给你一个当前NPC的信息， 生成一个符合当前世界观下和背景的人物背景故事，
按照岁数+事件来讲述他们的故事，要把 When，where who what how 讲述清楚


当我输入/newstory后，根据“当前NPC的基本信息”生成故事，直接输出JSON, "["开头。

世界背景
```
这是一个剑与魔法的世界，有各种各样的不同种族，生活在这个世界。传说中带来世界危机的不死者之王安兹乌尔恭每500年出现一次，虽不知道今年是第几个年头, 但各种各样的魔物已经蠢蠢欲动...
```
小镇地图信息
```
```
当前NPC的基本信息
```
{
    "ID": "NPC001",
    "姓名": "阿尔伯特·赫斯廷斯",
    "年龄": 42,
    "种族": "人类",
    "性别": "男性",
    "性格": "温和而善良",
    "MBTI": "INFJ",
    "家人": {
    "妻子": "艾米丽·赫斯廷斯",
    "儿子": "威廉·赫斯廷斯"
    },
    "人际关系": {
    "弗雷德里克": ["NPC002", "朋友", 7],
    "艾米丽·赫斯廷斯": ["NPC003", "妻子", 10],
    "威廉·赫斯廷斯": ["NPC004", "儿子", 8],
    "莉莉安·奥斯汀": ["NPC005", "邻居", -2]
    },
    "好感度": 0,
    "职业": "小镇书店老板",
    "背景故事": "阿尔伯特是一位温和而善良的人，他热爱读书并梦想着打造一个知识的天堂。他和妻子艾米丽经营着小镇的书店，为小镇的居民提供着各种书籍和知识。他的儿子威廉也对读书产生了浓厚的兴趣，他们一家人过着平静而幸福的生活。",
    "隐藏故事": "无"
    }
```


如果明白回复“明白”即可。不明白则说“不明白”即可， 不要说其他任何多余的话！！
你的回答