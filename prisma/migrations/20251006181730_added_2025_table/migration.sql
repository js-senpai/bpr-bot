-- CreateTable
CREATE TABLE "statistic_info_twenty_thousand_and_twenty_five" (
    "id" TEXT NOT NULL,
    "provider_number" INTEGER NOT NULL,
    "event_number" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scores" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "profession" TEXT NOT NULL,
    "provisorProfession" TEXT,
    "juniorProfession" TEXT,
    "seniorProfession" TEXT,
    "regLink" TEXT NOT NULL,
    "providerLink" TEXT NOT NULL,
    "providerMaintainer" TEXT NOT NULL,
    "providerMaintainerPhone" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_info_twenty_thousand_and_twenty_five_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistic_info_twenty_thousand_and_twenty_five_event_number_key" ON "statistic_info_twenty_thousand_and_twenty_five"("event_number");

-- CreateIndex
CREATE INDEX "statistic_info_twenty_thousand_and_twenty_five_event_number_idx" ON "statistic_info_twenty_thousand_and_twenty_five"("event_number");
