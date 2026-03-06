-- CreateTable
CREATE TABLE "program_reviews" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_reviews" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "list_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "program_reviews_program_id_created_at_idx" ON "program_reviews"("program_id", "created_at");

-- CreateIndex
CREATE INDEX "program_reviews_user_id_created_at_idx" ON "program_reviews"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "program_reviews_program_id_user_id_key" ON "program_reviews"("program_id", "user_id");

-- CreateIndex
CREATE INDEX "list_reviews_list_id_created_at_idx" ON "list_reviews"("list_id", "created_at");

-- CreateIndex
CREATE INDEX "list_reviews_user_id_created_at_idx" ON "list_reviews"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "list_reviews_list_id_user_id_key" ON "list_reviews"("list_id", "user_id");

-- AddForeignKey
ALTER TABLE "program_reviews" ADD CONSTRAINT "program_reviews_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_reviews" ADD CONSTRAINT "program_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_reviews" ADD CONSTRAINT "list_reviews_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_reviews" ADD CONSTRAINT "list_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
