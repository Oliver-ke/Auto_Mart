import pool from '../index';

// Adds order to database
export const addOrder = async (orderData) => {
  const values = Object.values(orderData);
  const columns = Object.keys(orderData).toString();

  const query = {
    text: `INSERT INTO orders(
      ${columns}
    ) VALUES($1, $2, $3, $4, $5, $6)`,
    values,
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message, result: null };
  }
};

// updates order
export const updateOrder = async (id, update) => {
  const key = Object.keys(update).toString();
  const value = Object.values(update).toString();
  const query = {
    text: `UPDATE orders SET ${key}=$2 WHERE id=$1`,
    values: [id, value],
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message };
  }
};

// Get car
export const getOrder = async (condition) => {
  const value = Object.values(condition);
  const key = Object.keys(condition).toString();
  const query = {
    text: ` SELECT * FROM orders WHERE  ${key}=$1`,
    values: value,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
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
