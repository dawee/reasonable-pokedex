const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const express = require("express");
const models = require("./models");
const { getDBContext } = require("./db");
const { dataSources } = require("./sources");
const { resolvers, typeDefs } = require("./api");

const app = express();
const server = new ApolloServer({
  context: getDBContext,
  dataSources,
  formatError: error => {
    console.error(error);
    return error;
  },
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

app.use(cors());
server.applyMiddleware({ app });

module.exports = app;
