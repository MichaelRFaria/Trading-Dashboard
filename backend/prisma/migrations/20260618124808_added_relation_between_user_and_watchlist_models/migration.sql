/*
  Warnings:

  - A unique constraint covering the columns `[user_id,stock_symbol]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_user_id_stock_symbol_key" ON "Watchlist"("user_id", "stock_symbol");
