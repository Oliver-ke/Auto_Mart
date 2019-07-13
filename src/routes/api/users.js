import express from 'express';
import bcrypt from 'bcryptjs';
import { isString } from 'util';
import { updateItem, getItems } from '../../db/queryHelpers/helper';
import sendMail from '../../helper/sendMail';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// @route POST /users/<:user-email>/reset_password
// @desc reset password
// @private, only existing users can reset or retrive password
router.post('/:user_email/reset_password', async (req, res) => {
  const { user_email: email } = req.params;
  const { password, new_password: newPassword } = req.body;
  if (newPassword && password) {
    // check new password
    if (!isString(newPassword)) {
      return res.status(400).json({ status: 400, error: 'Password should be a string type' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ status: 400, error: 'New password should be atleast 6 characters' });
    }
    const { result: userArr } = await getItems('users', { email });
    const user = userArr[0];
    if (user) {
      // compare the old password with that in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // if password matches then gen salt, hash new password and update
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        const { result } = await updateItem('users', user.id, { password: hashPassword });
        if (result) {
          return res.status(204).json({ status: 204 });
        }
        return res.status(500).json({ status: 500, error: 'Server error' });
      }
      return res.status(401).json({ status: 401, error: 'Incorrect password or email' });
    }
    // for security reasons, using the same error massage for both not found email and incorrect password
    return res.status(401).json({ status: 401, error: 'Incorrect password or email' });
  }
  // reaching here means user dont know password
  // check to see if email exist
  const { result: userArr } = await getItems('users', { email });
  const user = userArr[0];
  if (user) {
    // generate password for the user, hash, save and send password email
    const newUserPassword = Math.random().toString(36).substring(2, 15);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUserPassword, salt);
    const { result } = await updateItem('users', user.id, { password: hashPassword });
    if (result) {
      // send mail;
      const mail = { email, newUserPassword };
      const { error } = await sendMail(mail);
      if (!error) {
        return res.status(204).json({ status: 204 });
      }
      return res.status(500).json({ status: 500, error: 'Server error, mail not sent' });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(404).json({ status: 404, error: 'Not found' });
});

// @route GET /users
// @desc Retrive the users information
// @private, Only registered users with valid token gets here
router.get('/', authMiddleware, async (req, res) => {
  const { id } = req.userData;
  const { result: user } = await getItems('users', { id });
  if (user) {
    // strip out the password from response data
    const { password, ...resData } = user;
    return res.status(200).json({ status: 200, data: resData });
  }
  return res.status(404).json({ status: 404, error: 'User does not exist' });
});

export default router;
