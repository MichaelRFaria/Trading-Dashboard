-- Manually added migration to allow only one selected account per user
CREATE UNIQUE INDEX "Account_one_selected_per_user"
    ON "Account" ("user_id")
    WHERE "selected" = true;