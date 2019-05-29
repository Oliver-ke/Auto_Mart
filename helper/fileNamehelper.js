const nameHelper = (fileName) => {
  const moment = new Date();
  const date = moment.toLocaleDateString();
  const uploadDate = date.replace('/', '').replace('/', '');
  const seconds = moment.getMilliseconds();
  const number1 = Math.floor(Math.random() * 20);
  const number2 = Math.floor(Math.random() * 100);
  const mimeType = fileName.slice(fileName.lastIndexOf('.') + 1);
  return `image_${uploadDate}${seconds}${number1}${number2}.${mimeType}`;
};

module.exports = {
  nameHelper,
};
