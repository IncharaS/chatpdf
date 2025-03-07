import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from "drizzle-orm/neon-http"
neonConfig.fetchConnectionCache = true
// to chache the connections that has been set

if (!process.env.DATABASE_URL) {
    throw new Error('database url not found')
}

const sql = neon(process.env.DATABASE_URL)
// connecting to databse

//db calling drizzle
export const db = drizzle(sql);
