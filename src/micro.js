const apolloServerMicro = require('apollo-server-micro');
const { createServer } = require("./server");

const server = createServer(apolloServerMicro);

module.exports = server.createHandler();

