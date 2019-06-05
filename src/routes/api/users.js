/* eslint-disable consistent-return */
import express from 'express';

// Input validation
import validateSignUpRequest from '../../validators/signUpValidator';
import validateSignInRequest from '../../validators/signInValidator';

// User memory storage interface
import { addUser, findUser } from '../../data/User';

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
  const result = await addUser(newUser);
  if (!result.error) {
    return res.status(201).json({ status: 201, data: result.user });
  }
  return res.status(400).json({ status: 400, error: result.error });
});

// @route POST /auth/signin
// @desc login to user account
// @access Public
router.post('/signin', async (req, res) => {
  const { errors, isValid } = validateSignInRequest(req.body);
  if (!isValid) {
    return res.status(400).json({ status: 400, error: errors });
  }
  const result = await findUser(req.body);
  if (!result.error) {
    return res.status(200).json({ status: 200, data: result.user });
  }
  return res.status(401).json({ status: 401, error: result.error });
});

export default router;
