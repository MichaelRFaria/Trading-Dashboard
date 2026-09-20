/*
  Warnings:

  - You are about to alter the column `quantity` on the `Holding` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.

*/
-- AlterTable
ALTER TABLE "Holding" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(20,8);
