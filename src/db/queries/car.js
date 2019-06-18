import pool from '../index';

// Adds car to database
export const addCar = async (carData) => {
  const values = Object.values(carData);
  const columns = Object.keys(carData).toString();
  let fields;
  if (carData.img_url) {
    fields = '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10';
  } else {
    fields = '$1, $2, $3, $4, $5, $6, $7, $8, $9';
  }
  const query = {
    text: `INSERT INTO cars(
      ${columns}
    ) VALUES(${fields}) RETURNING *`,
    values,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message, result: null };
  }
};

// delete a car from the database
export const deleteCar = async (id) => {
  const query = {
    text: 'DELETE FROM cars WHERE id=$1 ',
    values: [id],
  };
  try {
    const { rowCount } = await pool.query(query);
    return { error: null, result: rowCount };
  } catch (error) {
    return { error: error.message };
  }
};

// updates car price and status
export const updateCar = async (id, update) => {
  const key = Object.keys(update).toString();
  const value = Object.values(update).toString();
  const query = {
    text: `UPDATE cars SET ${key}=$2 WHERE id=$1 RETURNING *`,
    values: [id, value],
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message };
  }
};

// Get a specific car {e.g {owner: 1}
export const getCar = async (condition) => {
  const value = Object.values(condition);
  const key = Object.keys(condition).toString();
  const query = {
    text: `SELECT * FROM cars WHERE ${key}=$1`,
    values: value,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows[0] };
  } catch (error) {
    return { error: error.message };
  }
};

// Get all unsold car
export const getUnsoldCars = async () => {
  const query = {
    text: " SELECT * FROM cars WHERE status='available'",
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};

// Get all cars whether sold or unsold
export const getAllCars = async () => {
  const query = {
    text: ' SELECT * FROM cars',
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};

// Get all car belonging to a user
export const getUserCars = async (userId) => {
  const query = {
    text: ' SELECT * FROM cars WHERE owner=$1',
    values: [userId],
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};

// optional Filter Queries
export const getCarBetweenMaxMinPrice = async (condition) => {
  const values = Object.values(condition);
  const query = {
    text: ` SELECT * FROM cars WHERE price BETWEEN ${values[0]} AND ${values[1]} AND status='available'`,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};

// get available cars with a give query and value
export const getCarWithQuery = async (condition) => {
  const value = Object.values(condition);
  const key = Object.keys(condition).toString();
  const query = {
    text: ` SELECT * FROM cars WHERE ${key}='${value[0]}' AND status='available'`,
  };
  try {
    const { rows } = await pool.query(query);
    return { error: null, result: rows };
  } catch (error) {
    return { error: error.message };
  }
};
