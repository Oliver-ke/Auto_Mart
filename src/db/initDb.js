import pool from './index';

const carTable = `CREATE TABLE IF NOT EXISTS
      cars(
        id SERIAL PRIMARY KEY,
        owner INT NOT NULL REFERENCES users(id),
        created_on DATE NOT NULL,
        state VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        price NUMERIC NOT NULL,
        manufacturer VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        body_type VARCHAR(100) NOT NULL,
        img_url VARCHAR(250)
      )`;

const orderTable = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        car_price NUMERIC NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_on DATE NOT NULL,
        buyer BIGINT NOT NULL REFERENCES users(id)
      )`;

const flagTable = `CREATE TABLE IF NOT EXISTS
      flags(
        id SERIAL PRIMARY KEY,
        car_id INT NOT NULL REFERENCES cars(id),
        created_on DATE NOT NULL,
        reason VARCHAR(200) NOT NULL,
        description VARCHAR(250) NOT NULL
      )`;

const userTable = `CREATE TABLE IF NOT EXISTS
      users(
        id BIGSERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL,
        is_admin BOOLEAN NOT NULL,
        UNIQUE(email)
      )`;

export default async () => {
  try {
    // check db for response
    await pool.query('SELECT NOW()');
    // create tables
    await pool.query(userTable);
    await pool.query(carTable);
    await pool.query(orderTable);
    await pool.query(flagTable);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database connected with tables');
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error.message);
    }
    return false;
  }
};
