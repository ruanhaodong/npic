import { CreateChatCompletionRequestFunctionCall } from "openai"

export type FunctionCallRequest = {
    description: string;
    parameters: ParamSchema;
} & CreateChatCompletionRequestFunctionCall

type BasicType = 'string' | 'number' | 'boolean' | 'array' ;

interface BasicParamSchema {
    type: BasicType;
    description?: string;
    enum?: string[];
}
interface ObjectParamSchema {
    type: 'object' | 'array';
    properties?: {
        [key: string]: ParamSchema;
    };
    required?: string[];
    description?: string;
}
type ParamSchema = BasicParamSchema | ObjectParamSchema;





type MemoryTag =  
'shallow_memory' //浅层记忆  
| 'deep_memory'  //深层记忆
| 'background'   //背景记忆
| 'relationship' //人际关系



// 记忆来源
type MemorySource = 
| 'see'  //看见
| 'smell' //闻到
| 'hear'  //听见
| 'say'  //说
| 'touch' // 摸到
| 'think' // 思考
| 'action'  // 行为


export type Memory = {
    id:string,
    time:number,
    content:string,
    memory_source:MemorySource,
    memory_tag:MemoryTag
    retrieval_times:number
}