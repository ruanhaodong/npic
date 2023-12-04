
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { ExampleRouter } from './example';
import { worldRuleRouter } from './world-rule';
import { NPCRouter } from './npc';
import { MemoryRouter } from './memory';


// export type definition of API


export const appRouter = router({
  example: ExampleRouter, // put procedures under "user" namespace
  worldRule:worldRuleRouter,
  npc:NPCRouter,
  memory:MemoryRouter
});
export type AppRouter = typeof appRouter

 
// You can then access the merged route with
// http://localhost:3000/trpc/<NAMESPACE>.<PROCEDURE>
 
 
 