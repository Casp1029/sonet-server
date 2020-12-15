const { ApolloServer, PubSub } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads:{
    maxFileSize: 1000000 // 1MB
  },
  context: ({ req }) => ({ req, pubsub })
});

const app = express();
server.applyMiddleware({ app });

app.use(express.static('public'));
app.use(cors());

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return app.listen({ port: PORT }, () => {
      console.log(`Server running at http://localhost:5000/ Graphql Playground at http://localhost:5000/graphql `);
    });
  })
  .catch(err => {
    console.error(err)
  })

  /* - efter "server running at"
  ${res.url}
  */