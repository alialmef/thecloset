-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('TOP', 'BOTTOM', 'OUTERWEAR', 'SHOES', 'ACCESSORY', 'BAG');

-- CreateEnum
CREATE TYPE "ItemSeason" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON');

-- CreateEnum
CREATE TYPE "ItemOccasion" AS ENUM ('CASUAL', 'FORMAL', 'ATHLETIC', 'GOING_OUT');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'LENT', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "ItemVisibility" AS ENUM ('ALL_GROUPS', 'SPECIFIC_GROUPS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BorrowRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'ACTIVE', 'RETURNED');

-- CreateEnum
CREATE TYPE "PickupMethod" AS ENUM ('IN_PERSON', 'DELIVERY');

-- CreateEnum
CREATE TYPE "DeliveryProvider" AS ENUM ('UBER', 'DOORDASH');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invite_code" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "max_members" INTEGER NOT NULL DEFAULT 20,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_memberships" (
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "color" TEXT NOT NULL,
    "brand" TEXT,
    "season" "ItemSeason" NOT NULL,
    "occasion" "ItemOccasion" NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "visibility" "ItemVisibility" NOT NULL DEFAULT 'ALL_GROUPS',
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_group_visibility" (
    "item_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "item_group_visibility_pkey" PRIMARY KEY ("item_id","group_id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "styled_for" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_items" (
    "outfit_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "outfit_items_pkey" PRIMARY KEY ("outfit_id","item_id")
);

-- CreateTable
CREATE TABLE "borrow_requests" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "borrower_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "status" "BorrowRequestStatus" NOT NULL DEFAULT 'PENDING',
    "pickup_method" "PickupMethod" NOT NULL DEFAULT 'IN_PERSON',
    "borrow_duration_days" INTEGER NOT NULL DEFAULT 7,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),

    CONSTRAINT "borrow_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "borrow_request_id" TEXT NOT NULL,
    "provider" "DeliveryProvider" NOT NULL,
    "tracking_url" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "fee_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "groups_invite_code_key" ON "groups"("invite_code");

-- CreateIndex
CREATE INDEX "items_owner_id_idx" ON "items"("owner_id");

-- CreateIndex
CREATE INDEX "items_category_idx" ON "items"("category");

-- CreateIndex
CREATE INDEX "items_status_idx" ON "items"("status");

-- CreateIndex
CREATE INDEX "outfits_created_by_idx" ON "outfits"("created_by");

-- CreateIndex
CREATE INDEX "outfits_styled_for_idx" ON "outfits"("styled_for");

-- CreateIndex
CREATE INDEX "borrow_requests_borrower_id_idx" ON "borrow_requests"("borrower_id");

-- CreateIndex
CREATE INDEX "borrow_requests_owner_id_idx" ON "borrow_requests"("owner_id");

-- CreateIndex
CREATE INDEX "borrow_requests_item_id_idx" ON "borrow_requests"("item_id");

-- CreateIndex
CREATE INDEX "borrow_requests_status_idx" ON "borrow_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_borrow_request_id_key" ON "deliveries"("borrow_request_id");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_group_visibility" ADD CONSTRAINT "item_group_visibility_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_group_visibility" ADD CONSTRAINT "item_group_visibility_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_styled_for_fkey" FOREIGN KEY ("styled_for") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_borrow_request_id_fkey" FOREIGN KEY ("borrow_request_id") REFERENCES "borrow_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
