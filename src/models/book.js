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
    pubDate: {
      type: DataTypes.DATE,
      field: 'pub_date',
    },
    stockStatus: {
      type: DataTypes.STRING(100),
      field: 'stock_status',
    },
    categoryId: {
      type: DataTypes.STRING(200),
      field: 'category_id',
    },
    mileage: {
      type: DataTypes.NUMBER,
    },
    categoryName: {
      type: DataTypes.STRING(200),
      field: 'category_name',
    },
    publisher: {
      type: DataTypes.STRING(200),
    },
    salesPoint: {
      type: DataTypes.NUMBER,
      field: 'sales_point',
    },
    adult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fixedPrice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'fixed_price',
    },
    priceStandard: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'price_standard',
    },
    priceSales: {
      type: DataTypes.NUMBER,
      field: 'price_sales',
    },
    customerReviewRank: {
      type: DataTypes.NUMBER,
      field: 'customer_review_rank',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  },
);

export default Book;
