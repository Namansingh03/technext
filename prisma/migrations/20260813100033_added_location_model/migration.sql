-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" CHAR(2) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "label" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_countryCode_idx" ON "location"("countryCode");

-- CreateIndex
CREATE INDEX "location_lat_lng_idx" ON "location"("lat", "lng");

-- CreateIndex
CREATE UNIQUE INDEX "location_city_state_country_key" ON "location"("city", "state", "country");
