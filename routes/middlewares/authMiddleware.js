const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // verify users token on request header before proceeding request
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodeData;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, error });
  }
};
