/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating users
const bcrypt = require('bcryptjs');
// memory data store
const Users = [];
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
      return cb(null, userData);
    });
  });
};

module.exports = {
  addUser,
};
