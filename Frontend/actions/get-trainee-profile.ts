import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db.js";

export default defineAction({
  description:
    "Get the most recently updated trainee profile, or null when none exists.",
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const [row] = await getDb()
      .select()
      .from(schema.traineeProfiles)
      .orderBy(desc(schema.traineeProfiles.updatedAt))
      .limit(1);
    return row ?? null;
  },
});
