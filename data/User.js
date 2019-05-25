/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating users
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// memory data store
const Users = [];
// eslint-disable-next-line consistent-return
const addUser = (userData, cb) => {
  const foundUser = Users.find(user => user.email === userData.email);
  if (foundUser) {
    return cb('Error user already exist', foundUser);
  }
  // geting here then no user with the email exist
  // hash password and add user
  userData.id = Users.length + 1;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userData.password, salt, (hashErr, hash) => {
      if (hashErr) throw err;
      userData.password = hash;
      Users.push(userData);
      const payload = { id: userData.id, email: userData.email, isAdmin: userData.is_admin };
      // Sign token
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (jwtErr, token) => {
        const resData = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          id: userData.id,
          email: userData.email,
          token,
        };
        return cb(jwtErr, resData);
      });
    });
  });
};

const findUser = (data, cb) => {
  const foundUser = Users.find(user => user.email === data.email);
  if (foundUser) {
    bcrypt.compare(data.password, foundUser.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: foundUser.id, email: foundUser.email, isAdmin: foundUser.is_admin };
        // sign token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          const resData = {
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
            id: foundUser.id,
            email: foundUser.email,
            token,
          };
          return cb(err, resData);
        });
      } else {
        return cb('Incorrect email or password', null);
      }
    });
  } else {
    return cb('Authentication fail', null);
  }
};

module.exports = {
  addUser,
  findUser,
};
