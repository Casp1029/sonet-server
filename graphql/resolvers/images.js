const { UserInputError } = require('apollo-server');
const path = require('path');
const fs = require('fs');

const Image = require('../../models/Image');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

const files = [];

function generateRandomString(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqerstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

module.exports = {
    Query: {
        async getImages() {
          try {
            const images = await Image.find().sort({createdAt: -1});
            return images;
          } catch (err) {
            throw new Error(err);
          }
        },
        async getImage(_, { imageId }) {
          try {
            const image = await Image.findById(imageId);
            if (image) {
              return image;
            } else {
              throw new Error('image not found');
            }
          } catch (err) {
            throw new Error(err);
          }
        },
        async getUserImages(_, { user }) {
          try {
            const userImages = await Image.find({user}).sort({ createdAt: -1 });
            return userImages;
          } catch (err) {
            throw new Error(err);
          }
        },
        files: () => files
    },

    Mutation: {
    async uploadProfilePic(_, { file }, context) {
      const authUser = checkAuth(context);
      const { createReadStream, filename, mimetype, encoding } = await file;

      const { ext } = path.parse(filename);
      const randomName = generateRandomString(12) + ext;

        files.push(randomName);

        console.log(file);

        const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
            /* const { filename, stream, mimetype, encoding } = await upload.then(result => result); */
        
            const path = `public/images/${randomName}`
        
            return new Promise((resolve, reject) =>
            stream
                .pipe(fs.createWriteStream(path))
                .on("finish", () => resolve({ 
                category: "profilePic",
                url: `http://localhost:5000/images/${randomName}`, 
                path, 
                filename: randomName, 
                mimetype,
                encoding,
                createdAt: new Date().toISOString(),
                commentsCount: 0,
                likesCount: 0,
                sharesCount: 0
                }))
                .on("error", reject)
            );
        };

        const processUpload = async (upload) => {
          const { createReadStream, filename, mimetype, encoding } = await upload;
          const stream = createReadStream();
          const file = await storeUpload({ stream, filename, mimetype, encoding });
          return file;
        };

        const upload = await processUpload(file);

        
        return {
          url: `http://localhost:5000/images/${randomName}`,
        };
      
    },
    async uploadCoverPic(_, { file }, context) {
        const authUser = checkAuth(context);
        const { createReadStream, filename, mimetype, encoding } = await file;
  
        const { ext } = path.parse(filename);
        const randomName = generateRandomString(12) + ext;
  
  
          files.push(randomName);
  
          console.log(file);
  
          const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
              /* const { filename, stream, mimetype, encoding } = await upload.then(result => result); */
          
              const path = `public/images/${randomName}`
          
              return new Promise((resolve, reject) =>
              stream
                  .pipe(fs.createWriteStream(path))
                  .on("finish", () => resolve({ 
                  category: "coverPic",
                  url: `http://localhost:5000/images/${randomName}`, 
                  path, 
                  filename: randomName, 
                  mimetype,
                  encoding,
                  createdAt: new Date().toISOString(),
                  user: authUser.id,
                  username: authUser.username,
                  commentsCount: 0,
                  likesCount: 0,
                  sharesCount: 0
                  }))
                  .on("error", reject)
              );
          };
  
          const processUpload = async (upload) => {
            const { createReadStream, filename, mimetype, encoding } = await upload;
            const stream = createReadStream();
            const file = await storeUpload({ stream, filename, mimetype, encoding });
            return file;
          };
  
          const upload = await processUpload(file);
    
          await Image.create(upload);
  
        return {
          url: `http://localhost:5000/images/${randomName}`,
        }, upload;
      }
  }
};