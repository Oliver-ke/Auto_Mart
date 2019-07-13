const User = `CREATE TABLE IF NOT EXISTS
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

export default User;
