const { model, Schema } = require('mongoose');

const imageSchema = new Schema({
    category: String,
    filename: String,
    mimetype: String,
    encoding: String,
    desc: String,
    createdAt: String,
    url: String,
    path: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    username: String,
    comments: [
        {
          body: String,
          username: String,
          createdAt: String
        }
      ],
      commentsCount: Number,
      likes: [
        {
          username: String,
          createdAt: String
        }
      ],
      likesCount: Number,
      shares:[
        {
          username: String,
          createdAt: String,
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          }
        }
      ],
      sharesCount: Number
});

module.exports = model('Image', imageSchema);
