import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import flagInputValitator from '../../validators/flagValidator';
import { addFlag } from '../../data/Flag';

const router = express.Router();

// @route POST /flag
// @desc flag car post as fraudulent
// @access Private, only registered user can send flag report
router.post('/', authMiddleware, (req, res) => {
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
  const result = addFlag(newFlag);
  return res.status(201).json({ status: 201, result });
});

export default router;
