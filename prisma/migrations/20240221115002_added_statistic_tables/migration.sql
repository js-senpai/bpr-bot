-- CreateTable
CREATE TABLE "statistic_twenty_thousand_and_twenty_two" (
    "id" TEXT NOT NULL,
    "provider_number" INTEGER NOT NULL,
    "event_number" INTEGER NOT NULL,
    "cert_number" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "scores" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_twenty_thousand_and_twenty_two_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistic_twenty_thousand_and_twenty_three" (
    "id" TEXT NOT NULL,
    "provider_number" INTEGER NOT NULL,
    "event_number" INTEGER NOT NULL,
    "cert_number" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "scores" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_twenty_thousand_and_twenty_three_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistic_twenty_thousand_and_twenty_four" (
    "id" TEXT NOT NULL,
    "provider_number" INTEGER NOT NULL,
    "event_number" INTEGER NOT NULL,
    "cert_number" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "scores" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_twenty_thousand_and_twenty_four_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistic_twenty_thousand_and_twenty_two_cert_number_key" ON "statistic_twenty_thousand_and_twenty_two"("cert_number");

-- CreateIndex
CREATE INDEX "statistic_twenty_thousand_and_twenty_two_fullName_cert_numb_idx" ON "statistic_twenty_thousand_and_twenty_two"("fullName", "cert_number");

-- CreateIndex
CREATE UNIQUE INDEX "statistic_twenty_thousand_and_twenty_three_cert_number_key" ON "statistic_twenty_thousand_and_twenty_three"("cert_number");

-- CreateIndex
CREATE INDEX "statistic_twenty_thousand_and_twenty_three_fullName_cert_nu_idx" ON "statistic_twenty_thousand_and_twenty_three"("fullName", "cert_number");

-- CreateIndex
CREATE UNIQUE INDEX "statistic_twenty_thousand_and_twenty_four_cert_number_key" ON "statistic_twenty_thousand_and_twenty_four"("cert_number");

-- CreateIndex
CREATE INDEX "statistic_twenty_thousand_and_twenty_four_fullName_cert_num_idx" ON "statistic_twenty_thousand_and_twenty_four"("fullName", "cert_number");
