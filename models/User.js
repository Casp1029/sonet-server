const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  firstName: String,
  middleNames: String,
  lastName: String,
  description: String,
  homeCity: String,
  city: String,
  country: String,
  mobileNumber: String,
  maritalStatus: String,
  education: String,
  job: String,
  profilePic: {
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
  },
  coverPic:{
    type: Schema.Types.ObjectId,
    ref: 'images'
  }

});

module.exports = model('User', userSchema);
