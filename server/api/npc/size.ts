import { prisma } from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  const npcIds = await prisma.node.findMany({
    where: {
      type: "person",
    },
    take: 50,
    orderBy: {
      npc_id: "desc",
    },
  });
  console.log(npcIds);
  const sortedIds = npcIds
    .map((id) => {
      const idstr = id.npc_id?.split("npc")[1];

      if (idstr) {
        return parseInt(idstr);
      } else return 0;
    })
    .sort((a, b) => b - a);
  console.log(sortedIds);

  return Math.max(...sortedIds) + 1;
});
