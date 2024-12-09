import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Banner = sequelize.define(
  'banners',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cover: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  },
);

export default Banner;
