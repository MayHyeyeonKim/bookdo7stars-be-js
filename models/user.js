const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Set to true if you want to verify the server's certificate
    },
  },
});

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

module.exports = User;
