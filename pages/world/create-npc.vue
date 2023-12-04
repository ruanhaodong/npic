<template>

  <div class="space-y-6   ">
    <!-- <div class="flex overflow-x-scroll gap-6 border border-neutral p-4">
      <div class="btn  btn-sm"> 创建NPC</div>
      <div class="btn  btn-sm"> 查看所有NPC</div>
      <div class="btn bg btn-sm"> NPC Prompt Builder</div>
    </div> -->

    <div class="">

    </div>
    <div id="create" class="p-4 flex flex-wrap gap-6  ">
      <!-- <h1 class="text-lg font-bold w-full "> NPC </h1> -->
      <div class="w-full grid grid-cols-2  ">
        <div class="gap-3 flex ">
          <div class="avatar w-20 h-20 bg-gray-300 rounded-md"></div>
          <div class="flex flex-col justify-center ">
            <div class="font-bold text-lg">Monster </div>
            <div class="">ID:
              <span class="">001</span>
            </div>

            <!-- <p class="btn btn-sm">修改</p> -->
          </div>


        </div>
        <div class="flex items-center justify-end">
          <div class="btn btn-sm btn-primary " @click="call">保存NPC</div>
        </div>
      </div>

      <section class="w-full">
        <div class="title m-2 font-bold"> 自动生成</div>
        <div class="flex w-full gap-3 flex-wrap">
        <textarea v-model="desc" type="number" class=" w-full textarea input-primary focus:outline-none "
          placeholder="描述背景故事,可以加入你想要的故事，人物道具等信息"></textarea>
        <div v-if="loading" class="btn btn-sm btn-disabled flex-1">
          生成中...
        </div>
        <div v-else class="btn btn-sm btn-primary flex-1" @click="fetch">
          自动生成npc</div>
        <div class="btn btn-sm  " @click="abort">终止</div>
      </div>
      </section>
   
      <div class="w-full">
      </div>
    </div>
    <div class="w-full ">
      <div class="  h-96 overflow-scroll p-2 border">
        <NodeEditor v-if="loading" v-model:kv="streamingJSON" :locked="loading"></NodeEditor>
        <NodeEditor v-else v-model:kv="editableJSON" :locked="loading"></NodeEditor>
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">


import { PageMeta } from "nuxt/app";
import untruncateJson from "untruncate-json";
import { FunctionCallRequest } from '~/utils/ai';

definePageMeta({
  layout:'npc-nav'
})



const name = ref('')
const desc = ref('')

const editableJSON = ref({}); 

