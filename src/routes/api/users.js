/* eslint-disable consistent-return */
import express from 'express';
import bcrypt from 'bcryptjs';
// Input validation
import validateSignUpRequest from '../../validators/signUpValidator';
import validateSignInRequest from '../../validators/signInValidator';

import signJWT from '../../helper/signJWT';

// db query functions
import { addUser, getUser } from '../../db/queries/user';

const router = express.Router();

// @route POST /auth/signup
// @desc Create user account
// @access Public
router.post('/signup', async (req, res) => {
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
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    // try adding user, errors if email already exist
    const { error } = await addUser(newUser);
    if (!error) {
      const { user } = await signJWT(newUser);
      return res.status(201).json({ status: 201, data: user });
    }
    if (error === 'duplicate key value violates unique constraint "users_email_key"') {
      return res.status(400).json({ status: 400, error: 'Email already exist' });
    }
    return res.status(500).json({ status: 500, error: 'Server Error' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: 500, error: 'Server Error' });
  }
});

// @route POST /auth/signin
// @desc login to user account
// @access Private -> Only registered users can signin
router.post('/signin', async (req, res) => {
  const { errors, isValid } = validateSignInRequest(req.body);
  if (!isValid) {
    return res.status(400).json({ status: 400, error: errors });
  }
  const { password, email } = req.body;
  try {
    const { result, error } = await getUser({ email });
    if (result) {
      const isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) {
        const { user } = await signJWT(result);
        return res.status(200).json({ status: 200, data: user });
      }
      return res.status(401).json({ status: 401, error: 'Incorrect email or password' });
    }
    if (error) {
      return res.status(500).json({ status: 500, error: 'Server Error' });
    }
    return res.status(401).json({ status: 401, error: 'Incorrect email or password' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Server Error' });
  }
});

export default router;
