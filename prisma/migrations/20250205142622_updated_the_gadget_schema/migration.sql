/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ACCOUNT_PROVIDER" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "GADGET_STATUS" AS ENUM ('AVAILABLE', 'DEPLOYED', 'DESTROYED', 'DECOMMISSIONED');

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "provider" "ACCOUNT_PROVIDER" NOT NULL,
    "refreshToken" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gadget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "success_probability" INTEGER NOT NULL,
    "status" "GADGET_STATUS" NOT NULL DEFAULT 'AVAILABLE',
    "decommissioned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gadget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gadget_name_key" ON "gadget"("name");
