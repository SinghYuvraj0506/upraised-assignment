/*
  Warnings:

  - The `gadget_destruction_code` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "gadget_destruction_code",
ADD COLUMN     "gadget_destruction_code" INTEGER;
