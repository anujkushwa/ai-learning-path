import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=verify-full"
});

export default pool;
