import { Npc, Prisma } from "@prisma/client"
import { prisma } from "~/utils/prisma"

export default defineEventHandler(async(event) => {
  
    const {npcid,fullname} = getQuery(event)
    if (!npcid) return new Response('npcid is required', { status: 400 });
 
    const npclist = await prisma.npc.findMany({
        where:{
            OR:[
                
               { relations:{
                    array_contains:[{
                        id: npcid as string
                    }]
                }},
                {family:{
                    array_contains:[{
                        id: npcid as string
                    }]
                }}
            ] 
        },
        select:{
            npc_profile:true,
            relations:true,
            family:true,
        }
    })


    let str = '';

    npclist.forEach((npc)=>{
       
        const npcp = npc.npc_profile as unknown as Npc_Profile

        console.log(npc.npc_profile)
        // console.log(npc.gender)
        const personsextra = npcp ? `:<性别：${npcp.gender}；年龄：${(npcp).age}；职业${(npcp).job}>`:``
       let  currentNpc = `${npcp.fullname}(${npcp.npc_id})${personsextra}`
    let fullrelation =  ([...npc.family  as RelationNode[] ,...npc.relations as RelationNode[] ]).map((relation)=>{
        return  relation.id==npcid ? `${relation.fullname}(${relation.id})是${currentNpc}的${relation.role}` :``
    }).join('\n')
    str+=fullrelation+'\n'
    })
    console.log(str)
    
    return str
})
