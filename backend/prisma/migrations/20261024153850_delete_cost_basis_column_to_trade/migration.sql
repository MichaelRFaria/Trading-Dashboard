/*
  Warnings:

  - You are about to drop the column `cost_basis_per_share` on the `Trade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "cost_basis_per_share";
