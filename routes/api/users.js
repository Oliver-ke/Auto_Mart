/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();

// Input validation
const validateSignUpRequest = require('../../validators/signUpValidator');
const validateSignInRequest = require('../../validators/signInValidator');

// User memory storage interface
const { addUser, findUser } = require('../../data/User');

// @route POST /auth/signup
// @desc Create user account
// @access Public
router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignUpRequest(req.body);

  if (!isValid) {
    return res.status(400).json({ status: 400, error: errors });
  }
  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    is_admin: typeof req.body.is_admin === 'boolean' ? req.body.is_admin : false,
  };

  addUser(newUser, (error, result) => {
    if (error) {
      return res.status(400).json({ status: 400, error: 'Email already exist' });
    }
    return res.status(201).json({ status: 201, data: result });
  });
});

router.post('/signin', (req, res) => {
  const { errors, isValid } = validateSignInRequest(req.body);
  if (!isValid) {
    return res.status(400).json({ status: 400, error: errors });
  }
  findUser(req.body, (err, result) => {
    if (err) {
      return res.status(401).json({ status: 401, error: err });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

router.get('/', (req, res) => res.status(200).json({ msg: 'working' }));
module.exports = router;
