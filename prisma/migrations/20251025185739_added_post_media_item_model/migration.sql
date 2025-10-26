/*
  Warnings:

  - You are about to drop the column `items` on the `PostMedia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostMedia" DROP COLUMN "items";

-- CreateTable
CREATE TABLE "PostMediaItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "postMediaId" TEXT NOT NULL,

    CONSTRAINT "PostMediaItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostMediaItem" ADD CONSTRAINT "PostMediaItem_postMediaId_fkey" FOREIGN KEY ("postMediaId") REFERENCES "PostMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
