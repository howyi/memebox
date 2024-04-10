import { defineConfig } from 'drizzle-kit'
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
    tablesFilter: ["memebox_*"],
    schema: "./drizzle/schema.ts",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.POSTGRES_URL!,
    },
    verbose: true,
    strict: true,
})