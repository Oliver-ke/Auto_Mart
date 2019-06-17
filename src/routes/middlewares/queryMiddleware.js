import { getCar } from '../../data/Car';

export const minMaxMiddleWare = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const minPrice = req.query.min_price ? +req.query.min_price : null;
  const maxPrice = req.query.max_price ? +req.query.max_price : null;
  if (minPrice && maxPrice) {
    const result = getCar(null, { status, minPrice, maxPrice });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const stateMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  let { state } = req.query;
  state = state ? state.toLowerCase() : null;
  if (state === 'new' || state === 'used') {
    const result = getCar(null, { status, state });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const manufactureMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const manufacturer = req.query.manufacturer ? req.query.manufacturer : null;
  if (manufacturer) {
    const result = getCar(null, { status, manufacturer });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const bodyTypeMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status.toLowerCase();
  const bodyType = req.query.body_type ? req.query.body_type.toLowerCase() : null;
  if (bodyType) {
    const result = getCar(null, { status, bodyType });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const statusMiddleware = (req, res, next) => {
  let { status } = req.query;
  status = status ? status.toLowerCase() : null;
  if (status !== 'available') {
    return res.status(400).json({ status: 400, error: 'invalid query parameter' });
  }
  if (status === 'available' && Object.keys(req.query).length > 1) {
    return next();
  }
  const result = getCar(null, { status });
  return res.status(200).json({ status: 200, data: result });
};