-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'EXPIRED', 'CANCELLED', 'REQUIRES_MANUAL_REVIEW');
CREATE TYPE "IdempotencyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ServiceSlot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serviceDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "label" TEXT,
    "capacityTotal" INTEGER NOT NULL,
    "capacityConfirmed" INTEGER NOT NULL DEFAULT 0,
    "capacityHeld" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "ServiceSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceCode" TEXT NOT NULL,
    "slotId" UUID NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "guests" INTEGER NOT NULL,
    "notes" TEXT,
    "currency" TEXT NOT NULL,
    "pricePerPersonAmount" INTEGER NOT NULL,
    "depositBps" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "holdExpiresAt" TIMESTAMPTZ NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeCustomerEmail" TEXT,
    "paidAt" TIMESTAMPTZ,
    "confirmedAt" TIMESTAMPTZ,
    "cancelledAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "status" "IdempotencyStatus" NOT NULL,
    "responseBody" JSONB,
    "reservationId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "expiresAt" TIMESTAMPTZ,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "apiVersion" TEXT,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMPTZ,
    "reservationId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serviceDate" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "ServiceSlot_serviceDate_startTime_key" ON "ServiceSlot"("serviceDate", "startTime");
CREATE INDEX "ServiceSlot_serviceDate_idx" ON "ServiceSlot"("serviceDate");

CREATE UNIQUE INDEX "Reservation_referenceCode_key" ON "Reservation"("referenceCode");
CREATE UNIQUE INDEX "Reservation_stripeCheckoutSessionId_key" ON "Reservation"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "Reservation_stripePaymentIntentId_key" ON "Reservation"("stripePaymentIntentId");
CREATE INDEX "Reservation_slotId_status_idx" ON "Reservation"("slotId", "status");
CREATE INDEX "Reservation_holdExpiresAt_idx" ON "Reservation"("holdExpiresAt");

CREATE UNIQUE INDEX "IdempotencyKey_key_scope_key" ON "IdempotencyKey"("key", "scope");
CREATE INDEX "IdempotencyKey_reservationId_idx" ON "IdempotencyKey"("reservationId");

CREATE UNIQUE INDEX "StripeEvent_eventId_key" ON "StripeEvent"("eventId");
CREATE INDEX "StripeEvent_type_processedAt_idx" ON "StripeEvent"("type", "processedAt");

CREATE UNIQUE INDEX "WaitlistEntry_serviceDate_email_key" ON "WaitlistEntry"("serviceDate", "email");
CREATE INDEX "WaitlistEntry_serviceDate_idx" ON "WaitlistEntry"("serviceDate");
CREATE INDEX "WaitlistEntry_email_idx" ON "WaitlistEntry"("email");

-- Foreign keys
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ServiceSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StripeEvent" ADD CONSTRAINT "StripeEvent_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Check constraints (capacity + invariants)
ALTER TABLE "ServiceSlot"
  ADD CONSTRAINT "ServiceSlot_capacity_nonnegative"
  CHECK ("capacityTotal" >= 0 AND "capacityConfirmed" >= 0 AND "capacityHeld" >= 0);

ALTER TABLE "ServiceSlot"
  ADD CONSTRAINT "ServiceSlot_capacity_within_total"
  CHECK ("capacityConfirmed" + "capacityHeld" <= "capacityTotal");

ALTER TABLE "Reservation"
  ADD CONSTRAINT "Reservation_guests_positive"
  CHECK ("guests" > 0);

ALTER TABLE "Reservation"
  ADD CONSTRAINT "Reservation_depositBps_range"
  CHECK ("depositBps" >= 0 AND "depositBps" <= 10000);