const editJSON = ref({ "step1": { "ID": "NPC001123213asdasd", "姓名": "Alice Smith", "年龄": 25, "种族": "人类", "性别": "女", "性格": "开朗活泼", "MBTI": "ESFP", "家人": { "兄弟": "Bob Smith" }, "人际关系": { "Bob Smith": ["NPC002", "兄弟", 6], "Charlie Wood": ["NPC003", "好友", 3], "David Johnson": ["NPC004", "邻居", 1] }, "职业": "酒馆女招待121231", "背景故事": "Alice是小镇的酒馆女招待，她善于与人交流，总是能给陌生人带来快乐和温暖。她有一个兄弟Bob，他们经常一起玩耍和探险。", "隐藏故事": "无qweqwe" }, "step2": { "记忆": { "5岁": "Alice第一次上学，结识了一群好朋友。", "10岁": "Alice和兄弟Bob在森林里发现了一只可爱的小动物，他们将它带回家并一起照顾。", "15岁": "Alice参加了一场音乐比赛，她用自己的歌声和琴技赢得了第一名。", "20岁": "Alice遇到了一位旅行者，他讲述了很多神奇的冒险故事，激发了Alice对冒险的向往。", "25岁": "Alice决定离开小镇，去寻找自己的冒险之旅，并在小镇的酒馆找到了一份工作。" } }, "step3": { "记忆": { "5岁": "Alice和她的朋友们qqwe一起上学，最喜欢的科目是数学。", "8岁": "Alice生日时，她111收到了一本神奇的魔法书，从此对魔法产生了浓厚的兴趣。", "12岁": "Alice冒险进入了名为黑暗森林的危险地区，她与兄弟一同勇敢地面对了那里的魔物。", "15岁": "Alice加入了乐团，成为一名优秀的吉他手，并参加了许多音乐比赛。", "18岁": "Alice在小镇酒馆找到了一份工作，她喜欢在那里结识各种各样的旅行者和冒险家，听他们讲述自己的故事。", "22岁": "Alice在山洞里遇到了一位受伤的旅行者，她勇敢地帮助他并将他带回小镇寻找医治。", "25岁": "Alice离开小镇去寻找属于自己的冒险旅程，她希望在远方的世界中发现更多的故事和神奇。" } } })
const messagePrompt = computed(() => {
  return [
    {
      role: 'system',
      content: `你是一个RPG冒险游戏世界模拟系统，你可以模拟这个世界下的任何人，任何事物，也能掌管这个世界的时间演变。
你有两个能力：生成和完善
你的第一个能力（生成）就是创造这个世界的NPC，你要尽可能的使NPC像真人一样，NPC有自己的成长故事，使命和目的。
当我输入 (newnpc) 指令时， 生成一个符合条件的人物，要根据当前世界背景生成。你可以生成和小镇现有人物有关系的人，也可以随机生成新的人。生成NPC按照以下3个步骤来生成：

步骤1，生成NPC的基本信息，包含：ID、姓名（生成名字时，需要写姓氏和名字，为了区分同名指代）年龄、种族（如果这个世界背景是有多种族）、性别、  性格（将他们视为真实的生命，有多样的性格，欲望，优点，缺点，天性，天赋, 每个人都不是完美的）、MBTI（MBTI决定了NPC如何对他人进行反应，做事的习惯和风格 ）、家庭关系（家庭成员，格式为数组{id,完整的名字,角色 } ）、社会人际关系：（与他人的关系，格式为数组{id，完整的名字,角色/身份,好感度(-10到10， 0为陌生人)} ）；职业、背景故事（两三句话描述NPC的故事：背景故事通常包括角色的成长经历、重要事件、家族背景、目标和动机等方面的信息。通过背景故事，玩家能够更好地理解角色的动机、性格和行为，为角色赋予更多的深度和情感，背景故事可能平淡可能传奇.）
如果有不为人知的设定（秘密），可以增加一个<隐藏故事>属性，并不是每个人都有秘密，没有则写无。 

步骤2，生成NPC的人生记忆，记忆需要符合他的背景故事扩写每条包含年龄，输出数组，从5岁开始，每年2-5年条，每条包含年龄。  格式为draft_memory:Array<{age:number, event:string}>。

步骤3， 在步骤2基础上完善:  
1. 先检查年龄之间和现有的家庭，人际关系是否有逻辑漏洞，有则修改。 
2. 深入写每条记忆，尽量将When ，Where， What，who，how表述清楚。记忆中某些人/事/物要写出具体的名字，你可以创建独特的关键词：比如看书看的是什么书，冒险山洞名字是什么， 见义勇为具体是什么事等等。
3. 如两条记忆之间年份差距较大就在中间补充几条新的记忆。
格式为detailed_momory:Array<{age:number, event:string}> 。
你的回答要包含上面的3个步骤输出。输出格式为JSON，如下： 
>>-----------------------
 {
  person:{
    "id": string,
    "name": string,
    "age": number,
    "race": string,
    "gender": enum['male','female','unknown'],
    "traits": Array<string>,
    "MBTI": string,
    "family": Array<{id:string, fullname:string, role:string}>,
    "social_relations":Array<{
        id:string,
        name:string,
        role:string,
        affinity:number
      }> 
   ,
    "job": string,
    "backstory": string,
    "hidden_secret": string,
  },
draft_memory:Array<{age:number, event:string}>,
detailed_momory:Array<{age:number, event:string}>
}
<<------------------------------
 

世界背景
<这是一个剑与魔法的世界，有各种各样的不同种族，生活在这个世界。传说中带来世界危机的不死者之王安兹乌尔恭每500年出现一次，虽不知道今年是第几个年头, 但各种各样的魔物已经蠢蠢欲动...>
小镇地图信息
<>
小镇已有人物
<>
其他注意事项：
1. 所有涉及到的人物名字都要用全名，防止指代模糊，且都用欧式冒险风格的名字。
2.所有的人物只有一个id。id都已npc+数字的格式。
3.生成的人物信息内容需要是中文。
4.必须按照3个步骤执行。

当我输入(newnpc) 后，直接输出JSON, "{"开头。


如果明白回复“明白”即可。不明白则说“不明白”即可， 不要说其他任何多余的话！！
你的回答`
    },
    {
      role: 'assistant',
      content: '明白'
    },
    {
      role: 'user',
      content: (name.value || desc.value) ? `请生成一个NPC, 
      ${name.value ? '名字:' + name.value : ''} 
      ${desc.value ? '其他设定：' + desc.value : ''} (newnpc) ` : `(newnpc)`
    }
  ]
})

const { abort, fetch, value, loading, event } = useReadStream({ messages: messagePrompt })

event.on('onDone', (str) => {
  editableJSON.value = JSON.parse(untruncateJson(str))
})


const streamingJSON = computed(() => {
  return value.value ? JSON.parse(untruncateJson(value.value)) : {}
})






const call = async ()=>{
 const a  = await  $fetch('/api/openai',{
    method:'POST',
    body:JSON.stringify({
      messages:messagePrompt.value,
      function_call:JSON.stringify(npcf)
    })
  })
}

</script>

<style scoped></style>







