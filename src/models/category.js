import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define(
  'categories',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

export default Category;
