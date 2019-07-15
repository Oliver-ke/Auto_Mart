import pool from './index';
import userTable from './models/Users';
import flagTable from './models/Flag';
import orderTable from './models/Order';
import carTable from './models/Car';

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
