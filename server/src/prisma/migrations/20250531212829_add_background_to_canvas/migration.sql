/*
  Warnings:

  - You are about to drop the column `backgroundImage` on the `Canvas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Canvas" DROP COLUMN "backgroundImage",
ADD COLUMN     "background" TEXT;
