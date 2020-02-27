const db = require('../src/db/memorydb-handler');
const service = require('../src/posts/postService');
const Post = require('../src/posts/Post');

beforeAll(async () => { await db.connect() });

afterAll(async () => { await db.closeDatabase() });
 
afterEach(async () => { await db.clearDatabase() });

describe('Post Manipulation', () => {

  it('should create post', async () => {
    // Act
    const createdPost = await service.create(dummyPostData);
    
    // Assert
    expect(createdPost._id).toBeDefined();
    expect(createdPost.author).toBe(dummyPostData.author);
  });

  it('should throw if new post is missing author', async () => {
    // Arrange
    let { author, ...post } = dummyPostData;

    // Act & Assert
    await expect(service.create(post)).rejects.toThrowError('missing author');
  });

  it('should update post', async () => {
    // Arrange
    const post = new Post(dummyPostData);
    let savedPost = await post.save();
    savedPost.content = 'Updated Post Content';
    savedPost.public = false;

    // Act
    const updatedPost = await service.update(savedPost._id, savedPost);

    // Assert
    expect(updatedPost._id).toStrictEqual(savedPost._id);
    expect(updatedPost.content).toBe(savedPost.content);
    expect(updatedPost.public).toBe(savedPost.public);
  });

  it('should remove post', async () => {
    // Arrange
    const post = new Post(dummyPostData);
    const savedPost = await post.save();

    // Act
    const removedPost = await service.delete(savedPost._id);

    // Assert
    expect(removedPost._id).toStrictEqual(savedPost._id);
  });

  it('should remove user posts', async () => {
    // Arrange
    const post1 = new Post(dummyPostData);
    await post1.save();
    const post2 = new Post(dummyPostData);
    await post2.save();

    // Act
    const deleteSuccess = await service.deleteUserPosts(dummyPostData.author);
    const userPosts = await Post.find({ author: dummyPostData.author });

    // Assert
    expect(deleteSuccess).toBe(true);
    expect(userPosts.length).toBe(0);
  });

});

describe('Post Retrieval', () => {

  it('should return single post by id', async () => {
    // Arrange
    const post = new Post(dummyPostData);
    const savedPost = await post.save();

    // Act
    const returnedPost = await service.getById(post._id);

    // Assert
    expect(returnedPost._id).toStrictEqual(savedPost._id);
    expect(returnedPost.author).toBe(savedPost.author);
  });

  it('should return posts by author username', async () => {
    // Arrange
    const post1 = new Post(dummyPostData);
    await post1.save();

    const post2 = new Post(dummyPostData);
    await post2.save();

    // Act
    const returnedPosts = await service.getByUser(dummyPostData.author);

    // Assert
    expect(returnedPosts.length).toBe(2);
  });

  it('should return user\'s favorite posts', async () => {
    // Arrange
    const username = 'testuser2';
    const post1 = new Post(dummyPostData);
    await post1.save();

    const post2 = new Post(dummyPostData);
    await post2.save();

    dummyPostData.favoriteOf = ['testuser3'];
    const post3 = new Post(dummyPostData);
    await post3.save();

    // Act
    const returnedPosts = await service.getFavoritesByUser(username);

    // Assert
    expect(returnedPosts.length).toBe(2);
  });

  it('should return all posts', async () => {
    // Arrange
    const post1 = new Post(dummyPostData);
    const savedPost1 = await post1.save();

    const post2 = new Post(dummyPostData);
    const savedPost2 = await post2.save();

    // Act
    const posts = await service.getAll();

    // Assert
    expect(posts.length).toEqual(2);
    expect(savedPost1._id).not.toEqual(savedPost2._id);
  });

});

const dummyPostData = {
  content: 'Test Post Content',
  author: 'testuser1',
  public: true,
  emotion: 'happy',
  favoriteOf: ['testuser2', 'testuser3']
}