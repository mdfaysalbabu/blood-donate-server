/*
  Warnings:

  - You are about to drop the column `isDonateBlood` on the `requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "isDonateBlood";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isDonateBlood" BOOLEAN NOT NULL DEFAULT true;
