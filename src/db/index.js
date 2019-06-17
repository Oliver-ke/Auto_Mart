import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
  // On production server using db connection string
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.TRAVIS) {
  // Run online test on travis, using a cloud test db instance
  pool = new Pool({ connectionString: process.env.TRAVIS_TEST_DB });
} else {
  // created a Pool using env default config on local
  pool = new Pool();
}

export default {
  query: async (text, params) => {
    const res = await pool.query(text, params);
    return res;
  },
  clearDb: async () => {
    await pool.query('DROP TABLE IF EXISTS orders,cars,users CASCADE');
  },
};

// eyes up unresolve promises might arise
