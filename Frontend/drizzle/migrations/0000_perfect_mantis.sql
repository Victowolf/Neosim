CREATE TABLE "trainee_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"eyesight_status" text DEFAULT 'normal' NOT NULL,
	"prescription_details" text DEFAULT '' NOT NULL,
	"eyesight_conditions" text DEFAULT '' NOT NULL,
	"medications" text DEFAULT '' NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "trainee_profiles" ("id", "name", "age", "eyesight_status", "prescription_details", "eyesight_conditions", "medications", "updated_at") VALUES ('trainee-sample-001', 'Alex Morgan', 27, 'glasses', 'Mild myopia, -1.5 D both eyes, single-vision lenses', '', '', now()::text);
