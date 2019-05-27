const cloudinary = require('cloudinary');
const fs = require('fs');
const { nameHelper } = require('./fileNamehelper');

module.exports = (file) => {
  // change file name to a unique one
  file.name = nameHelper(file.name);
  const path = `${__dirname}/../tempUploads/${file.name}`;
  return new Promise((resolve, reject) => {
    // temporary store file in server
    file.mv(path, (err) => {
      if (err) return reject(err);
    });
    // uplaod stored file to cloudinary
    cloudinary.v2.uploader.upload(path, { folder: '/carUploads' }, (error, result) => {
      if (error) return reject(error);
      // remove stored file and return upload result
      fs.unlink(path, (deleteErr) => {
        if (deleteErr) return reject(deleteErr);
        return resolve(result);
      });
    });
  });
};
