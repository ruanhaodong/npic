export default defineEventHandler(async (event) => {
    prisma.node.deleteMany({}).then(console.log)
    prisma.map.deleteMany({}).then(console.log)
    prisma.memory.deleteMany({}).then(console.log)
    prisma.npc.deleteMany({}).then(console.log)
    prisma.worldRule.deleteMany({}).then(console.log)
  
    
})
