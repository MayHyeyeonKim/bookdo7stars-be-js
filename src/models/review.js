import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Book from './book.js';

const Review = sequelize.define(
  'reviews',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'book_id',
      references: {
        model: Book,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at', // 데이터베이스의 컬럼 이름과 매핑
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at', // 데이터베이스의 컬럼 이름과 매핑
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 활성화
  },
);

export default Review;
