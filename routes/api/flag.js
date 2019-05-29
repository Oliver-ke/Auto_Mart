const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const flagInputValitator = require('../../validators/flagValidator');
const { addFlag } = require('../../data/Flag');
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
  addFlag(newFlag, data => res.status(201).json({ status: 201, data }));
});

module.exports = router;
