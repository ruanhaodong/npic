import { Npc } from "@prisma/client";
import { ChatCompletionRequestMessage, Configuration } from "openai";
import { defineStore } from "pinia";




// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useAlertsStore = defineStore("prompt", {
  // other options...
});



export type newBackgroundCallBack = {
    story: string,
    areas: [
      {
        name: string,
        description: string
      }
    ]
  }


type newNpcPromptParamsType = {
  preset_id?: string;
  preset_fullname?: string;
  base_rule?: string;
  npc_extra_info?: string;
  npcs?: string;
  existedNpc?:string;
  area_data?: string;
};

export const NewNpcPrompt = (
  params: newNpcPromptParamsType
): ChatCompletionRequestMessage[] => {
  const prompt = [
    {
      role: "system",
      content: `你是一个世界模拟系统，你可以模拟这个世界下的任何人，任何事物，也能掌管这个世界的时间演变。
          你有两个能力：生成和完善
          你的第一个能力（生成）就是创造这个世界的人物（NPC），你要尽可能的使NPC像真人一样，NPC有自己的故事，使命和目的。
          NPC生活在当下的世界背景，需要生成符合<世界背景>下的人。根据关联人物社会关系，随机生成新的NPC。生成NPC按照以下规则：
          生成信息包含：ID、全名（生成名字时，需要写姓氏和名字，为了区分同名指代）年龄、种族（如果这个世界背景是有多种族）、性别、 特质（癖好，优点，缺点，天赋, 欲望有哪些）、MBTI（MBTI决定了NPC如何对他人进行反应，做事的习惯和风格 ）、社会人际关系：（分为“家庭成员关系”和“他人的关系”，生成若干数量，需要id、全名、 关系身份、好感度(-10到10， 0为陌生人)、职业、背景故事（两三句话描述NPC的故事：背景故事通常包括角色的成长经历、重要事件、家族背景、目标和动机等方面的信息。通过背景故事，玩家能够更好地理解角色的动机、性格和行为，为角色赋予更多的深度和情感，背景故事可能平淡可能传奇.）
          如果NPC有不为人知的秘密，可以增加一个<隐藏故事>属性。
          输出结果按照<JSON定义>内的定义输出对应JSON，不要有其他废话.
          <JSON定义>
          npc: {
              npc_id:string,
              fullname:string,
              gender:string,
              age:number,
              job:string,
              MBTI:string,
              race: string,
              traits: string,
              backstory: string,
              hidden_secret: string,
              family: Array<{id:string,fullname:string,role:string(to the npc),affinity:number}>,
              social_relations:Array<{id:string,fullname:string,role:string,affinity:number}>,
          } 
          </JSON定义>
          
          
          故事背景:
          <${params.base_rule ?? ""}>
          
          
          
          现有地图信息:
          <${params.area_data ?? ""}>
          
          
          
          现有人物关系:
          <${params.npcs ?? ""}>
          
          
          
          以下人物已存在不要重复生成:
          <${params.existedNpc}>
          
          其他注意事项：
          1.所有涉及到的人物名字都要用全名，生成的人物要根据故事背景生成, 关系遵循现有的人物关系,不要重复生成人物。
          2.所有的人物id都用npc+数字的格式表示。
          3.JSON定义中所有string字段都要生成，不要留空，如果没有则写无。
          4.每人至少有5个人际关系，至少一个家庭成员。请确认每个人的关系。
          4.必须用中文回复！如果发现不用中文回复，马上矫正至中文。
          5.必须用JSON回复，不要有其他废话! 当我输入(newnpc) 后，直接输出JSON, "{npc": "开头。
          如果明白回复“明白”即可。不明白则说“不明白”即可， 不要说其他任何多余的话！！
          你的回答：`,
    },
    {
      role: "assistant",
      content: "明白",
    },
    {
      role: "user",
      content: `(newnpc)   ${
        params.npc_extra_info != undefined ? params.npc_extra_info : ""
      } 
      ${params.preset_id ?? ""} ${params.preset_fullname ?? ""}`,
    },
  ];
  return prompt as ChatCompletionRequestMessage[];
};

