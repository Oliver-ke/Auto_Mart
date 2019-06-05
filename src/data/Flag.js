/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating flags

// memory data store
const Flag = [];
const addFlag = (flagData) => {
  const data = flagData;
  data.id = Flag.length + 1;
  Flag.push(data);
  const resData = {
    id: data.id,
    car_id: data.car_id,
    reason: data.reason,
    description: data.description,
  };
  return resData;
};

export { addFlag };
