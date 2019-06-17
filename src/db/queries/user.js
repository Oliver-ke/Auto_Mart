import pool from '../index';

// add a user
export const addUser = async (userData) => {
  const values = Object.values(userData);
  const columns = Object.keys(userData).toString();
  const query = {
    text: `INSERT INTO users(
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

// Gets a user
export const getUser = async (condition) => {
  const value = Object.values(condition);
  const key = Object.keys(condition).toString();
  const query = {
    text: ` SELECT * FROM users WHERE  ${key}=$1`,
    values: value,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message, result: null };
  }
};

// Detete User;
export const deleteUser = async (id) => {
  const query = {
    text: 'DELETE FROM users WHERE id=$1',
    values: [id],
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message };
  }
};

// 0 = operation has no effect;
// 1 = operation has effect;
