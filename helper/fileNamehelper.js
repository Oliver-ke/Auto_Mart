const nameHelper = (fileName) => {
  const moment = new Date();
  const date = moment.toLocaleDateString();
  const time = moment.toLocaleTimeString();
  const uploadDate = date.replace('/', '').replace('/', '');
  const uploadTime = time.replace('AM', '').replace('PM', '').replace(':', '').replace(':', '');
  const mimeType = fileName.slice(fileName.lastIndexOf('.') + 1);
  return `image_${uploadDate}${uploadTime.trim()}.${mimeType}`;
};

module.exports = {
  nameHelper,
};
