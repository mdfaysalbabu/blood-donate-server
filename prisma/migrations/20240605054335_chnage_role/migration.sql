-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'donor');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'deactive');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isDonateBlood" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'donor';
