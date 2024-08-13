import User from '../models/user.js';

class UserService {
  async createUser(user) {
    user.status = 'inactive';
    user.grade = 'Bronze';
    user.adminyn = 'N';

    return await User.create(user);
  }

  async findUser(user) {
    const email = user.email;
    const password = user.password;
    const userFound = await User.findOne({ where: { email, password } });

    if (!userFound) {
      throw new Error('User not found');
    }

    return userFound;
  }
}

export default new UserService(); // Singleton pattern for UserService
