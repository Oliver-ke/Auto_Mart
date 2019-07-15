import express from 'express';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import initializeDb from './db/initDb';

// Route Controllers
import users from './routes/api/users';
import auth from './routes/api/auth';
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

// Enable Cross-origin resource sharing in development
app.use(cors());

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
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/car', car);
app.use('/api/v1/order', carOrder);
app.use('/api/v1/flag', flag);

// Welcome page
app.use(express.static('public'));
app.get('/api/v1', (req, res) => res.sendfile(path.resolve(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('app running on port', PORT);
  }
});

export default app;
