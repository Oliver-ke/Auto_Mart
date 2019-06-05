import cloudinary from 'cloudinary';
import fs from 'fs';
import nameHelper from './fileNamehelper';

export default (reqFile) => {
  const file = reqFile;
  // change file name to a unique one
  file.name = nameHelper(file.name);
  const path = `${__dirname}/../../tempUploads/${file.name}`;
  return new Promise(async (resolve, reject) => {
    // temporary store file in server
    file.mv(path, (err) => {
      if (err) return reject(err);
    });
    // uplaod stored file to cloudinary
    try {
      const res = await cloudinary.v2.uploader.upload(path, { folder: '/carUploads' });
      // remove stored file and return upload result
      fs.unlink(path, (err) => {
        if (err) return reject(err);
      });
      return resolve(res);
    } catch (uploadErr) {
      reject(uploadErr);
    }
  });
};
