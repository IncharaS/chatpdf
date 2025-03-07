// import type { Config } from 'drizzle-kit'
// import * as dotenv from "dotenv";
// dotenv.config({ path: '.env' });

// export default {
//     driver: 'pglite',
//     schema: './src/lib/db/schema.ts',
//     //where the schema lies
//     dbCredentials: {
//         url: process.env.DATABASE_URL as String,
//     }
// } satisfies Config

import { defineConfig } from 'drizzle-kit';
import {config} from "dotenv";
config({ path: '.env' });

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/lib/db/schema.ts',
    //where the schema lies
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
});
// npx drizzle-kit push:pg,
//this tells if our database in neon is syced up with our schema
