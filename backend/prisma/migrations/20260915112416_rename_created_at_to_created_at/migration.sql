/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Trade` table. All the data in the column will be lost.

  note: this is manually modified to rename column instead of drop column
*/
-- AlterTable
ALTER TABLE "Trade" RENAME COLUMN "createdAt" TO "created_at";
