const express = require('express');

const app = express();
// setup express body-perser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const users = require('./routes/api/users');

app.use('/api/v1/auth', users);

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
