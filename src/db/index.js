import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
  // On production server using db connection string
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  // created a Pool using env default config on development
  pool = new Pool();
}

export default {
  query: (text, params) => pool.query(text, params),
};
