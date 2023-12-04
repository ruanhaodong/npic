import { Prisma } from "@prisma/client"
import { prisma } from "~/utils/prisma"



export default defineEventHandler(async(event) => {
  
    const npclist = await prisma.node.findMany({
        include:{
            npc:true,
            memory:true,
        }
    })
    return npclist
})
