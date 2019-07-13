const Order = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        car_owner BIGINT NOT NULL REFERENCES users(id),
        car_price NUMERIC NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_on DATE NOT NULL,
        buyer BIGINT NOT NULL REFERENCES users(id)
      )`;

export default Order;
