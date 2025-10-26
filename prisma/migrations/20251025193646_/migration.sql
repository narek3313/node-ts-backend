/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `PostMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostMedia_postId_key" ON "PostMedia"("postId");
