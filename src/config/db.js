import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false, // Set to true if you want to verify the server's certificate
    },
  },
});

export default sequelize;
