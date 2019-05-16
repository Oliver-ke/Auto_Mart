const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'success' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('app running on port', PORT);
});
