import express from 'express';
import setupSwagger from './src/config/swagger.js';
import userController from './src/controllers/userController.js';
import cors from 'cors';

const app = express();
// app.use(cors());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

setupSwagger(app);
app.locals.pretty = true;

app.use('/', userController);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
