import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description:
    "Create a trainee profile, or update it when an id is passed. Returns the saved row.",
  schema: z.object({
    id: z.string().optional().describe("Existing profile id to update"),
    name: z.string().trim().min(1).max(120),
    age: z.number().int().min(5).max(120),
    eyesightStatus: z.enum(["normal", "glasses", "other"]),
    prescriptionDetails: z.string().max(1000).default(""),
    eyesightConditions: z.string().max(1000).default(""),
    medications: z.string().max(1000).default(""),
  }),
  run: async (input) => {
    const db = getDb();
    const id = input.id ?? crypto.randomUUID();
    const values = {
      name: input.name,
      age: input.age,
      eyesightStatus: input.eyesightStatus,
      prescriptionDetails: input.prescriptionDetails,
      eyesightConditions: input.eyesightConditions,
      medications: input.medications,
      updatedAt: new Date().toISOString(),
    };
    await db
      .insert(schema.traineeProfiles)
      .values({ id, ...values })
      .onConflictDoUpdate({
        target: schema.traineeProfiles.id,
        set: values,
      });
    const [row] = await db
      .select()
      .from(schema.traineeProfiles)
      .where(eq(schema.traineeProfiles.id, id));
    return row;
  },
});
