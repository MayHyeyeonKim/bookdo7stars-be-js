import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Wishlist = sequelize.define(
  'wishlist',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'book_id'], // user_id와 book_id를 복합 키로 설정
      },
    ],
    hasPrimaryKey: true,
    tableName: 'wishlist', // 테이블 이름은 'list'
    freezeTableName: true,
  },
);

export default Wishlist;
