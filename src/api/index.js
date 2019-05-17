const species = require("./species");

const apis = [species];

module.exports = {
  resolvers: apis.reduce(
    (resolvers, api) => ({ ...resolvers, ...api.resolvers }),
    {}
  ),
  typeDefs: apis.reduce(
    (typeDefs, api) => ({ ...typeDefs, ...api.typeDefs }),
    {}
  )
};
