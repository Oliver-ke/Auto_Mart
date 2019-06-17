import express from 'express';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import path from 'path';
import dotenv from 'dotenv';
import initializeDb from './db/initDb';

// Routers
import users from './routes/api/users';
import car from './routes/api/car';
import carOrder from './routes/api/order';
import flag from './routes/api/flag';

const app = express();
dotenv.config();
// Initialize db, create tables if not present
// do this if current environment is not test
if (process.env.NODE_ENV !== 'test') {
  initializeDb();
}
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

export default app;
