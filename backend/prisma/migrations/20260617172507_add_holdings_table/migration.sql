-- CreateTable
CREATE TABLE "Holding" (
    "id" SERIAL NOT NULL,
    "stock_symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
