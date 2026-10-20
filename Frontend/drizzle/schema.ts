import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const traineeProfiles = pgTable("trainee_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  eyesightStatus: text("eyesight_status").notNull().default("normal"),
  prescriptionDetails: text("prescription_details").notNull().default(""),
  eyesightConditions: text("eyesight_conditions").notNull().default(""),
  medications: text("medications").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`now()`),
});
