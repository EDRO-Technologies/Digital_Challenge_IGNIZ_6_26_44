DO $$ BEGIN
 CREATE TYPE "public"."alarm_severity" AS ENUM('low', 'medium', 'high', 'critical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."alarm_status" AS ENUM('active', 'acknowledged', 'resolved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alarm" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"alarmable_type" varchar(50) NOT NULL,
	"alarmable_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"severity" "alarm_severity" NOT NULL,
	"status" "alarm_status" DEFAULT 'active' NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cdng" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ngdu_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kust" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"cdng_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mest" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ngdu_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngdu" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "obj" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"mest_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plast" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"obj_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "well" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"kust_id" integer NOT NULL,
	"plast_id" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cdng" ADD CONSTRAINT "cdng_ngdu_id_ngdu_id_fk" FOREIGN KEY ("ngdu_id") REFERENCES "public"."ngdu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kust" ADD CONSTRAINT "kust_cdng_id_cdng_id_fk" FOREIGN KEY ("cdng_id") REFERENCES "public"."cdng"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mest" ADD CONSTRAINT "mest_ngdu_id_ngdu_id_fk" FOREIGN KEY ("ngdu_id") REFERENCES "public"."ngdu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "obj" ADD CONSTRAINT "obj_mest_id_mest_id_fk" FOREIGN KEY ("mest_id") REFERENCES "public"."mest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plast" ADD CONSTRAINT "plast_obj_id_obj_id_fk" FOREIGN KEY ("obj_id") REFERENCES "public"."obj"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "well" ADD CONSTRAINT "well_kust_id_kust_id_fk" FOREIGN KEY ("kust_id") REFERENCES "public"."kust"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "well" ADD CONSTRAINT "well_plast_id_plast_id_fk" FOREIGN KEY ("plast_id") REFERENCES "public"."plast"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_alarmable" ON "alarm" USING btree (alarmable_type,alarmable_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_status" ON "alarm" USING btree (status);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_severity" ON "alarm" USING btree (severity);