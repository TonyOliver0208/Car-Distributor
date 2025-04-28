import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_UvObEzM7yTe2@ep-soft-smoke-a5ss7y35-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
