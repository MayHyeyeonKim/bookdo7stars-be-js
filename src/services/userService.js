import User from '../models/user.js';

class UserService {
  async createUser(user) {
    user.status = 'inactive';
    user.grade = 'Bronze';
    user.adminyn = 'N';

    return await User.create(user);
  }
}

export default new UserService(); // Singleton pattern for UserService
