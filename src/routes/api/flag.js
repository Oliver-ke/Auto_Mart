import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import flagInputValitator from '../../validators/flagValidator';
import { addFlag, getFlags } from '../../db/queryHelpers/flag';

const router = express.Router();

// @route POST /flag
// @desc flag car post as fraudulent
// @access Private, only registered user can send flag report
router.post('/', authMiddleware, async (req, res) => {
  const reqInputs = req.body;
  const { errors, isValid } = flagInputValitator(reqInputs);
  if (!isValid) {
    return res.status(400).json({ status: 400, error: errors });
  }
  const newFlag = {
    car_id: req.body.car_id,
    created_on: new Date(),
    reason: req.body.reason,
    description: req.body.description,
  };
  const { result } = await addFlag(newFlag);
  if (result) {
    return res.status(201).json({ status: 201, data: result });
  }
  return res.status(404).json({ status: 404, error: `Car with id ${newFlag.car_id} does not exist` });
});

// @route GET /flag
// @desc Admin get flag post
// @access Private, only admin can view get all flags
router.get('/', authMiddleware, async (req, res) => {
  const { isAdmin } = req.userData;
  if (isAdmin) {
    const { result: flags, error } = await getFlags();
    if (!error) {
      return res.status(200).json({ status: 200, data: flags });
    }
    return res.status(500).json({ status: 500, error: 'Server Error' });
  }
  return res.status(403).json({ status: 403, error: 'Access denied' });
});

export default router;
