
 type Memory = {
    bornAt: number,
    memories: {
        id?: string,
        npc_id?: string,
        age: number,
        ctx: string,
        emoji?: string
    }[],
}

type NPIC_Node = {
    type: 'person'|'item'|'area' |'story',
}

function isNpc  (node:NPIC_Node ) : node is Npc_Profile {
    return node.type =='person'
}

// NPC 基础信息
 type Npc_Profile = {
    npc_id:string | undefined,
    fullname:string,
    gender:string,
    age:number,
    job:string,
    MBTI:string,
    race: string,
    traits: Array<string>,
    family: Array<RelationNode>,
    social_relations:Array<RelationNode>,
    backstory: string,
    hidden_secret: string,
}  & NPIC_Node


type RelationNode = {
    id:string,
    fullname:string,
    role:string,
    affinity:number
}

