const { ApolloServer, gql } = require('apollo-server-micro');
const { RESTDataSource } = require("apollo-datasource-rest");

const typeDefs = gql`
  type Pokemon {
    name: String!
    imageUrl: String!
  }
  type Query {
    pokemons: [Pokemon!]!
  }
`;


class PokeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2";
  }

  async getByName(name) {
    return this.get(`/pokemon/${name}`);
  }

  async getList() {
    const data = await this.get("/pokemon");
    const promises = data.results.map(pokemon => this.getByName(pokemon.name));
  
    return Promise.all(promises);
  }
}

const dataSources = () => {
  return {
    pokeAPI: new PokeAPI()
  };
};

const resolvers = {
  Query: {
    pokemons: (_source, _args, { dataSources }) => dataSources.pokeAPI.getList()
  },
  Pokemon: {
    imageUrl: pokemon => pokemon.sprites.front_default,
    name: pokemon =>
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  }
};

const server = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server.createHandler();

