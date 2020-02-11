const Message = require('./Message');

module.exports.getByUsername = async username => {
  const messages = await Message.find({$or:[ {'sender': username}, {'recipient': username}]});
  const contacts = [];
  messages.forEach(msg => {
    contacts.push(msg.sender);
    contacts.push(msg.recipient);
  });

  const uniqueContacts = contacts.filter((value, index, self) => value && self.indexOf(value) === index && value !== username);

  return {
    messages: messages,
    contacts: uniqueContacts
  }
}

module.exports.createMessage = async message => {
  const newMessage = new Message(message);
  await newMessage.save();

  return await this.getByUsername(message.sender);
}

module.exports.deleteUserMessages = async username => {
  await Message.deleteMany({$or:[ {'sender': username}, {'recipient': username}]});

  return true;
}