import User from '../models/user.js';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(user) {
    const inputUser = { ...user };
    inputUser.status = 'inactive';
    inputUser.grade = 'Bronze';
    inputUser.adminyn = 'N';
    inputUser.password = await bcrypt.hash(inputUser.password, 10);
    return await User.create(inputUser);
  }

  async findUserByEmail(user) {
    const email = user.email;
    const userFound = await User.findOne({ where: { email } });
    return userFound;
  }

  async findUserByPassword(user) {
    const email = user.email;
    const userFound = await User.findOne({ where: { email } });
    if (!userFound) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(user.password, userFound.password);

    if (!isMatch) {
      throw new Error('Incorrect Password');
    }

    return userFound;
  }
}

export default new UserService(); // Singleton pattern for UserService
