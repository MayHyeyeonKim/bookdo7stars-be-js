import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import Book from './book';
import User from './user';

const Cart = sequelize.define('carts', {});
export default Cart;
