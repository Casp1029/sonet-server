const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const imagesResolvers = require('./images');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    shareCount: (parent) => parent.shares.length
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...imagesResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...imagesResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
};
