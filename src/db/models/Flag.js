const Flag = `CREATE TABLE IF NOT EXISTS
      flags(
        id SERIAL PRIMARY KEY,
        car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        created_on DATE NOT NULL,
        reason VARCHAR(200) NOT NULL,
        description VARCHAR(250) NOT NULL
      )`;

export default Flag;
