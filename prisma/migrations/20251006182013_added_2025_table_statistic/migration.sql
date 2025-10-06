-- CreateTable
CREATE TABLE "statistic_twenty_thousand_and_twenty_five" (
    "id" TEXT NOT NULL,
    "provider_number" INTEGER NOT NULL,
    "event_number" INTEGER NOT NULL,
    "cert_number" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "scores" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_twenty_thousand_and_twenty_five_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistic_twenty_thousand_and_twenty_five_cert_number_key" ON "statistic_twenty_thousand_and_twenty_five"("cert_number");

-- CreateIndex
CREATE INDEX "statistic_twenty_thousand_and_twenty_five_fullName_cert_num_idx" ON "statistic_twenty_thousand_and_twenty_five"("fullName", "cert_number");
