import userService from '../../src/services/userService'; // Adjust path as needed
import User from '../../src/models/user'; // Adjust path as needed

// Mock the User model
jest.mock('../../src/models/user');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with default values for status, grade, and adminyn', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
    };
    const expectedUser = {
      ...inputUser,
      status: 'inactive',
      grade: 'Bronze',
      adminyn: 'N',
    };

    // Mock implementation of User.create
    User.create.mockResolvedValue(expectedUser);

    // Act
    const result = await userService.createUser(inputUser);

    // Assert
    expect(User.create).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual(expectedUser);
  });

  it('should create a user with wrong values for status, grade, and adminyn', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
      status: 'active',
      grade: 'Silver',
      adminyn: 'Y',
    };
    const expectedUser = {
      ...inputUser,
      status: 'inactive',
      grade: 'Bronze',
      adminyn: 'N',
    };

    // Mock implementation of User.create
    User.create.mockResolvedValue(expectedUser);

    // Act
    const result = await userService.createUser(inputUser);

    // Assert
    expect(User.create).toHaveBeenCalledWith(expectedUser);
    expect(result).toEqual(expectedUser);
  });

  it('should handle errors from User.create', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
    };
    const error = new Error('Database error');
    User.create.mockRejectedValue(error);

    // Act & Assert
    await expect(userService.createUser(inputUser)).rejects.toThrow('Database error');
  });
});
