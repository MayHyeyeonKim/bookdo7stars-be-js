const express = require('express');
const pool = require('./config/db');
require('dotenv').config();
const app = express();
app.locals.pretty = true;

app.use('/', require('./controllers/userController'));

app.get('/', async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(result);
    client.release();
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
