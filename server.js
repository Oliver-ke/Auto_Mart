const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const path = require('path');
require('dotenv').config();

const app = express();

// Add file upload middleware to receive multipart (file) data on reqest object
app.use(fileUpload());

// setup express body-perser for json data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// configure cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Routers
const users = require('./routes/api/users');
const car = require('./routes/api/car');
const carOrder = require('./routes/api/carOrder');
const flag = require('./routes/api/flag');

// Api routes
app.use('/api/v1/auth', users);
app.use('/api/v1/car', car);
app.use('/api/v1/order', carOrder);
app.use('/api/v1/flag', flag);

// Welcome page
app.use(express.static('public'));
app.get('/', (req, res) => res.sendfile(path.resolve(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('app running on port', PORT);
});

module.exports = app;
