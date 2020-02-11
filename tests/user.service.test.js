const db = require('../src/db/memorydb-handler');
const service = require('../src/users/userService');
const User = require('../src/users/User');

beforeAll(async () => { await db.connect() });

afterAll(async () => { await db.closeDatabase() });

afterEach(async () => { await db.clearDatabase() });

describe('User Registration', () => {

  it('should add new user', async () => {
    // Arrange & Act
    const response = await service.register(dummyUserData);
        
    const hash = await User.findOne({email: dummyUserData.email}).select('+hash');

    // Assert
    expect(response.email).toBe(dummyUserData.email);
    expect(response.role).toBe(dummyUserData.role);
    expect(hash).toBeDefined();
    expect(response.token).toBeDefined();
  });

  it('should throw if user already exists', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act & Assert
    await expect(service.register(dummyUserData)).rejects.toThrowError('user already exists');
  });

})

describe('User Authentication', () => {

  it('should authenticate the user', async () => {
    // Arrange
    await service.register(dummyUserData);

    // Act
    const response = await service.login(dummyUserData);

    // Assert
    expect(response.email).toBe(dummyUserData.email);
    expect(response.token).toBeDefined();
  });

})

describe('User Retrieval', () => {

  it('should return user data by id', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    const response = await service.getById(user._id);

    // Assert
    expect(response.email).toBe(user.email);
    expect(response.hash).toBeUndefined();
  });

  it('should return user data by email', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    const response = await service.getByEmail(user.email);

    // Assert
    expect(response.email).toBe(user.email);
    expect(response.hash).toBeUndefined();
  });

  it('should return all users data', async () => {
    // Arrange
    let userData = {...dummyUserData};

    const user1 = new User(userData);
    await user1.save();

    userData.email = 'test2@test.com';
    const user2 = new User(userData);
    await user2.save();

    // Act
    const returnedUsers = await service.getAll();

    // Assert
    expect(returnedUsers.length).toBe(2);
  });
})

describe('User Manipulation', () => {
  it('should remove the user', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    const deletedUser = await service.delete(user._id);

    // Assert
    expect(deletedUser.email).toBe(user.email);
  });

  it('should update the user', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    user.email = 'updated@test.com';
    delete user.password;

    const updatedUser = await service.update(user);

    // Assert
    expect(updatedUser.email).toBe('updated@test.com');
  });

  it('should update user password', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    const oldHash = User.findById(user._id).select('+hash');
    user.password = 'newpw';

    // Act
    await service.update(user);
    const updatedUser = User.findById(user._id).select('+hash');

    // Arrange
    expect(updatedUser.hash).not.toEqual(oldHash);
    expect(updatedUser.password).toBeUndefined();
  });

})

const dummyUserData = {
  email: 'test@test.com',
  password: 'bestpw',
  role: 'user',
  gender: 'male'
}