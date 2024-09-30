import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BookQueryType = sequelize.define(
  'book_query_types',
  {
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    query_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  },
);
export default BookQueryType;
