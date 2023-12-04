import { z } from "zod";
import { publicProcedure, router } from "../trpc";

type Input = {
  npc_timeline: boolean;
  data: Memory;
};

export const MemoryRouter = router({
  updateBranch: publicProcedure
    .input({
      parse(input) {
        return input as Input;
      },
    })
    .mutation(async ({ input, ctx }) => {
      if (!input.npc_timeline)
        return {
          error: "npc_timeline is not set",
        };
      const bornAt = input.data.bornAt;

      const branchMemory = input.data.memories.map((m) => {
        return {
          npc_id: m.npc_id,
          memory_id: m.id,
          ctx: m.ctx,
          age: m.age,
          emoji: m.emoji,
        };
      });
      const ts: any[] = [];
      branchMemory.forEach((mems) => {
        if (mems.memory_id) {
          const t = ctx.prisma.memory.update({
            where: {
              id: mems.memory_id,
            },
            data: {
              age: mems.age,
              ctx: mems.ctx,
              emoji: mems.emoji,
              bornAt:bornAt
            },
          });
          ts.push(t);
        } else {
          const t = ctx.prisma.memory.create({
            data: {
              npc_id: mems.npc_id,
              age: mems.age,
              ctx: mems.ctx,
              emoji: mems.emoji,
              bornAt:bornAt,
              Node: {
                create: {
                  type: "story",
                },
              },
            },
          });
          ts.push(t);
        }
      });

      return await ctx.prisma.$transaction(ts);
    })
    ,
    get:publicProcedure.input(
      z.object({
        npc_id: z.string().optional()
      }
      )
    ).
  
    query(({input,ctx})=>{
      
        return ctx.prisma.memory.findMany({
          where:{
            npc_id:input.npc_id 
          },
          orderBy:{
            age:'asc'
          },
        })
      
    }),
    deleteAll:publicProcedure.input(
      z.object({
        npc_id: z.string().optional()
      }
      )
    ).mutation(({input,ctx})=>{
      if (input.npc_id){

       ctx.prisma.node.deleteMany({
          where:{
            type:'story'
          }
        }).then()
        return ctx.prisma.memory.deleteMany({
          where:{
            npc_id:input.npc_id,
          }
        })
      }
    })
});
