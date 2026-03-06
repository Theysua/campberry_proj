/*
  Warnings:

  - The primary key for the `deadlines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `list_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `program_interests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `programs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `type` column on the `programs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `experts_choice_rating` column on the `programs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `impact_rating` column on the `programs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `providers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `location_type` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_saved_programs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "deadlines" DROP CONSTRAINT "deadlines_program_id_fkey";

-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_list_id_fkey";

-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_program_id_fkey";

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_author_id_fkey";

-- DropForeignKey
ALTER TABLE "program_interests" DROP CONSTRAINT "program_interests_program_id_fkey";

-- DropForeignKey
ALTER TABLE "programs" DROP CONSTRAINT "programs_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_program_id_fkey";

-- DropForeignKey
ALTER TABLE "user_saved_programs" DROP CONSTRAINT "user_saved_programs_program_id_fkey";

-- DropForeignKey
ALTER TABLE "user_saved_programs" DROP CONSTRAINT "user_saved_programs_user_id_fkey";

-- AlterTable
ALTER TABLE "deadlines" DROP CONSTRAINT "deadlines_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "program_id" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "interests" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_pkey",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PROGRAM',
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "list_id" SET DATA TYPE TEXT,
ALTER COLUMN "program_id" DROP NOT NULL,
ALTER COLUMN "program_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "list_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lists" DROP CONSTRAINT "lists_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "author_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "program_interests" DROP CONSTRAINT "program_interests_pkey",
ALTER COLUMN "program_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "program_interests_pkey" PRIMARY KEY ("program_id", "interest_id");

-- AlterTable
ALTER TABLE "programs" DROP CONSTRAINT "programs_pkey",
ADD COLUMN     "allows_international" BOOLEAN DEFAULT true,
ADD COLUMN     "is_one_on_one" BOOLEAN DEFAULT false,
ADD COLUMN     "offers_college_credit" BOOLEAN DEFAULT false,
ADD COLUMN     "trpc_data" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "provider_id" SET DATA TYPE TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PROGRAM',
ALTER COLUMN "url" SET DATA TYPE TEXT,
ALTER COLUMN "logo_url" SET DATA TYPE TEXT,
DROP COLUMN "experts_choice_rating",
ADD COLUMN     "experts_choice_rating" TEXT,
DROP COLUMN "impact_rating",
ADD COLUMN     "impact_rating" TEXT,
ALTER COLUMN "eligible_grades" DROP NOT NULL,
ALTER COLUMN "eligible_grades" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "programs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "providers" DROP CONSTRAINT "providers_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ADD CONSTRAINT "providers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
ADD COLUMN     "location_lat" DOUBLE PRECISION,
ADD COLUMN     "location_lng" DOUBLE PRECISION,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "program_id" SET DATA TYPE TEXT,
ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "end_date" SET DATA TYPE TIMESTAMP(3),
DROP COLUMN "location_type",
ADD COLUMN     "location_type" TEXT,
ALTER COLUMN "location_name" SET DATA TYPE TEXT,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_saved_programs" DROP CONSTRAINT "user_saved_programs_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "program_id" SET DATA TYPE TEXT,
ALTER COLUMN "saved_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "user_saved_programs_pkey" PRIMARY KEY ("user_id", "program_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password_hash" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'STUDENT',
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "ImpactRating";

-- DropEnum
DROP TYPE "LocationType";

-- DropEnum
DROP TYPE "ProgramType";

-- DropEnum
DROP TYPE "Rating";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_interests" ADD CONSTRAINT "program_interests_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_programs" ADD CONSTRAINT "user_saved_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_programs" ADD CONSTRAINT "user_saved_programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
