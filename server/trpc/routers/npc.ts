import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const NPCRouter = router({
  update: publicProcedure.input(z.any()).mutation(async ({ input, ctx }) => {
    const npcprofile = input as Npc_Profile;

    const allNodes = []
    
    const r =  ctx.prisma.node.upsert({
      where: {
        npc_id: npcprofile.npc_id,
      },
      create: {
        type: "person",
        npc: {
          create: {
            fullname: npcprofile.fullname,
            npc_id: npcprofile.npc_id!,
            family: npcprofile.family,
            relations: npcprofile.social_relations,
            npc_profile: {
              ...npcprofile,
              ...{ social_relations: undefined, family: undefined },
            },
          },
        },
      },
      update: {
        npc: {
          update: {
            fullname: npcprofile.fullname,
            family: npcprofile.family,
            relations: npcprofile.social_relations,
            npc_profile: {
              ...npcprofile,
              ...{ social_relations: undefined, family: undefined },
            },
          },
        },
      },
      include: {
        npc: true,
        memory: true,
      },
    });
    allNodes.push(r)
   console.log(npcprofile.family, npcprofile.social_relations)
    if (npcprofile.family || npcprofile.social_relations){
      [...npcprofile.family,...npcprofile.social_relations].forEach(async (familyMember) => {
        const t = ctx.prisma.node.upsert({
          where: {
            npc_id: familyMember.id,
          },
          create:{
            type:'person',
            npc:{
              create:{
                fullname:familyMember.fullname,
                npc_id:familyMember.id!,
              }
            },
          },
          update:{
          }
        })

        allNodes.push(t)
      })
    }

    const result= await prisma.$transaction(allNodes)

    return result;
  },
  ),
  delete: publicProcedure.query(async({ctx}) => {
     await ctx.prisma.node.deleteMany()
     await ctx.prisma.npc.deleteMany()
     return {

     }
  })
});
