/*
  Warnings:

  - Added the required column `user_id` to the `gadget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gadget" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "gadget" ADD CONSTRAINT "gadget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
