const Car = `CREATE TABLE IF NOT EXISTS
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

export default Car;
