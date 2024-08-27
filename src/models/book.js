import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Book = sequelize.define(
  'books',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isbn: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stockStatus: {
      type: DataTypes.STRING(100),
    },
    categoryId: {
      type: DataTypes.STRING(200),
    },
    mileage: {
      type: DataTypes.NUMBER,
    },
    categoryName: {
      type: DataTypes.STRING(200),
    },
    publisher: {
      type: DataTypes.STRING(200),
    },
    adult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fixedPrice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priceStandard: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    priceSales: {
      type: DataTypes.NUMBER,
    },
    customerReviewRank: {
      type: DataTypes.NUMBER,
    },
    queryType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false, // Since we are managing `created_at` and `updated_at` manually
  },
);

export default Book;