export const NewBackgroundPrompt = ({
  extra_Prompt,
}: {
  extra_Prompt?: string;
}): ChatCompletionRequestMessage[] => {
  return [
    {
      role: "system",
      content: `
    你是一个游戏策划师，看过大量的英雄史诗的书籍，专门根根据用户的提示以及主题，撰写游戏的世界观和背景故事，
    游戏世界背景故事包括
    1. 世界的起源
    2. 当前世界处于的时间段（当今，过去，未来，架空世界）
    3. 世界的地理环境（国家、城市）
    4. 政治经济社会形态，以及社会力量（种族，阶级、晋升制度）
    5. 当前世界面临的大机遇或者大灾难。

    只回答我有关故事的需求，根据上述描述，生成story，根据story生成故事里出现的areas。
    
    按照三个引号内的格式回复给我一个json，其余不要多说
    '''
    {
      "story": "世界背景故事（400字以内）",
      "areas": [
        {
          "name": "区域名称",
          "description": "区域描述（60字以内）"
        }
      ]
    }
    '''
    `,
    },
    {
      role: "user",
      content: `生成一个完整的冒险故事背景: ${extra_Prompt ?? ""}`,
    },
  ];
};

export type NPCStoryPromptParams = {
  generate_npc: Npc_Profile;
} & newNpcPromptParamsType;

export const NewNpCStoryPrompt = (
  params: NPCStoryPromptParams
): ChatCompletionRequestMessage[] => {
  const generateUsers = NewNpcPrompt(params);

  const message: ChatCompletionRequestMessage[] = [
    ...generateUsers,
    {
      role: "assistant",
      content: JSON.stringify({ npc: params.generate_npc }),
    },
    {
      role: "user",
      content: `你现在模拟${params.generate_npc.fullname}，生成他从出生到${params.generate_npc.age}岁的主要人生记忆。
      记忆可以包含世界背景事件，自我觉醒时刻，小时候的成长环境，重要的事件，杰出的成就，如果是历史人物多参考一些史实重大事件，根据人物特质、性格、背景故事扩写(ctx)，以第三人称为主体。
      1. 首先给出任务出生的年份。
      2. 按照两部分写记忆： 第一步【提纲】draft_memories：列出大纲，每五年一条，不用太多字。
      3. 第二步【润色加扩写】standard_memories:首先根据大纲扩写第一步的每条记忆，并在中间穿插几条其他事迹，一共生成10条详细记忆。
      4. 记忆必须包含三个key: 年龄age、事件详情ctx 和表情emoji(每个记忆都用1-2个emoji代表这个事件).
    
<生成记忆的JSON定义>
{
bornAt:number,
draft_memories:{
age:number,
ctx:string,
emoji:string
},
standard_memories:{
age:number,
ctx:string,
emoji:string
}
</JSON定义>
`,
    },
  ];

  return message;
}


export const NewChatPrompt = ({
  extra_Prompt,
}: {
  extra_Prompt?: string;
}): ChatCompletionRequestMessage[] => {
  return [
    { role: "system", content: `
      '''
      ${extra_Prompt}
      '''
      三个引号里是你的个人信息，
      你就是这个人，请代入这个角色，请用这个身份与我聊天，
      例如个人信息里的姓名是刘备，那么你就是刘备，你将以刘备的第一人称和我聊天，我是一个普通人，我在和刘备聊天。

      说话自然一点，不要像个机器人，你的语气和行为要按照个人信息里的性格、特质等。你就感觉你是真正的这个人。

      聊天的时候注意以下规则，
      1. 如果聊天内容和你的职业背景相差太远，你就说你不清楚，想办法转移到你擅长的领域。
      2. 不用每次问我需要什么帮忙，就是单纯的跟我聊天。
      3. 如果你是一个古人，你就应该用文言文。如果你是个爱撒娇的女生，你就应该像个小孩子一样。
      以此类推，你明白了吗，不要再让我重复跟你说，
    ` },
    {
      role: "assistant",
      content: `明白了`,
    },
    {
      role: "assistant",
      content: `你好`,
    },
  ];
};
