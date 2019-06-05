/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating users
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// memory data store
const Users = [
  {
    first_name: 'uncle',
    last_name: 'Bob',
    email: 'test@gmail.com',
    password: '$2a$10$MSj7YSmDMXe9NzJ63eg0FuflCvgnbFqHX9hZi72gjNPXF/DeuIE8q',
    id: 1,
    address: 'GRA phase 2 Port Harcourt Rivers state',
  },
];
// eslint-disable-next-line consistent-return

// the function generate json web token for authentication
const signJwt = async (userData) => {
  const payload = { id: userData.id, email: userData.email, isAdmin: userData.is_admin };
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    const user = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      id: userData.id,
      email: userData.email,
      token,
    };
    return { error: null, user };
  } catch (err) {
    return { error: err, user: null };
  }
};
export const addUser = async (userData) => {
  // change email to lower case to avoid case miss match
  userData.email = userData.email.toLowerCase();
  const foundUser = Users.find(user => user.email === userData.email);
  if (foundUser) {
    return { error: 'Error user already exist', user: null };
  }
  // geting here then no user with the email exist
  // hash password and add user
  userData.id = Users.length + 1;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    userData.password = hash;
    Users.push(userData);
    return signJwt(userData);
  } catch (err) {
    return { error: err, user: null };
  }
};

export const findUser = async (data) => {
  data.email = data.email.toLowerCase();
  const foundUser = Users.find(user => user.email === data.email);
  if (foundUser) {
    try {
      const isMatch = await bcrypt.compare(data.password, foundUser.password);
      if (isMatch) {
        return signJwt(foundUser);
      }
      return { error: 'Incorrect email or password', user: null };
    } catch (err) {
      return { error: err, user: null };
    }
  } else {
    return { error: 'Incorrect email or password', user: null };
  }
};
