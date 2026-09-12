import { Pool } from "pg";
import dotenv from "dotenv";
 
dotenv.config();
 
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
 
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error on idle client", err);
});
 
export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("[db] PostgreSQL connection OK");
  } finally {
    client.release();
  }
}
 