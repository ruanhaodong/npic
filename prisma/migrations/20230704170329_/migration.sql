-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('person', 'item', 'area', 'story');

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "npc_id" TEXT,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Npc" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "npc_id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "npc_profile" JSONB,
    "family" JSONB,
    "relations" JSONB,

    CONSTRAINT "Npc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorldRule" (
    "id" TEXT NOT NULL,
    "rule" TEXT[],

    CONSTRAINT "WorldRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_npc_id_key" ON "Node"("npc_id");

-- CreateIndex
CREATE UNIQUE INDEX "Npc_npc_id_key" ON "Npc"("npc_id");

-- CreateIndex
CREATE INDEX "Npc_npc_id_idx" ON "Npc"("npc_id");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_npc_id_fkey" FOREIGN KEY ("npc_id") REFERENCES "Npc"("npc_id") ON DELETE SET NULL ON UPDATE CASCADE;
