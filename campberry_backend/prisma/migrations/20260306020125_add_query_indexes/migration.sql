-- CreateIndex
CREATE INDEX "deadlines_program_id_date_idx" ON "deadlines"("program_id", "date");

-- CreateIndex
CREATE INDEX "list_items_list_id_display_order_idx" ON "list_items"("list_id", "display_order");

-- CreateIndex
CREATE INDEX "list_items_program_id_idx" ON "list_items"("program_id");

-- CreateIndex
CREATE INDEX "lists_author_id_updated_at_idx" ON "lists"("author_id", "updated_at");

-- CreateIndex
CREATE INDEX "lists_is_public_updated_at_idx" ON "lists"("is_public", "updated_at");

-- CreateIndex
CREATE INDEX "program_interests_interest_id_program_id_idx" ON "program_interests"("interest_id", "program_id");

-- CreateIndex
CREATE INDEX "programs_provider_id_idx" ON "programs"("provider_id");

-- CreateIndex
CREATE INDEX "programs_type_idx" ON "programs"("type");

-- CreateIndex
CREATE INDEX "programs_experts_choice_rating_idx" ON "programs"("experts_choice_rating");

-- CreateIndex
CREATE INDEX "programs_impact_rating_idx" ON "programs"("impact_rating");

-- CreateIndex
CREATE INDEX "programs_is_highly_selective_idx" ON "programs"("is_highly_selective");

-- CreateIndex
CREATE INDEX "programs_allows_international_idx" ON "programs"("allows_international");

-- CreateIndex
CREATE INDEX "programs_offers_college_credit_idx" ON "programs"("offers_college_credit");

-- CreateIndex
CREATE INDEX "programs_is_one_on_one_idx" ON "programs"("is_one_on_one");

-- CreateIndex
CREATE INDEX "programs_created_at_idx" ON "programs"("created_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_program_id_idx" ON "sessions"("program_id");

-- CreateIndex
CREATE INDEX "sessions_location_type_program_id_idx" ON "sessions"("location_type", "program_id");

-- CreateIndex
CREATE INDEX "sessions_location_name_idx" ON "sessions"("location_name");

-- CreateIndex
CREATE INDEX "sessions_location_lat_location_lng_idx" ON "sessions"("location_lat", "location_lng");

-- CreateIndex
CREATE INDEX "sessions_start_date_end_date_idx" ON "sessions"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "user_saved_programs_program_id_idx" ON "user_saved_programs"("program_id");
