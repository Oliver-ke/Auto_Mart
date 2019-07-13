// Since node-pg converts all types to string, this function converts to num
export default (tbName, data) => {
  if (tbName === 'orders') {
    const result = data.map(row => ({
      ...row,
      amount: +row.amount,
      car_price: +row.car_price,
      buyer: +row.buyer,
      car_id: +row.car_id,
    }));
    return result;
  }
  if (tbName === 'cars') {
    const result = data.map(row => ({ ...row, price: +row.price }));
    return result;
  }
  return data;
};
