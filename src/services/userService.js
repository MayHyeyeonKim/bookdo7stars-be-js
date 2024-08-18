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

    const isMatch = await bcrypt.compare(user.password, userFound.password);

    if (!isMatch) {
      throw new Error('User not found');
    }

    return userFound;
  }
}

export default new UserService(); // Singleton pattern for UserService

/**
 * 
const inputUser = { user };
이 코드는 user 객체를 inputUser 객체의 속성으로 추가합니다. 
결과적으로, inputUser는 user 객체를 포함하는 속성을 가지게 됩니다. 
이 경우, inputUser는 다음과 같은 구조를 가집니다:

const user = {
  name: 'Alice',
  email: 'alice@example.com'
};

// user 객체를 속성으로 추가
const inputUser = { user };

console.log(inputUser);
// 출력: { user: { name: 'Alice', email: 'alice@example.com' } }

const inputUser = { ...user };
이 코드는 user 객체의 속성을 모두 복사하여 새로운 객체를 만듭니다. 
결과적으로, inputUser는 user 객체의 속성들을 직접 가지게 됩니다:

const user = {
  name: 'Alice',
  email: 'alice@example.com'
};

// user 객체의 모든 속성을 복사하여 새로운 객체 생성
const inputUser = { ...user };

console.log(inputUser);
// 출력: { name: 'Alice', email: 'alice@example.com' }
 */
