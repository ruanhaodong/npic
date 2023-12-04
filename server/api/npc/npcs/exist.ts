import { Prisma } from "@prisma/client"
import { prisma } from "~/utils/prisma"



export default defineEventHandler(async(event) => {
  
    const {npcid} = getQuery(event)
    const npclist = await prisma.npc.findMany({
       where:{
        npc_id:{
            not:npcid as string
        }
       }
    })
    
    const s = npclist.map((npc)=>npc.fullname).join(',')
    console.log('排除人物',s)
    return s
})
