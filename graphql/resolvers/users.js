const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { update } = require('../../models/User');
const checkAuth = require('../../util/check-auth');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({createdAt: -1});
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    async updateUser(_, {userId,
      updateUserInput: {
        homeCityInput,
        cityInput,
        mobileNumberInput,
        maritalStatusInput,
        educationInput,
        jobInput
      } 
    }, context){
      const authUser = checkAuth(context);

      const user = await User.findById(userId);

      console.log("updateUser resolver found the user! "+user)

      if(user){
        if(user.id === authUser.id){
          await user.updateOne({ 
            homeCity: homeCityInput,
            city: cityInput,
            mobileNumber: mobileNumberInput,
            maritalStatus: maritalStatusInput,
            education: educationInput,
            job: jobInput
          } );
        }else{
          console.log("You don't have access! (If you do, there's an error in updateUser resolver in users.js)");
        }

      }else{
        console.log("User not found :( check updateUser resolver in users.js");
      }
      return user;
    },
    async updateNames(_, { userId, updateNamesInput: {
      firstNameInput,
      middleNamesInput,
      lastNameInput
    } }, context ){
      const authUser = checkAuth(context);

      const user = await User.findById(userId);

      console.log("updateNames resolver found the user! "+user)

      if(user){
        if(user.id === authUser.id){
          await user.updateOne({ 
            firstName: firstNameInput,
            middleNames: middleNamesInput,
            lastName: lastNameInput
          } );
        }else{
          console.log("You are not authorized! (If you are, there's an error in updateNames resolver in users.js)");
        }

      }else{
        console.log("User not found :( check updateNames resolver in users.js");
      }
      return user;
    },
    async updateDesc(_, { 
      userId,
      descriptionInput
    }, context){
      const authUser = checkAuth(context);

      const user = await User.findById(userId);

      if(user){
        if(user.id === authUser.id){
          await user.updateOne({
            description: descriptionInput
          } );
        }else{
          console.log("You are not authorized! (If you are, there's an error in updateDesc resolver in users.js)");
        }

      }else{
        console.log("User not found :( check updateDesc resolver in users.js");
      }
      return user;
    },
    async updateCountry(_, { 
      userId,
      countryInput,
      descriptionInput
    }, context){
      const authUser = checkAuth(context);

      const user = await User.findById(userId);

      console.log("Console says:")
      console.log(countryInput)
      console.log(descriptionInput)
      console.log("updateCountry resolver found the user! "+user)

      if(user){
        if(user.id === authUser.id){
          await user.updateOne({ 
            country: countryInput,
            description: descriptionInput
          } );
        }else{
          console.log("You are not authorized! (If you are, there's an error in updateCountry resolver in users.js)");
        }

      }else{
        console.log("User not found :( check updateCountry resolver in users.js");
      }
      return user;
    }
  }
};
