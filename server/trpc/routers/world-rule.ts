import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const worldRuleRouter = router({
  update: publicProcedure
    .input(
      z.object({
        background_story: z.string().optional(),
        map: z.object({ 
          areas: z.any(),
          id:z.string(),
          background_id:z.string(),
          jsonData:z.any(),
        } ).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.worldRule.upsert({
        where: {
          id: "main",
        },
        create: {
          id: "main",
          background_story: input.background_story || undefined,
          map: input.map ? {
            connectOrCreate:{
              where:{
                id:input.map?.id
              },
              create:{
              areas: input.map?.areas || undefined,
              background_id: input.map?.background_id || undefined,
              id: input.map?.id || undefined,
              jsonData: input.map?.jsonData || undefined,
              }
            }
          }:undefined
        },
        update: {
          background_story: input.background_story || undefined,
          map: input.map ?{
            upsert:{
              where:{
                id:input.map?.id
              },
              create:{
                areas: input.map?.areas || undefined,
                background_id: input.map?.background_id || undefined,
                id: input.map?.id || undefined,
                jsonData: input.map?.jsonData || undefined,
              },
              update:{
                areas: input.map?.areas || undefined,
                background_id: input.map?.background_id || undefined,
                jsonData: input.map?.jsonData || undefined,
              }
            }
          }:undefined
        },
        include:{
          map:true
        }
      });
      return result;
    }),
  get: publicProcedure.query(async () => {
    const result = await prisma.worldRule.findUnique({
      where: {
        id: "main",
      },
      include:{
        map:true
      }
    });

    return result
  }),
});
