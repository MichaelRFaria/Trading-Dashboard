/*
  Warnings:

  - A unique constraint covering the columns `[user_id,stock_symbol]` on the table `Holding` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Holding_user_id_stock_symbol_key" ON "Holding"("user_id", "stock_symbol");
