export default defineEventHandler(async (event) => {

    return await prisma.npc.findUnique({
        where:{
            npc_id: event.context.params?.id
        }
    })
})
