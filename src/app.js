const cors = require("cors");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { dataSources } = require("./sources");
const { resolvers, typeDefs } = require("./api");

const app = express();
const server = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

app.use(cors());
server.applyMiddleware({ app });

module.exports = app;
