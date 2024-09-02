import express from 'express';
import setupSwagger from './src/config/swagger.js';
import { userController, bookController } from './src/controllers/index.js';
import cors from 'cors';
import './src/job/SaveAladinBooks.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

dotenv.config();
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS를 사용하면 true로 설정
      httpOnly: true,
      sameSite: 'Lax', // 다른 도메인 간 쿠키 전송을 허용하려면 'none'으로 설정
    },
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

setupSwagger(app);
app.locals.pretty = true;

app.use('/user', userController);
app.use('/book', bookController);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
