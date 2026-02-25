-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'COUNSELOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('PROGRAM', 'COMPETITION');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('MOST_RECOMMENDED', 'HIGHLY_RECOMMENDED');

-- CreateEnum
CREATE TYPE "ImpactRating" AS ENUM ('MOST_HIGH_IMPACT', 'HIGH_IMPACT');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('IN_PERSON', 'ONLINE', 'LOCAL');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "provider_id" UUID NOT NULL,
    "description" TEXT,
    "type" "ProgramType" NOT NULL,
    "url" VARCHAR(2048),
    "logo_url" VARCHAR(2048),
    "is_highly_selective" BOOLEAN DEFAULT false,
    "cost_info" TEXT,
    "admission_info" TEXT,
    "eligibility_info" TEXT,
    "experts_choice_rating" "Rating",
    "impact_rating" "ImpactRating",
    "eligible_grades" INTEGER[],
    "only_us_citizens" BOOLEAN DEFAULT false,
    "only_us_residents" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_interests" (
    "program_id" UUID NOT NULL,
    "interest_id" INTEGER NOT NULL,

    CONSTRAINT "program_interests_pkey" PRIMARY KEY ("program_id","interest_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "location_type" "LocationType",
    "location_name" VARCHAR(255),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deadlines" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "author_id" UUID NOT NULL,
    "is_public" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "author_commentary" TEXT,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_programs" (
    "user_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "saved_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_programs_pkey" PRIMARY KEY ("user_id","program_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "providers_name_key" ON "providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_interests" ADD CONSTRAINT "program_interests_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_interests" ADD CONSTRAINT "program_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_programs" ADD CONSTRAINT "user_saved_programs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_programs" ADD CONSTRAINT "user_saved_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
