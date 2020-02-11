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
    await expect(service.create(post)).rejects.toThrowError('create operation failed: missing author');
  });

  it('should update post', async () => {
    // Arrange
    const post = new Post(dummyPostData);
    let savedPost = await post.save();
    savedPost.title = 'Updated Test Title';

    // Act
    const updatedPost = await service.update(savedPost._id, savedPost);

    // Assert
    expect(updatedPost._id).toStrictEqual(savedPost._id);
    expect(updatedPost.title).toBe(savedPost.title);
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

  it('should return single post', async () => {
    // Arrange
    const post = new Post(dummyPostData);
    const savedPost = await post.save();

    // Act
    const returnedPost = await service.getById(post._id);

    // Assert
    expect(returnedPost._id).toStrictEqual(savedPost._id);
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
  title: 'Test Post Title',
  content: 'Test Post Content',
  author: 'user1@test.com',
  public: true
}