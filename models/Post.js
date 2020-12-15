const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  commentsCount: Number,
  likesCount: Number,
  sharesCount: Number,
  shares:[
    {
      username: String,
      createdAt: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users' //refererer til collection "users" i databasen
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users' //refererer til collection "users" i databasen
  },
  sharedPost: {
    type: Schema.Types.ObjectId,
    ref: 'posts' //refererer til collection "posts" i databasen
  }
});

module.exports = model('Post', postSchema);
