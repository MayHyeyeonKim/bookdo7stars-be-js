import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(100),
    },
    policyyn: {
      type: DataTypes.BOOLEAN,
    },
    grade: {
      type: DataTypes.STRING(100),
    },
    recipient: {
      type: DataTypes.STRING(200),
    },
    post_code: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.STRING(200),
    },
    address_detail: {
      type: DataTypes.STRING(200),
    },
    adminyn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Since we are managing `created_at` and `updated_at` manually
  },
);

export default User;
