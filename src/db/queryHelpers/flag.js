import pool from '../index';

// Adds order to database
export const addFlag = async (orderData) => {
  const values = Object.values(orderData);
  const columns = Object.keys(orderData).toString();

  const query = {
    text: `INSERT INTO flags(
      ${columns}
    ) VALUES($1, $2, $3, $4) RETURNING *`,
    values,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message, result: null };
  }
};

export const getFlags = async () => {
  const query = {
    text: ' SELECT * FROM flags',
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};

// delete flag
export const deleteFlag = async (id) => {
  const query = {
    text: 'DELETE FROM flags WHERE id=$1',
    values: [id],
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message };
  }
};

// export const getFlag = async (condition) => {
//   const value = Object.values(condition);
//   const key = Object.keys(condition).toString();
//   const query = {
//     text: ` SELECT * FROM flags WHERE  ${key}=$1`,
//     values: value,
//   };
//   try {
//     const { rows } = await pool.query(query);
//     return { error: null, result: rows };
//   } catch (error) {
//     return { error: error.message };
//   }
// };
