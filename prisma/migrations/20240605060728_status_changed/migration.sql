/*
  Warnings:

  - You are about to drop the column `status` on the `requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
