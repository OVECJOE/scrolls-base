-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" VARCHAR(512),
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false;
