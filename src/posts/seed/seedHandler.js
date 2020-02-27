const Post = require('../Post');
const posts = require('./seedData');
const postContent = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue lectus nec maximus luctus. Maecenas eget mauris scelerisque, pretium ligula ac, pretium eros. In finibus imperdiet tempor. Ut ut mollis lorem, vitae consectetur sem. Nunc in lacus at turpis eleifend rutrum vitae vel leo. Maecenas vitae nisl non purus tincidunt venenatis id vel lectus. Proin semper eros enim, quis mattis dui posuere ac. Aliquam tortor lorem, tristique vel interdum quis, bibendum at nulla. Donec velit leo, accumsan sed placerat et, rhoncus nec mauris. Maecenas at condimentum ante. Nunc ultricies, ante in hendrerit imperdiet, lorem diam eleifend libero, eu vulputate velit quam non nisi. Cras finibus metus ut turpis malesuada eleifend. Proin purus diam, venenatis in ligula vitae, tristique ornare nunc. Quisque pretium ullamcorper sollicitudin. Phasellus quis condimentum ligula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

Curabitur malesuada ac est in fermentum. In ligula enim, lobortis sed condimentum sed, pulvinar vel sem. In vulputate lobortis nisl, eu tempus quam tincidunt a. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque mi urna, vulputate non lorem sed, egestas dictum quam. Duis facilisis lectus vehicula, mollis ligula vel, blandit eros. Nullam gravida metus bibendum purus porta convallis. Integer nec nisi ut neque volutpat auctor. Proin tempus ultrices enim at cursus. Proin at luctus neque, vitae pellentesque mauris. Nunc a dui eget risus ultrices aliquet sed sit amet diam. Proin fermentum nisl ac ex placerat, vel varius mi porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam vitae metus ultricies, feugiat sapien id, vestibulum nulla. Aliquam erat volutpat.
`

module.exports.seedPosts = function() {
  posts.forEach(async (post, index) => {
    post.content = postContent;
    post.author = `${post.author}${index}`
    const dbPost = new Post(post);
    await dbPost.save();
  });
};