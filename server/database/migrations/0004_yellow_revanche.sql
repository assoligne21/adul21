ALTER TABLE "admin_users" ADD COLUMN "reset_token" varchar(255);--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "reset_token_expires_at" timestamp;