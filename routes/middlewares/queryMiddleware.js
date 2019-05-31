const { getCar } = require('../../data/Car');

const minMaxMiddleWare = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const minPrice = req.query.min_price ? +req.query.min_price : null;
  const maxPrice = req.query.max_price ? +req.query.max_price : null;
  if (minPrice && maxPrice) {
    return getCar(null, { status, minPrice, maxPrice }, result => res.status(200).json({ status: 200, data: result }),);
  }
  return next();
};

const stateMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  let { state } = req.query;
  state = state ? state.toLowerCase() : null;
  if (state === 'new' || state === 'used') {
    return getCar(null, { status, state }, result => res.status(200).json({ status: 200, data: result }));
  }
  return next();
};

const manufactureMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const manufacturer = req.query.manufacturer ? req.query.manufacturer : null;
  if (manufacturer) {
    return getCar(null, { status, manufacturer }, result => res.status(200).json({ status: 200, data: result }));
  }
  return next();
};

const bodyTypeMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const bodyType = req.query.body_type ? req.query.body_type.toLowerCase() : null;
  if (bodyType) {
    return getCar(null, { status, bodyType }, result => res.status(200).json({ status: 200, data: result }));
  }
  return next();
};

const statusMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status ? status.toLowerCase() : null;
  if (status !== 'available') {
    return res.status(400).json({ status: 400, error: 'invalid query parameter' });
  }
  if (status === 'available' && Object.keys(req.query).length > 1) {
    return next();
  }
  return getCar(null, { status }, result => res.status(200).json({ status: 200, data: result }));
};

module.exports = {
  statusMiddleware,
  manufactureMiddleware,
  stateMiddleware,
  bodyTypeMiddleware,
  minMaxMiddleWare,
};
