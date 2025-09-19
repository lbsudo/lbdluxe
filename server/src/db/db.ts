import 'dotenv/config'
import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!
// if (!connectionString) {
//     throw new Error('DATABASE_URL is not set. Ensure your .env file has DATABASE_URL and it is being loaded.')
// }

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, {prepare: false})
export const db = drizzle(client);

