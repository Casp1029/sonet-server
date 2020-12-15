const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTopLikedPosts() {
      try {
        const posts = await Post.find().sort({ likesCount: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserPosts(_, { user }) {
      try {
        const userPosts = await Post.find({user}).sort({ createdAt: -1 });
        return userPosts;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        likesCount: 0,
        sharesCount: 0
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.updateOne({ $inc: { likesCount: -1}}, function (err, result) { 
            if (err){ 
                console.log(err) 
            }else{ 
                console.log("Result :", result)  
            } 
          });
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.updateOne({ $inc: { likesCount: 1}}, function (err, result) { 
            if (err){ 
                console.log(err) 
            }else{ 
                console.log("Result :", result)  
            } 
          });
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
    sharePost: async(_, { postId, body }, context) => {
      const { id, username } = checkAuth(context);
      
      const sharingPost = await Post.findById(postId);
  
      if(sharingPost){
          sharingPost.shares.unshift({
              username,
              user: id,
              createdAt: new Date().toISOString()
          })
  
          
          sharingPost.updateOne({ $inc: { sharesCount: 1}}, function (err, result) { 
            if (err){ 
                console.log(err) 
            }else{ 
                console.log("Result :", result)  
            } 
          });

          await sharingPost.save();
          
          const newSharedPost = new Post({
            body,
            user: id,
            sharedPost: postId,
            username,
            createdAt: new Date().toISOString(),
            commentsCount: 0,
            likesCount: 0,
            sharesCount: 0
          });
  
          const post = await newSharedPost.save();
  
          context.pubsub.publish('NEW_POST', {
            newSharedPost: post
          });
  
          return post;
  
      } else throw new UserInputError('Post not found');
    }
  },
    Subscription: {
      newPost: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
      }
    }
  };
