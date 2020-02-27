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
        
    const hash = await User.findOne({email: dummyUserData.username}).select('+hash');

    // Assert
    expect(response.username).toBe(dummyUserData.username);
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

  it('should throw if user authentication fails', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();
    const userObj = user.toObject();
    
    userObj.password = 'non-existing-password';

    // Act & Assert
    await expect(service.login(userObj)).rejects.toThrowError('invalid credentials');
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
    expect(response.username).toBe(user.username);
    expect(response.hash).toBeUndefined();
  });

  it('should throw if user not found by id', async () => {
    const userId = '4edd40c86762e0fb12000003';

    // Act & Assert
    await expect(service.getById(userId)).rejects.toThrowError('user not found');
  });

  it('should return user data by username', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    const response = await service.getByUsername(user.username);

    // Assert
    expect(response.username).toBe(user.username);
    expect(response.hash).toBeUndefined();
  });

  it('should return all users data', async () => {
    // Arrange
    let userData = {...dummyUserData};

    const user1 = new User(userData);
    await user1.save();

    userData.username = 'test2';
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
    expect(deletedUser.username).toBe(user.username);
  });

  it('should update the user', async () => {
    // Arrange
    const user = new User(dummyUserData);
    await user.save();

    // Act
    user.username = 'updatedUser';
    delete user.password;

    const updatedUser = await service.update(user);

    // Assert
    expect(updatedUser.username).toBe('updatedUser');
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
  username: 'test',
  password: 'bestpw',
  role: 'user'
}