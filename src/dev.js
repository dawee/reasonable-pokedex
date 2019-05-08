const apolloServer = require('apollo-server');
const { createServer } = require("./server");

const server = createServer(apolloServer);

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

