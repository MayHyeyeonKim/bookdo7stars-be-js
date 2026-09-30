import express from 'express';
import setupSwagger from './src/config/swagger.js';
import {
  userController,
  bookController,
  categoryController,
  cartController,
  wishlistController,
  reviewController,
} from './src/controllers/index.js';
import cors from 'cors';
import aladinBooksJob from './src/job/SaveAladinBooks.js';
import './src/models/index.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
aladinBooksJob.init();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'development-only-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS를 사용하면 true로 설정
      httpOnly: true,
      sameSite: 'Lax', // 다른 도메인 간 쿠키 전송을 허용하려면 'none'으로 설정,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

setupSwagger(app);
app.locals.pretty = true;

app.use('/user', userController);
app.use('/wishlist', wishlistController);
app.use('/book', bookController);
app.use('/category', categoryController);
app.use('/cart', cartController);
app.use('/review', reviewController);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
