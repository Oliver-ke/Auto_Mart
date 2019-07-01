import {
  getUnsoldCars,
  getCarWithQuery,
  getCarBetweenMaxMinPrice,
  getAllCarsWithQuery,
} from '../../db/queryHelpers/car';

export const minMaxMiddleWare = async (req, res, next) => {
  const minPrice = req.query.min_price ? +req.query.min_price : null;
  const maxPrice = req.query.max_price ? +req.query.max_price : null;
  if (minPrice && maxPrice) {
    const { result } = await getCarBetweenMaxMinPrice({ min: minPrice, max: maxPrice });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const stateMiddleware = async (req, res, next) => {
  let { state } = req.query;
  state = state ? state.toLowerCase() : null;
  if (state === 'new' || state === 'used') {
    const { result } = await getCarWithQuery({ state });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

export const manufactureMiddleware = async (req, res, next) => {
  const manufacturer = req.query.manufacturer ? req.query.manufacturer.toLowerCase() : null;
  if (manufacturer) {
    const { result } = await getCarWithQuery({ manufacturer });
    return res.status(200).json({ status: 200, data: result });
  }
  return next();
};

const bodyTypeMiddleware = async (req, res) => {
  const bodyType = req.query.body_type ? req.query.body_type.toLowerCase() : null;
  if (bodyType) {
    const { error, result } = await getAllCarsWithQuery({ body_type: bodyType });
    if (error) {
      return res.status(500).json({ status: 500, error: 'Server error' });
    }
    return res.status(200).json({ status: 200, data: result });
  }
  return res.status(400).json({ status: 400, error: 'invalid query parameter' });
};

export const statusMiddleware = async (req, res, next) => {
  let { status, body_type: bodyType } = req.query;
  status = status ? status.toLowerCase() : null;
  if (status !== 'available') {
    if (bodyType) {
      return bodyTypeMiddleware(req, res);
    }
    if (Object.values(req.query).length === 0) {
      return next();
    }
    return res.status(400).json({ status: 400, error: 'invalid query parameter' });
  }
  if (status === 'available' && Object.keys(req.query).length > 1) {
    return next();
  }
  const { result } = await getUnsoldCars();
  return res.status(200).json({ status: 200, data: result });
};
