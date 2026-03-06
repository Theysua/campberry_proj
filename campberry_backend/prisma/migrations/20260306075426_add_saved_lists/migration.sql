-- CreateTable
CREATE TABLE "user_saved_lists" (
    "user_id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_lists_pkey" PRIMARY KEY ("user_id","list_id")
);

-- CreateIndex
CREATE INDEX "user_saved_lists_list_id_idx" ON "user_saved_lists"("list_id");

-- AddForeignKey
ALTER TABLE "user_saved_lists" ADD CONSTRAINT "user_saved_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_lists" ADD CONSTRAINT "user_saved_lists_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
