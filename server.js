const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
require('dotenv').config();

const app = express();
app.use(fileUpload());
// setup express body-perser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Routes
const users = require('./routes/api/users');
const car = require('./routes/api/car');
const carOrder = require('./routes/api/carOrder');

// Api routes
app.use('/api/v1/auth', users);
app.use('/api/v1/car', car);
app.use('/api/v1/order', carOrder);

// API documentation
app.get('/', (req, res) => {
  res.redirect('https://app.swaggerhub.com/apis-docs/Oliver-ke/AutoMart/1');
});

// custom error middleware to prevent  app from breaking entirely
app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    status: error.status || 500,
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('app running on port', PORT);
});

module.exports = app;
