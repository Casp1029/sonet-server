const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    user: ID!
    sharedPost: ID
    createdAt: String!
    username: String!
    comments: [Comment]!
    commentCount: Int!
    commentsCount: Int!
    likes: [Like]!
    likeCount: Int!
    likesCount: Int!
    shares: [Share]!
    shareCount: Int!
    sharesCount: Int!
  }
  type Image {
    id: ID!
    category: String!
    filename: String!
    desc: String
    createdAt: String!
    url: String!
    path: String!
    img: File!
    user: ID!
    username: String!
    comments: [Comment]!
    commentCount: Int!
    commentsCount: Int!
    likes: [Like]!
    likeCount: Int!
    likesCount: Int!
    shares: [Share]!
    shareCount: Int!
    sharesCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Share {
    id: ID!
    username: String!
    createdAt: String!
    user: ID!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    firstName: String
    middleNames: String
    lastName: String
    description: String
    homeCity: String
    city: String
    country: String
    mobileNumber: String
    maritalStatus: String
    education: String
    job: String
    profilePic: ProfilePic
  }
  type ProfilePic {
    id: ID!
    category: String!
    filename: String!
    mimetype: String!
    encoding: String
    desc: String
    createdAt: String!
    url: String!
    path: String!
    img: File!
    comments: [Comment]!
    commentCount: Int!
    commentsCount: Int!
    likes: [Like]!
    likeCount: Int!
    likesCount: Int!
    shares: [Share]!
    shareCount: Int!
    sharesCount: Int!
  }
  type File {
    id: ID!
    url: String
    filename: String!
    mimetype: String!
    encoding: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input UpdateUserInput {
    homeCityInput: String
    cityInput: String
    mobileNumberInput: String
    maritalStatusInput: String
    educationInput: String
    jobInput: String
  }
  input UpdateNamesInput {
    firstNameInput: String
    middleNamesInput: String
    lastNameInput: String
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getTopLikedPosts: [Post]
    getUserPosts(user: ID!): [Post]
    getUsers: [User]
    getUser(userId: ID!): User
    getImages: [Image]
    getImage(imageId: ID!): Image
    getUserImages(user: ID!): [Image]
    files: [String]
    uploads: [File]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updateUser(userId: ID!, updateUserInput: UpdateUserInput): User!
    updateNames(userId: ID!, updateNamesInput: UpdateNamesInput): User!
    updateDesc(userId: ID!, descriptionInput: String!): User!
    updateCountry(userId: ID!, countryInput: String!, descriptionInput: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    sharePost(postId: ID!, body: String!): Post!
    uploadProfilePic(file: Upload!): File!
    uploadCoverPic(file: Upload!): File!
  }
  type Subscription {
    newPost: Post!
  }
`;
