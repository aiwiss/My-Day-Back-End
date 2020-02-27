const db = require('../src/db/memorydb-handler');
const service = require('../src/messages/messageService');
const Message = require('../src/messages/Message');

beforeAll(async () => { await db.connect() });

afterAll(async () => { await db.closeDatabase() });
 
afterEach(async () => { await db.clearDatabase() });

describe('Message Manipulation', () => {

  it('should create message', async () => {
    // Act
    const userMessages = await service.create(dummyMessageData);
    
    // Assert
    expect(userMessages.messages[0]._id).toBeDefined();
    expect(userMessages.messages[0].sender).toBe(dummyMessageData.sender);
    expect(userMessages.messages[0].recipient).toBe(dummyMessageData.recipient);
    expect(userMessages.contacts.length).toBe(1);
  });
  
  it('should remove user messages', async () => {
    // Arrange
    await createMessages();

    // Act
    const deleteSuccess = await service.deleteUserMessages(dummyMessageData.sender);
    const userMessages = await Message.find({ author: dummyMessageData.sender });

    // Assert
    expect(deleteSuccess).toBe(true);
    expect(userMessages.length).toBe(0);
  });

});

describe('Message Retrieval', () => {

  it('should return user messages and contacts', async () => {
    // Arrange
    await createMessages();

    // Act
    const returnedMessages = await service.getByUser(dummyMessageData.sender);

    // Assert
    expect(returnedMessages.messages.length).toBe(2);
  });

});

const createMessages = async () => {
  const message1 = new Message(dummyMessageData);
  await message1.save();

  const sender = dummyMessageData.sender;
  const recipient = dummyMessageData.sender;
  dummyMessageData.sender = recipient;
  dummyMessageData.recipient = sender;

  const message2 = new Message(dummyMessageData);
  await message2.save();
}

const dummyMessageData = {
  sender: 'testuser1',
  recipient: 'testuser2',
  body: 'Test Message Body'
}