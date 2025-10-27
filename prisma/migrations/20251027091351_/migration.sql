/*
  Warnings:

  - The `status` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostStatusEnum" AS ENUM ('Draft', 'Published', 'Archived', 'Deleted');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "status",
ADD COLUMN     "status" "PostStatusEnum" NOT NULL DEFAULT 'Draft';
