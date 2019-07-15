import pool from '../index';

// Adds order to database
export const addOrder = async (orderData) => {
  const values = Object.values(orderData);
  const columns = Object.keys(orderData).toString();

  const query = {
    text: `INSERT INTO orders(
      ${columns}
    ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    values,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message, result: null };
  }
};

// updates order
export const updateOrder = async (id, update) => {
  const key = Object.keys(update).toString();
  const value = Object.values(update).toString();
  const query = {
    text: `UPDATE orders SET ${key}=$2 WHERE id=$1 RETURNING *`,
    values: [id, value],
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message };
  }
};

// Get orders
export const getOrder = async (condition) => {
  const value = Object.values(condition);
  const key = Object.keys(condition).toString();
  const query = {
    text: ` SELECT * FROM orders WHERE  ${key}=$1`,
    values: value,
  };
  try {
    const { rows } = await pool.query(query);
    // postgresSQL returns all entity as string, converting number values to number
    const final = rows.map(row => ({
      ...row,
      amount: +row.amount,
      car_price: +row.car_price,
      buyer: +row.buyer,
      car_id: +row.car_id,
    }));
    return { error: null, result: final };
  } catch (error) {
    return { error: error.message };
  }
};

// delete order from the database
export const deleteCar = async (id) => {
  const query = {
    text: 'DELETE FROM order WHERE id=$1',
    values: [id],
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message };
  }
};
